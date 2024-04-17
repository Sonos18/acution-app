export interface CreateBlogInput {
	title: string;
	content: string;
	hashtags?: string[];
	keyImage: string;
}
export interface lastKeyBlogs {
	blogId: string;
	userId: string;
}

export interface BlogInput {
	blogId: string;
	user: {
		userId: string;
		firstName: string;
		lastName: string;
		avatar: string;
	};
	title: string;
	content: string;
	hashtags: string[];
	createdAt: string;
	updatedAt: string;
	likes: number;
	isLiked: boolean;
}

export interface GetBlogsOutput {
	data: BlogInput[];
	lastKey: lastKeyBlogs;
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
	image: string;
}
