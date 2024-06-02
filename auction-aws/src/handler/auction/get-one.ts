import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getAuctionById, treeShakingAuction } from '~/service/auction';
import { getCategoryById } from '~/service/category';
import { getProductById } from '~/service/product';
import { getUserById } from '~/service/user';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: getOneBlogSchema });
		const { auction, user, product, category } = await getAuction(id);
		const res = treeShakingAuction(auction, product, user, category);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
const getAuction = async (id: string) => {
	const auction = await getAuctionById(id);
	const user = await getUserById(auction.userId);
	if (!user) throw customError('User not found', 404);
	const product = await getProductById(auction.productId);
	const category = await getCategoryById(product.categoryId);
	return {
		auction,
		user,
		product,
		category
	};
};
const getOneBlogSchema: ObjectSchema<{ id: string }> = object({
	id: string().required()
});
