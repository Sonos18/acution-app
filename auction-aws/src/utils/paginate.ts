import { customError } from './createHandler';
import { lastKeyAuctions } from './types/auction-type';
import { lastKeyBlogs } from './types/blog-type';

export const paginateBase = (limit?: number, key?: string) => {
	const limitNum = limit ?? 20;
	let lastKey: lastKeyBlogs | undefined;
	if (key) {
		lastKey = { blogId: key ,deleted: "false"};
	}
	return {
		lastKey: lastKey,
		limit: limitNum
	};
};
export const paginateAuction = (limit?: number, auctionId?: string, status?: string) => {
	const limitNum = limit ?? 20;
	let lastKey: lastKeyAuctions | undefined;
	if (auctionId && status) {
		lastKey = { auctionId: auctionId, status: status };
	}
	return {
		limit: limitNum,
		lastKey: lastKey
	};
};
export const paginate=(limit?:number,page?:number)=>{
	const limitNum = limit ?? 20;
	const pageNum = page ?? 1;
	const start=(pageNum-1)*limitNum;
	const end=pageNum*limitNum;
	return {
		start,
		end,
		limit:limitNum
	}
}