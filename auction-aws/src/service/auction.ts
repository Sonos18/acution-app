import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import { Auction } from '~/db/auction-schema';
import { Bid } from '~/db/bid-schema';
import { Category } from '~/db/category-schema';
import { Product } from '~/db/product-schema';
import { User } from '~/db/user-schema';

import { customError } from '~/utils/createHandler';
import {
	AuctionOutput,
	CreateAuctionInput,
	GetAuctionsOutput,
	UpdateAuctionStatusInput,
	lastKeyAuctions
} from '~/utils/types/auction-type';

const dynamoDB = new DynamoDB.DocumentClient();
export const createAuction = async (
	data: CreateAuctionInput,
	userId: string,
	productId: string
) => {
	const auction: Auction = {
		startPrice: data.startPrice,
		endPrice: data.endPrice,
		startTime: data.startTime,
		endTime: data.endTime,
		status: 'spending',
		currentPrice: data.startPrice,
		productId,
		userId,
		auctionId: v4(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	const param: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Auction',
		Item: auction
	};

	await dynamoDB.put(param).promise();
};
export const getAuctionsByUserId = async (userId: string, limit: number, key?: lastKeyAuctions) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'UserIndex',
		KeyConditionExpression: 'userId = :userId AND #st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':userId': userId,
			':status': 'open'
		},
		Limit: limit
	};
	if (key) {
		params.ExclusiveStartKey = key;
	}
	const result = await dynamoDB.query(params).promise();
	return {
		data: result.Items as Auction[],
		lastKey: result.LastEvaluatedKey as lastKeyAuctions
	};
};
export const getAllAuctions = async (limit: number, key?: lastKeyAuctions) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'StatusIndex',
		KeyConditionExpression: '#st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'open'
		},
		Limit: limit
	};
	if (key) {
		params.ExclusiveStartKey = key;
	}

	try {
		const result = await dynamoDB.query(params).promise();
		return {
			data: result.Items as Auction[],
			lastKey: result.LastEvaluatedKey as lastKeyAuctions
		};
	} catch (error) {
		const err = error as Error;
		console.error(err.message);
	}
	return {
		data: [],
		lastKey: undefined
	};
};
export const getAuctionById = async (auctionId: string) => {
	const params: DynamoDB.DocumentClient.GetItemInput = {
		TableName: 'Auction',
		Key: {
			auctionId
		}
	};
	const result = await dynamoDB.get(params).promise();
	if (!result.Item) {
		throw new Error('Auction not found');
	}
	return result.Item as Auction;
};
export const treeShakingAuctions = (
	auctions: Awaited<ReturnType<typeof getAllAuctions>>,
	poduct: Product[],
	categories: Category[],
	users: User[]
): GetAuctionsOutput => {
	const { data, lastKey } = auctions;
	const result: AuctionOutput[] = data.map((auction) => {
		const product = poduct.find((product) => product.productId === auction.productId);
		const category = categories.find((category) => category.categoryId === product?.categoryId);
		const user = users.find((user) => user.userId === auction.userId);
		return {
			auctionId: auction.auctionId,
			status: auction.status,
			startTime: auction.startTime,
			endTime: auction.endTime,
			startPrice: auction.startPrice,
			endPrice: auction.endPrice,
			currentPrice: auction.currentPrice,
			product: {
				productId: product?.productId ?? '',
				productName: product?.productName ?? '',
				description: product?.description ?? '',
				category: category?.categoryName ?? '',
				origin: product?.origin ?? '',
				images: product?.images ?? []
			},
			user: {
				userId: user?.userId ?? '',
				firstName: user?.firstName ?? '',
				lastName: user?.lastName ?? '',
				avatar: user?.avatar ?? ''
			},
			createdAt: auction.createdAt,
			updatedAt: auction.updatedAt
		};
	});
	return {
		data: result,
		lastKey: lastKey as lastKeyAuctions
	};
};
export const treeShakingAuction = (
	auction: Auction,
	product: Product,
	user: User,
	category: Category
) => {
	return {
		auctionId: auction.auctionId,
		status: auction.status,
		startTime: auction.startTime,
		endTime: auction.endTime,
		startPrice: auction.startPrice,
		endPrice: auction.endPrice,
		currentPrice: auction.currentPrice,
		product: {
			productId: product.productId,
			productName: product.productName,
			description: product.description,
			category: category.categoryName,
			origin: product.origin,
			images: product.images
		},
		user: {
			userId: user.userId,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar
		},
		createdAt: auction.createdAt,
		updatedAt: auction.updatedAt
	};
};
export const bidAuction = async (auctionId: string, price: number, userId: string) => {
	const auction = await getAuctionById(auctionId);
	if (auction.status !== 'open') {
		throw new Error('Auction is not open');
	}
	if (price <= auction.currentPrice) {
		throw new Error('Price is not valid');
	}
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Auction',
		Key: {
			auctionId
		},
		UpdateExpression: 'SET currentPrice = :price, winner = :userId',
		ExpressionAttributeValues: {
			':price': price,
			':userId': userId
		},
		ReturnValues: 'ALL_NEW'
	};
	try {
		await dynamoDB.update(params).promise();
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
	const item: Bid = {
		bidId: v4(),
		auctionId,
		userId,
		price,
		createdAt: new Date().toISOString()
	};
	const param: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Bid',
		Item: item
	};
	try {
		await dynamoDB.put(param).promise();
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
	return item;
};
export const updateCurrentPrice = async (auctionId: string, price: number) => {
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Auction',
		Key: {
			auctionId
		},
		UpdateExpression: 'SET currentPrice = :price',
		ExpressionAttributeValues: {
			':price': price
		}
	};
	await dynamoDB.update(params).promise();
};
export const buyAuction = async (auctionId: string, userId: string, endPrice: number) => {
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Auction',
		Key: {
			auctionId
		},
		UpdateExpression: 'SET #st = :status, currentPrice = :currentPrice, winner = :userId',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'closing',
			':userId': userId,
			':currentPrice': endPrice
		}
	};
	try {
		await dynamoDB.update(params).promise();
	} catch (error) {
		throw customError((error as Error).message, 500);
	}
};
export const CloseAuction = async (auctionId: string) => {
	const param: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Auction',
		Key: {
			auctionId
		},
		UpdateExpression: 'SET #st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'cancelled'
		}
	};
};
export const refreshAuctionStatus = async (status: string, end: boolean) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'StatusIndex',
		KeyConditionExpression: '#st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': status
		}
	};
	const result = await dynamoDB.query(params).promise();
	const auctions = result.Items as Auction[];
	const now = new Date().getTime();
	const updateAuctions = auctions.map((auction) => {
		if (!end) {
			if (new Date(auction.startTime).getTime() < now) {
				return {
					auctionId: auction.auctionId,
					status: 'open'
				};
			}
			return null;
		} else {
			if (new Date(auction.endTime).getTime() < now) {
				return {
					auctionId: auction.auctionId,
					status: 'closing'
				};
			}
			return null;
		}
	});
	const filterAuction = updateAuctions.filter(
		(auction) => auction !== null
	) as UpdateAuctionStatusInput[];
	const updateParams = filterAuction.map((auction) => {
		return {
			PutRequest: {
				Item: {
					TableName: 'Auction',
					auctionId: auction.auctionId,
					status: auction.status
				}
			}
		};
	});
	const batchParams: DynamoDB.DocumentClient.BatchWriteItemInput = {
		RequestItems: {
			Auction: updateParams
		}
	};
	try {
		await dynamoDB.batchWrite(batchParams).promise();
	} catch (error) {
		customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const confirmStatusAuction = async (auctionId: string, userId: string) => {
	const auction = await getAuctionById(auctionId);
	if (auction.userId !== userId) {
		throw customError('You are not owner of this auction', StatusCodes.FORBIDDEN);
	}
	if (auction.status !== 'closing') {
		throw customError('Auction is not closing', StatusCodes.BAD_REQUEST);
	}
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Auction',
		Key: {
			auctionId
		},
		UpdateExpression: 'SET #st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'closed'
		}
	};
	await dynamoDB.update(params).promise();
};
export const getAllClosingAuctions = async (userId: string) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'UserIndex',
		KeyConditionExpression: 'userId = :userId AND #st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':userId': userId,
			':status': 'closing'
		}
	};
	const result = await dynamoDB.query(params).promise();
	return result.Items as Auction[];
};