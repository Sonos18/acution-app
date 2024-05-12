import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';

import { Auction } from '~/db/auction-schema';
import { Product } from '~/db/product-schema';

import { GetImgUrl } from '~/handler/s3/get-url';

import { customError } from '~/utils/createHandler';
import { CreateProductInput } from '~/utils/types/product-type';

import { getCategoryByName } from './category';

const dynamoDB = new DynamoDB.DocumentClient();
export const createProduct = async (data: CreateProductInput) => {
	const product: Product = {
		...data,
		productId: v4(),
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString()
	};
	const param: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Product',
		Item: product
	};
	await dynamoDB.put(param).promise();
	return product;
};
export const getProductById = async (productId: string) => {
	const param: DynamoDB.DocumentClient.GetItemInput = {
		TableName: 'Product',
		Key: { productId }
	};
	const { Item } = await dynamoDB.get(param).promise();
	if (!Item) {
		throw customError('Product not found');
	}
	return Item as Product;
};
export const getProductsByCategoryId = async (categoryId: string) => {
	const param: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Product',
		IndexName: 'CategoryIndex',
		KeyConditionExpression: 'categoryId = :categoryId',
		ExpressionAttributeValues: { ':categoryId': categoryId }
	};
	const { Items } = await dynamoDB.query(param).promise();
	if (!Items) {
		throw customError('Product not found');
	}
	return Items as Product[];
};

const updateProduct = async (productId: string, data: Partial<Product>) => {
	const product = await getProductById(productId);
	const updatedProduct = { ...product, ...data, updatedAt: new Date().toDateString() };
	const param: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Product',
		Item: updatedProduct
	};
	await dynamoDB.put(param).promise();
	return;
};
export const getProductsByListId = async (auctions: Auction[]) => {
	const productIds = [...new Set(auctions.map((auction: Auction) => auction.productId))];
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			Product: {
				Keys: productIds.map((productId: string) => ({
					productId: productId
				}))
			}
		}
	};
	try {
		const result = await dynamoDB.batchGet(params).promise();
		return result.Responses?.Product as Product[];
	} catch (error) {
		throw customError((error as Error).message, 500);
	}
};
