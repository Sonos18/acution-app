import { Auction } from '~/db/auction-schema';
import { Product } from '~/db/product-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { getAllClosingAuctions } from '~/service/auction';
import { getProductsByListId } from '~/service/product';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const user = decodedTokenFromHeader(event);
		const result = await getAllClosingAuctions(user.id);
		const products = await getProductsByListId(result);
		const response = treeShakingAuctionsClosing(result, products);
		callback(null, { statusCode: 200, body: JSON.stringify(response) });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
const treeShakingAuctionsClosing = async (auctions: Auction[], products: Product[]) => {
	const result = auctions.map((auction) => {
		const product = products.find((product) => product.productId === auction.productId);
		return {
			image: product?.images[0],
			productName: product?.productName,
			endTime: auction.endTime,
			currentPrice: auction.currentPrice
		};
	});
};
