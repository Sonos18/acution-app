import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { decode } from 'punycode';
import { ObjectSchema, number, object, string } from 'yup';

import { Blog } from '~/db/blog-schema';
import { Like } from '~/db/like-schema';
import { User } from '~/db/user-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { paginateBase } from '~/utils/paginate';
import { BlogInput, GetBlogsInput, GetBlogsOutput, lastKeyBlogs } from '~/utils/types/blog-type';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: getBlogsSchema });
		const { lastKey, page, limit } = paginateBase(
			params.page,
			params.limit,
			params.keyBlogId,
			params.keyUserId
		);
		const blogs = await getBlogs(page, limit, params.userId, lastKey);
		const likes = await countLikesForBlogs(blogs.items as Blog[]);
		const users = await getUsersForBlogs(blogs.items as Blog[]);
		const result = responsesGetBlogs(blogs, likes, event, users);
		callback(null, { statusCode: 200, body: JSON.stringify(result) });
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
		FilterExpression: 'deleted <> :deleted',
		ExpressionAttributeValues: {
			':deleted': true
		},
		ScanIndexForward: false
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

const responsesGetBlogs = (
	blogs: Awaited<ReturnType<typeof getBlogs>>,
	likes: Like[],
	event: APIGatewayProxyEvent,
	users: User[]
): GetBlogsOutput => {
	if (blogs.items) {
		const result: BlogInput[] = blogs.items.map((item: DynamoDB.DocumentClient.AttributeMap) => {
			const likesForBlog = likes?.filter((like) => like.blogId === item.blogId);
			const userIdsWhoLiked = likesForBlog?.map((like) => like.userId) || [];
			const user = users.find((user) => user.userId === item.userId);
			const { id } = decodedTokenFromHeader(event);
			const isLiked = userIdsWhoLiked.find((userId) => userId === id);
			return {
				blogId: item.blogId,
				user: {
					userId: item.userId,
					firstName: user?.firstName ?? '',
					lastName: user?.lastName ?? '',
					avatar: user?.avatar ?? ''
				},
				title: item.title,
				content: item.content,
				hashtags: item.hashtags,
				createdAt: item.createdAt,
				image: item.image,
				updatedAt: item.updatedAt,
				likes: likesForBlog?.length || 0,
				isLiked: isLiked ? true : false
			};
		});
		return {
			data: result,
			lastKey: blogs.lastKey as lastKeyBlogs
		};
	}
	const result: BlogInput[] = [];
	return {
		data: result,
		lastKey: blogs.lastKey as lastKeyBlogs
	};
};

export const countLikesForBlogs = async (blogs: Blog[]) => {
	console.log('blogs', blogs);
	const blogIds = [...new Set(blogs.map((blog: Blog) => blog.blogId))];
	console.log('blogIds', blogIds);
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			Like: {
				Keys: blogIds.map((blogId: string) => ({
					blogId: blogId
				}))
			}
		}
	};
	console.log('params', params);
	try {
		const result = await dynamoDB.batchGet(params).promise();
		console.log('Like', result.Responses?.Like);
		return result.Responses?.Like as Like[];
	} catch (error) {
		throw customError((error as Error).message, 500);
	}
};

const getUsersForBlogs = async (blogs: Blog[]) => {
	const userIds = [...new Set(blogs.map((blog: Blog) => blog.userId))].filter(
		(userId) => userId !== undefined
	);
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			User: {
				Keys: userIds.map((userId: string | undefined) => ({
					userId: userId
				}))
			}
		}
	};
	try {
		const result = await dynamoDB.batchGet(params).promise();
		return result.Responses?.User as User[];
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
