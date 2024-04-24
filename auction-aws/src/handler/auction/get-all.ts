import { ObjectSchema, number, object, string } from 'yup';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { paginateAuction } from '~/utils/paginate';
import { GetAuctionsInput, GetAuctionsOutput, lastKeyAuctions } from '~/utils/types/auction-type';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getAllAuctions, getAuctionsByUserId, treeShakingAuctions } from '~/service/auction';
import { getCategoriesByListId } from '~/service/category';
import { getProductsByListId } from '~/service/product';
import { getUserByListId } from '~/service/user';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: getBlogsSchema });
		const { limit, lastKey } = paginateAuction(params.limit);
		const auctions = await getAuctions(limit, params.userId, lastKey);
		const products = await getProductsByListId(auctions.data);
		const categories = await getCategoriesByListId(products);
		const users = await getUserByListId(auctions.data);
		const result = treeShakingAuctions(auctions, products, categories, users);
		callback(null, { statusCode: 200, body: JSON.stringify(result) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
const getAuctions = async (limit: number, userId?: string, key?: lastKeyAuctions) => {
	let result;
	if (userId) {
		result = await getAuctionsByUserId(userId, limit);
	} else {
		result = await getAllAuctions(limit, key);
	}
	return result;
};
const getBlogsSchema: ObjectSchema<GetAuctionsInput> = object({
	limit: number().optional(),
	userId: string().optional(),
	auctionId: string().optional(),
	status: string().optional()
});
