import { customError } from './createHandler';
import { lastKeyBlogs } from './types/blog-type';

export const paginateBase = (
	page?: number,
	limit?: number,
	keyBlogId?: string,
	keyUserId?: string
) => {
	const pageNum = page ?? 1;
	const limitNum = limit ?? 20;
	if (pageNum > 1 && (!keyBlogId || !keyUserId)) {
		throw customError('LastEvaluatedKey is required', 400);
	}
	let lastKey: lastKeyBlogs | undefined;
	if (keyBlogId && keyUserId) {
		lastKey = { blogId: keyBlogId, userId: keyUserId };
	}
	return {
		lastKey: lastKey,
		page: pageNum,
		limit: limitNum
	};
};
