import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getAuctionsByUserId, treeShakingAuctions } from '~/service/auction';
import { getCategoriesByListId } from '~/service/category';
import { getProductsByListId } from '~/service/product';
import { getUserByListId } from '~/service/user';

import { getOneBlogSchema } from './get-one';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: getOneBlogSchema });
		const auctions = await getAuctionsByUserId(id, 20);
		if (!auctions) {
			callback(null, { statusCode: 200, body: JSON.stringify([]) });
			return;
		}
		const products = await getProductsByListId(auctions.data);
		const categories = await getCategoriesByListId(products);
		const userss = await getUserByListId(auctions.data);
		const res = treeShakingAuctions(auctions, products, categories, userss);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
