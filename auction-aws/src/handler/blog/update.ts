import { DynamoDB } from 'aws-sdk';
import { ObjectSchema, array, object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { UpdateBlogInput } from '~/utils/types/blog-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { GetImgUrl } from '../s3/get-url';
import { checkBlogOwner, deleteOrUpdateBlogSchema } from './delete';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const blog = extractPathParamsFromRequest({ event, schema: deleteOrUpdateBlogSchema });
		const data = extractBodyDataFromRequest({ event, schema: updateBlogSchema });
		await checkBlogOwner(id, blog.id);
		const res = await updateBlog(blog.id, data);
		callback(null, { body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
const updateBlog = async (blogId: string, data: UpdateBlogInput) => {
	let image = data.keyImage[0];
	if (!data.keyImage[0].startsWith('https')) {
		const images = await GetImgUrl(data.keyImage);
		image = images[0];
	}
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Blog',
		Key: {
			blogId
		},
		UpdateExpression:
			'SET title = :title, content = :content, hashtags = :hashtags, image = :image, updatedAt = :updatedAt',
		ExpressionAttributeValues: {
			':title': data.title,
			':content': data.content,
			':hashtags': data.hashtags,
			':image': image,
			':updatedAt': new Date().toDateString()
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
	hashtags: array().of(string().defined()).required(),
	keyImage: array().of(string().defined()).required()
});
