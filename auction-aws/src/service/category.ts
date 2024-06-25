import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import { Category } from '~/db/category-schema';
import { Product } from '~/db/product-schema';

import { customError } from '~/utils/createHandler';

const dynamoDB = new DynamoDB.DocumentClient();

export const createCategory = async (nameCategory: string) => {
	const category: Category = {
		categoryName: nameCategory,
		categoryId: v4(),
		createdAt: new Date().toDateString()
	};
	const param: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Category',
		Item: category
	};
	try {
		await dynamoDB.put(param).promise();
		return category;
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};

export const checkExist = async (categoryName: string) => {
	const param: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Category',
		KeyConditionExpression: 'categoryName = :categoryName',
		ExpressionAttributeValues: {
			':categoryName': categoryName
		}
	};
	const result = await dynamoDB.query(param).promise();
	console.log('result', result.Items);

	if (result.Items && result.Items.length > 0) {
		customError('Category is exist', StatusCodes.BAD_REQUEST);
	}
};

export const deleteCategory = async (categoryId: string) => {
	const param: DynamoDB.DocumentClient.DeleteItemInput = {
		TableName: 'Category',
		Key: {
			categoryId
		}
	};
	try {
		await dynamoDB.delete(param).promise();
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};

export const getAllCategory = async () => {
	const param: DynamoDB.DocumentClient.ScanInput = {
		TableName: 'Category'
	};
	try {
		const result = await dynamoDB.scan(param).promise();
		return result.Items;
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
const getOneCategory = async (categoryId: string) => {
	const param: DynamoDB.DocumentClient.GetItemInput = {
		TableName: 'Category',
		Key: {
			categoryId
		}
	};
	const result = await dynamoDB.get(param).promise();
	if (!result.Item) {
		customError('Category not found', StatusCodes.NOT_FOUND);
	}
	return result.Item;
};
export const getCategoryById = async (categoryId: string) => {
	const param: DynamoDB.DocumentClient.GetItemInput = {
		TableName: 'Category',
		Key: {
			categoryId
		}
	};
	const result = await dynamoDB.get(param).promise();
	const category = result.Item as Category;
	if (!category) {
		customError('Category not found', StatusCodes.NOT_FOUND);
	}
	return category;
};
export const getCategoriesByListId = async (products: Product[]) => {
	const categoryIds = [...new Set(products.map((product: Product) => product.categoryId))];
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			Category: {
				Keys: categoryIds.map((categoryId: string) => ({
					categoryId: categoryId
				}))
			}
		}
	};
	try {
		const result = await dynamoDB.batchGet(params).promise();
		return result.Responses?.Category as Category[];
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const getCategoryByName = async (name: string) => {
	const param: DynamoDB.DocumentClient.ScanInput = {
		TableName: 'Category',
		FilterExpression: 'categoryName = :categoryName',
		ExpressionAttributeValues: {
			':categoryName': name
		}
	};
	const res = await dynamoDB.scan(param).promise();
	if (res.Items && res.Items.length > 0) {
		return res.Items[0] as Category;
	}
	throw customError('Category not found', StatusCodes.BAD_REQUEST);
};
export const countCategory = async () => {
	const params: DynamoDB.DocumentClient.ScanInput = {
		TableName: 'Category',
		Select: 'COUNT'
	};
	try {
		const result = await dynamoDB.scan(params).promise();
		console.log('result', result);
		return result.Count ?? 0;
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
