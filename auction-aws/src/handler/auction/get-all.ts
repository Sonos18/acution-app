import { ObjectSchema, number, object, string } from 'yup';

import { Auction } from '~/db/auction-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { paginateAuction } from '~/utils/paginate';
import { GetAuctionsInput, GetAuctionsOutput, lastKeyAuctions } from '~/utils/types/auction-type';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getAllAuctions, getAuctionsByUserId, treeShakingAuctions } from '~/service/auction';
import { getCategoriesByListId, getCategoryById, getCategoryByName } from '~/service/category';
import { getProductsByCategoryId, getProductsByListId } from '~/service/product';
import { getUserByListId } from '~/service/user';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: getBlogsSchema });
		const { limit, lastKey } = paginateAuction(params.limit);
		const data = await getAuctions(limit, params.search, lastKey);
		if (data) {
			const { users, auctions, products, category } = data;
			const result = treeShakingAuctions(auctions, products, category, users);
			callback(null, { statusCode: 200, body: JSON.stringify(result) });
		} else {
			callback(null, { statusCode: 200, body: JSON.stringify('No auction') });
		}
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
const getAuctions = async (limit: number, nameCategory?: string, key?: lastKeyAuctions) => {
	if (nameCategory) {
		const category = await getCategoryByName(nameCategory);
		console.log('category', category);
		const products = await getProductsByCategoryId(category.categoryId);
		console.log('products', products);
		const productIds = [...new Set(products.map((p) => p.productId))];
		console.log('productIds', productIds);
		const auctions = await getAllAuctions(limit, key, productIds);
		console.log('auctions', auctions);
		if (!auctions) return;
		const users = await getUserByListId(auctions.data);
		return {
			auctions,
			products,
			category: category.categoryName,
			users
		};
	} else {
		const auctions = await getAllAuctions(limit, key);
		if (!auctions) return;
		const products = await getProductsByListId(auctions.data);
		const category = await getCategoriesByListId(products);
		const users = await getUserByListId(auctions.data);
		return {
			auctions,
			products,
			category,
			users
		};
	}
};
const getBlogsSchema: ObjectSchema<GetAuctionsInput> = object({
	search: string().optional(),
	limit: number().optional(),
	auctionId: string().optional(),
	status: string().optional()
});
