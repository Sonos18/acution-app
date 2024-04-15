import { QueryOutput } from '@aws-sdk/client-dynamodb';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ObjectSchema, object, string } from 'yup';

import { Blog } from '~/db/blog-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { DeleteBlogInput } from '~/utils/types/blog-type';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const params = extractPathParamsFromRequest({ event, schema: deleteOrUpdateBlogSchema });
		await checkBlogOwner(id, params.id);
		const res = await deleteBlog(id, params.id);
		callback(null, { body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};

export const deleteBlog = async (userId: string, blogId: string) => {
	let params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Blog',
		Key: {
			userId: userId,
			blogId: blogId
		},
		UpdateExpression: 'SET deleted = :deleted',
		ExpressionAttributeValues: {
			':deleted': true
		},
		ReturnValues: 'ALL_NEW'
	};
	let result: PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWSError> | undefined;
	try {
		result = await dynamoDB.update(params).promise();
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}
};

export const checkBlogOwner = async (userId: string, blogId: string) => {
	let params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Blog',
		KeyConditionExpression: 'userId = :userId AND blogId = :blogId',
		ExpressionAttributeValues: {
			':userId': userId,
			':blogId': blogId
		},
		Limit: 1
	};
	let result: PromiseResult<QueryOutput, AWSError> | undefined;
	try {
		result = await dynamoDB.query(params).promise();
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}
	if (!result.Items || result.Items.length === 0) {
		throw customError('Blog not found', 404);
	}
};
export const deleteOrUpdateBlogSchema: ObjectSchema<DeleteBlogInput> = object({
	id: string().required()
});
