export interface CreateBlogInput {
	title: string;
	content: string;
	hashtags?: string[];
	keyImage: string[];
}
export interface lastKeyBlogs {
	blogId: string;
	deleted:string;
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
	lastKey?: lastKeyBlogs;
}
export interface GetBlogsInput {
	search?: string;
	limit?: number;
	userId?: string;
	keyBlogId?: string;
}
export interface DeleteBlogInput {
	id: string;
}
export interface UpdateBlogInput {
	title: string;
	content: string;
	hashtags: string[];
	keyImage: string[];
}
