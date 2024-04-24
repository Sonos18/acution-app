import { DynamoDB, S3 } from 'aws-sdk';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { ObjectSchema, array, object, string } from 'yup';

import { Blog } from '~/db/blog-schema';
import { Hashtag } from '~/db/hashtag-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { CreateBlogInput } from '~/utils/types/blog-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

import { GetImgUrl } from '../s3/get-url';

const dynamoDB = new DynamoDB.DocumentClient();
const keyAccess = process.env.KEY_ACCESS_TOKEN ?? '';
export const handler: HandlerFn = async (event, context, callback) => {
	try {
		if (event.headers?.authorization === undefined) {
			throw customError('Authorization header is missing', 401);
		}
		const token = event.headers.authorization.replace('Bearer ', '');
		const decoded = jwt.verify(token, keyAccess) as jwt.JwtPayload;
		const blogData = extractBodyDataFromRequest({ event, schema: createBlogSchema });
		const { hashtags } = blogData;
		if (hashtags) {
			for (const hashtag of hashtags) {
				await addHashtag(hashtag);
			}
		}
		const blog = await createBlog(blogData, decoded.id, hashtags);
		callback(null, { body: JSON.stringify(blog) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};

export const createBlogSchema: ObjectSchema<CreateBlogInput> = object({
	title: string().required(),
	content: string().required(),
	hashtags: array().of(string().defined()).optional(),
	keyImage: array().of(string().required()).required()
});

export const createBlog = async (
	blogData: CreateBlogInput,
	userId: string,
	hashtags?: string[]
) => {
	const urlImage = await GetImgUrl(blogData.keyImage);
	console.log('urlImage', urlImage);
	const blog: Blog = {
		blogId: v4(),
		title: blogData.title,
		content: blogData.content,
		userId,
		image: urlImage[0],
		createdAt: new Date().toDateString(),
		updatedAt: new Date().toDateString(),
		hashtags,
		deleted: 'false'
	};
	const params: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Blog',
		Item: blog
	};
	await dynamoDB.put(params).promise();
	return blog;
};
export const addHashtag = async (content: string) => {
	// Check if the hashtag exists
	const params = {
		TableName: 'Hashtag',
		IndexName: 'ContentIndex',
		KeyConditionExpression: 'content = :content',
		ExpressionAttributeValues: {
			':content': content
		}
	};
	let hashtagId: string = '';
	try {
		const getResult = await dynamoDB.query(params).promise();
		console.log('getResult', getResult);

		if (getResult.Items && getResult.Items.length > 0) {
			hashtagId = getResult.Items[0].hashtagId as string;
			console.log('get right');
		} else {
			// If the hashtag doesn't exist, create a new one
			console.log('get wrong');
			const hashtag: Hashtag = {
				hashtagId: v4(),
				content
			};
			const putParams: DynamoDB.DocumentClient.PutItemInput = {
				TableName: 'Hashtag',
				Item: hashtag
			};
			await dynamoDB.put(putParams).promise();
			hashtagId = hashtag.hashtagId as string;
		}
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}

	createBlogHashtag(hashtagId, hashtagId);
};
export const createBlogHashtag = async (blogId: string, hashtagId: string) => {
	const params: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'BlogHashtag',
		Item: {
			BlogHashtagId: v4(),
			blogId,
			hashtagId
		}
	};
	await dynamoDB.put(params).promise();
};
