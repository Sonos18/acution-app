import { ObjectSchema, number, object, string } from 'yup';

import { Auction } from '~/db/auction-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { paginate, paginateAuction } from '~/utils/paginate';
import { GetAuctionsInput, GetAuctionsOutput, lastKeyAuctions } from '~/utils/types/auction-type';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getAllAuctions, getAuctions, getAuctionsByUserId, treeShakingAuctions } from '~/service/auction';
import { getCategoriesByListId, getCategoryById, getCategoryByName } from '~/service/category';
import { getProductsByCategoryId, getProductsByListId } from '~/service/product';
import { getUserByListId } from '~/service/user';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: getBlogsSchema });
		const { start,end,limit } = paginate(params.limit, params.page);
		const data = await getAll(start,end,params.nameCategory);
		if (data) {
			const { users, auctions, products, category } = data;
			const result = treeShakingAuctions(auctions, products, category, users,limit);
			callback(null, { statusCode: 200, body: JSON.stringify(result) });
		} else {
			callback(null, { statusCode: 200, body: JSON.stringify('No auction') });
		}
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
const getAll = async (start:number,end:number,nameCategory?:string) => {
	if (nameCategory) {
		const category = await getCategoryByName(nameCategory);
		const products = await getProductsByCategoryId(category.categoryId);
		const productIds = [...new Set(products.map((p) => p.productId))];
		const auctions = await getAuctions(start, end);
		//Get auctions have productId in productIds
		const updatedAuctions = auctions.filter((auction) => productIds.includes(auction.productId));
		if (!auctions) return;
		const users = await getUserByListId(updatedAuctions);
		return {
			auctions:updatedAuctions,
			products,
			category: category.categoryName,
			users
		};
	} else {
		const auctions = await getAuctions(start, end);
		if (!auctions) return;
		const products = await getProductsByListId(auctions);
		const category = await getCategoriesByListId(products);
		const users = await getUserByListId(auctions);
		return {
			auctions,
			products,
			category,
			users
		};
	}
};
const getBlogsSchema: ObjectSchema<GetAuctionsInput> = object({
	nameCategory: string().optional(),
	limit: number().optional(),
	page: number().optional(),
	auctionId: string().optional(),
	status: string().optional()
});
