import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';

import { Auction } from '~/db/auction-schema';
import { Category } from '~/db/category-schema';
import { Product } from '~/db/product-schema';
import { User } from '~/db/user-schema';

import {
	AuctionOutput,
	CreateAuctionInput,
	GetAuctionsOutput,
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
