import { ObjectSchema, object, string } from 'yup';

import { Blog } from '~/db/blog-schema';
import { Like } from '~/db/like-schema';
import { User } from '~/db/user-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { getMany, getOne } from '~/utils/query-dynamo.ts/get';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

export const handler: HandlerFn = async (event, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: getOneBlogSchema });
		const userId = decodedTokenFromHeader(event);
		const { blog, user } = await getBlog(id);
		const likes = await countLikesForBlog(id);
		const res = treeShakingBlog(blog, user, likes, userId.id);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
export const countLikesForBlog = async (blogId: string) => {
	const condition = {
		KeyConditionExpression: 'blogId = :blogId',
		ExpressionAttributeValues: {
			':blogId': blogId
		}
	};
	const likes = (await getMany('like', condition)) as Like[];
	return likes;
};
const treeShakingBlog = (blog: Blog, user: User, likes: Like[], userId: string) => {
	return {
		blogId: blog.blogId,
		title: blog.title,
		content: blog.content,
		createdAt: blog.created_at,
		updatedAt: blog.updated_at,
		hashtags: blog.hashtags,
		image: blog.image,
		user: {
			userId: user.userId,
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar
		},
		likes: likes.length,
		isLiked: likes.some((like) => like.userId === userId)
	};
};

const getBlog = async (id: string) => {
	const condition = {
		KeyConditionExpression: 'blogId = :blogId',
		ExpressionAttributeValues: {
			':blogId': id
		}
	};
	const blog = (await getOne('blog', condition)) as Blog;
	const conditionUser = {
		KeyConditionExpression: 'userId = :userId',
		ExpressionAttributeValues: {
			userId: blog.userId
		}
	};
	const user = (await getOne('user', conditionUser)) as User;
	return { user, blog };
};

const getOneBlogSchema: ObjectSchema<{ id: string }> = object({
	id: string().required()
});
