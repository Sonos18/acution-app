export interface CreateBlogInput {
	title: string;
	content: string;
	hashtags: string[];
}
export interface lastKeyBlogs {
	blogId: string;
	userId: string;
}
export interface GetBlogsInput {
	page?: number;
	limit?: number;
	userId?: string;
	keyBlogId?: string;
	keyUserId?: string;
}
export interface DeleteBlogInput {
	id: string;
}
export interface UpdateBlogInput {
	title: string;
	content: string;
	hashtags: string[];
}
