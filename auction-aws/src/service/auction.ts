import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import { Auction } from '~/db/auction-schema';
import { Bid } from '~/db/bid-schema';
import { Category } from '~/db/category-schema';
import { Payment } from '~/db/payment-schema';
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
	const now = new Date().getTime();
	const startTime = new Date(data.startTime).getTime();
	const auction: Auction = {
		startPrice: data.startPrice,
		endPrice: data.endPrice,
		startTime: data.startTime,
		endTime: data.endTime,
		status: startTime < now ? 'open' : 'spending',
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
		KeyConditionExpression: 'userId = :userId',
		ExpressionAttributeValues: {
			':userId': userId
		},
		Limit: limit
	};
	if (key) {
		params.ExclusiveStartKey = key;
	}
	const result = await dynamoDB.query(params).promise();
	if (!result.Items || result.Items.length === 0) {
		return;
	}
	return {
		data: result.Items as Auction[],
		lastKey: result.LastEvaluatedKey as lastKeyAuctions
	};
};
export const getAuctions= async (start:number,end:number) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'StatusIndex',
		KeyConditionExpression: '#st = :status',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'open'
		}
	};
	let auctions: Auction[] = [];
	try {
		const result = await dynamoDB.query(params).promise();
		auctions=result.Items as Auction[];
	} catch (error) {
		console.log('error', (error as Error).message);
	}
	//sort auction by createdAt
	auctions=auctions.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
	const data=auctions.slice(start,end);
	return data;
};
export const getAllAuctions = async (
	limit: number,
	key?: lastKeyAuctions,
	productIds?: string[]
) => {
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
	if (productIds && productIds.length > 0) {
		params.FilterExpression = 'productId IN (:productIds)';
		params.ExpressionAttributeValues = {
			...params.ExpressionAttributeValues,
			':productIds': productIds
		};
	}
	try {
		const result = await dynamoDB.query(params).promise();
		if (!result.Items || result.Items.length === 0) {
			return;
		}
		return {
			data: result.Items as Auction[],
			lastKey: result.LastEvaluatedKey as lastKeyAuctions
		};
	} catch (error) {
		const err = error as Error;
		console.error(err.message);
	}
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
	auctions: NonNullable<Awaited<ReturnType<typeof getAuctions>>>,
	poduct: Product[],
	categories: Category[] | string,
	users: User[],
	limit:number
): GetAuctionsOutput => {
	const result: AuctionOutput[] = auctions.map((auction) => {
		const product = poduct.find((product) => product.productId === auction.productId);
		let nameCategory: string | undefined;
		if (typeof categories === 'string') {
			nameCategory = categories;
		} else {
			const category = categories.find((category) => category.categoryId === product?.categoryId);
			nameCategory = category?.categoryName;
		}
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
				category: nameCategory ?? '',
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
		//around total if 0.2=>1, if 0.8=>1
		total: Math.round(auctions.length / limit + 0.5)
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
export const UpdateStatusAuction = async (auctionId: string, status: string) => {
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
			':status': status
		}
	};
	try {
		await dynamoDB.update(param).promise();
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const refreshAuctionStatus = async (status: string, end: boolean) => {
	const auctions = await getAuctionsByStatus(status);
	const now = new Date().getTime();
	if (auctions.length === 0) return;
	for (const auction of auctions) {
		if (status === 'spending' && new Date(auction.startTime).getTime() < now) {
			UpdateStatusAuction(auction.auctionId, 'open');
		} else if (status === 'open' && new Date(auction.endTime).getTime() < now) {
			UpdateStatusAuction(auction.auctionId, 'closing');
		}
	}
};
export const confirmStatusAuction = async (auctionId: string, userId: string) => {
	const auction = await getAuctionById(auctionId);
	if (!auction.winner) {
		throw customError('Auction has no winner', StatusCodes.BAD_REQUEST);
	}
	if (auction.userId !== userId) {
		throw customError('You are not owner of this auction', StatusCodes.FORBIDDEN);
	}
	if (auction.status !== 'closing') {
		throw customError('Auction is not closing', StatusCodes.BAD_REQUEST);
	}
	UpdateStatusAuction(auctionId, 'closed');
	const payment: Payment = {
		paymentId: v4(),
		userId: auction.winner,
		total: auction.currentPrice,
		status: 'pending',
		createdAt: new Date().toISOString(),
		auctionId: auction.auctionId
	};
	return payment;
};
export const getAllClosingAuctions = async (userId: string) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'StatusIndex',
		KeyConditionExpression: '#st = :status',
		FilterExpression: 'userId = :userId',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':userId': userId,
			':status': 'closing'
		}
	};
	try {
		const result = await dynamoDB.query(params).promise();
		if (!result.Items) {
			return null;
		} else return result.Items as Auction[];
	} catch (error) {
		console.log('error', (error as Error).message);
	}
};
export const getAuctionsByStatus = async (status: string) => {
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
	return result.Items as Auction[];
};
export const getAUctionsByProductIds = async (productIds: string[]) => {
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			Auction: {
				Keys: productIds.map((productId) => ({ productId }))
			}
		}
	};
	const result = await dynamoDB.batchGet(params).promise();
	if (!result.Responses) {
		return [];
	}
	return result.Responses.Auction as Auction[];
};
export const getAuctionsToNotify = async () => {
	const today = new Date().toISOString().split('T')[0];
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Auction',
		IndexName: 'StatusIndex',
		KeyConditionExpression: '#st = :status',
		FilterExpression: 'endTime between :start and :end',
		ExpressionAttributeNames: {
			'#st': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'open',
			':start': today + 'T00:00:00Z',
			':end': today + 'T23:59:59Z'
		}
	};
	const result = await dynamoDB.query(params).promise();
	if (!result.Items) {
		return;
	}
	return result.Items as Auction[];
};
export const getAuctionsByIds = async (auctionIds: string[]) => {
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			Auction: {
				Keys: auctionIds.map((auctionId) => ({ auctionId }))
			}
		}
	};
	const result = await dynamoDB.batchGet(params).promise();
	if (!result.Responses) {
		return [];
	}
	return result.Responses.Auction as Auction[];
};
