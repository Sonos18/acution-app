import { DynamoDB } from 'aws-sdk';
import { ObjectSchema, array, object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { UpdateBlogInput } from '~/utils/types/blog-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { checkBlogOwner, deleteOrUpdateBlogSchema } from './delete';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const blog = extractPathParamsFromRequest({ event, schema: deleteOrUpdateBlogSchema });
		const data = extractBodyDataFromRequest({ event, schema: updateBlogSchema });
		await checkBlogOwner(id, blog.id);
		const res = await updateBlog(id, blog.id, data);
		callback(null, { body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
const updateBlog = async (userId: string, blogId: string, data: UpdateBlogInput) => {
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Blog',
		Key: {
			blogId,
			userId
		},
		UpdateExpression: 'SET title = :title, content = :content, hashtags = :hashtags',
		ExpressionAttributeValues: {
			':title': data.title,
			':content': data.content,
			':hashtags': data.hashtags
		},
		ReturnValues: 'ALL_NEW'
	};
	let result;
	try {
		result = await dynamoDB.update(params).promise();
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}
	return result.Attributes;
};
const updateBlogSchema: ObjectSchema<UpdateBlogInput> = object({
	title: string().required(),
	content: string().required(),
	hashtags: array().of(string().defined()).required()
});
