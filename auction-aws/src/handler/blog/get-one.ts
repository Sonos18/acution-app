import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { ObjectSchema, object, string } from 'yup';

import { Blog } from '~/db/blog-schema';
import { User } from '~/db/user-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getBlogById } from '~/service/blog';
import { countLikesForBlog } from '~/service/like';
import { getUserById } from '~/service/user';

const dynamoDB = new DynamoDB.DocumentClient();
export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: getOneBlogSchema });
		console.log('id', id);

		const userId = decodedTokenFromHeader(event);
		console.log('userId', userId);

		const { blog, user, likes, isLiked } = await getBlog(id);
		const res = treeShakingBlog(blog, user, likes, isLiked);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};

const treeShakingBlog = (blog: Blog, user: User, likes: number, isLiked: boolean) => {
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
		likes: likes,
		isLiked: isLiked
	};
};

const getBlog = async (id: string) => {
	const blog = await getBlogById(id);
	console.log('blog', blog);

	const user = await getUserById(blog.userId);
	console.log('user', user);
	const { likes, isLiked } = await countLikesForBlog(id, blog.userId);
	console.log('likes', likes);
	return { blog, user, likes, isLiked };
};

const getOneBlogSchema: ObjectSchema<{ id: string }> = object({
	id: string().required()
});
