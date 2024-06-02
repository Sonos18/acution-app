import { QueryOutput } from '@aws-sdk/client-dynamodb';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ObjectSchema, object, string } from 'yup';


import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { DeleteBlogInput } from '~/utils/types/blog-type';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getBlogById } from '~/service/blog';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const params = extractPathParamsFromRequest({ event, schema: deleteOrUpdateBlogSchema });
		await checkBlogOwner(id, params.id);
		await deleteBlog(id, params.id);
		callback(null, { body: 'Deleted Success' });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};

export const deleteBlog = async (userId: string, blogId: string) => {
	let params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Blog',
		Key: {
			blogId: blogId
		},
		UpdateExpression: 'SET deleted = :deleted',
		ExpressionAttributeValues: {
			':deleted': 'true'
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
	const blog = await getBlogById(blogId);
	if (blog.userId !== userId) {
		throw customError('Unauthorized', 401);
	}
};

export const deleteOrUpdateBlogSchema: ObjectSchema<DeleteBlogInput> = object({
	id: string().required()
});
