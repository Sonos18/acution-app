import { DynamoDB } from 'aws-sdk';
import { ObjectSchema, number, object, string } from 'yup';

import { Blog } from '~/db/blog-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { paginateBase } from '~/utils/paginate';
import { GetBlogsInput, lastKeyBlogs } from '~/utils/types/blog-type';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: getBlogsSchema });
		const { lastKey, page, limit } = paginateBase(
			params.page,
			params.limit,
			params.keyBlogId,
			params.keyUserId
		);
		const blogs = await getBlogs(page, limit, params.userId, lastKey);
		const res = await countLikesForBlogs(blogs.items as Blog[]);
		console.log(res);
		callback(null, { body: JSON.stringify(blogs) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
export const getBlogs = async (
	page: number,
	limit: number,
	userId?: string,
	lastKey?: lastKeyBlogs
) => {
	let params: DynamoDB.DocumentClient.QueryInput | DynamoDB.DocumentClient.ScanInput = {
		TableName: 'Blog',
		Limit: limit,
		FilterExpression: 'attribute_not_exists(deleted) OR deleted = :deleted',
		ExpressionAttributeValues: {
			':deleted': false
		}
	};
	// If it's not the first page, set ExclusiveStartKey
	if (page > 1) {
		params.ExclusiveStartKey = lastKey;
	}

	let result;
	try {
		if (userId) {
			params = {
				...params,
				IndexName: 'UserIndex',
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					...params.ExpressionAttributeValues,
					':userId': userId
				}
			};
			result = await dynamoDB.query(params as DynamoDB.DocumentClient.QueryInput).promise();
		} else {
			result = await dynamoDB.scan(params as DynamoDB.DocumentClient.ScanInput).promise();
		}
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}

	return {
		items: result.Items,
		lastKey: result.LastEvaluatedKey
	};
};

export const countLikesForBlogs = async (blogs: Blog[]) => {
	console.log('blogs', blogs);
	const blogIds = [...new Set(blogs.map((blog: Blog) => blog.blogId))];
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			Like: {
				Keys: blogIds.map((blogId: string) => ({
					blogId: blogId
				}))
			}
		}
	};

	try {
		const result = await dynamoDB.batchGet(params).promise();
		return result;
	} catch (error) {
		throw customError((error as Error).message, 500);
	}
};

const getBlogsSchema: ObjectSchema<GetBlogsInput> = object({
	page: number().optional(),
	limit: number().optional(),
	userId: string().optional(),
	keyBlogId: string().optional(),
	keyUserId: string().optional()
});
