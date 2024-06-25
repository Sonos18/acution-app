import { Auction } from '~/db/auction-schema';
import { Product } from '~/db/product-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { getAllClosingAuctions } from '~/service/auction';
import { getProductsByListId } from '~/service/product';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const user = decodedTokenFromHeader(event);
		console.log('user', user);

		const auctions = await getAllClosingAuctions(user.id);
		console.log('auctions', auctions);

		if (!auctions) {
			return callback(null, { statusCode: 200, body: JSON.stringify([]) });
		}
		const products = await getProductsByListId(auctions);
		console.log('products', products);

		const res = treeShakingAuctionsClosing(auctions, products);
		console.log('res', res);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
const treeShakingAuctionsClosing = (auctions: Auction[], products: Product[]) => {
	const result = auctions.map((auction) => {
		const product = products.find((product) => product.productId === auction.productId);
		return {
			productName: product?.productName,
			endTime: auction.endTime,
			endPrice: auction.currentPrice,
			startPrice: auction.startPrice,
			startTime: auction.startTime,
			auctionId: auction.auctionId
		};
	});
	return result;
};
