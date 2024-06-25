import { Auction } from '~/db/auction-schema';
import { Notification } from '~/db/notification-schema';
import { Product } from '~/db/product-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { getNotificationsByUserId } from '~/service/notification';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const user = decodedTokenFromHeader(event);
		const { notifications, products, auctions } = await getNotificationsByUserId(user.id);
		const res = treeShakingNotifications(notifications, products, auctions);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
const treeShakingNotifications = (
	notifications: Notification[],
	products: Product[],
	auctions: Auction[]
) => {
	const result = notifications.map((notification) => {
		const auction = auctions.find((auction) => auction.auctionId === notification.auctionId);
		const product = products.find((product) => product.productId === auction?.productId);
		return {
			productName: product?.productName,
			currentPrice: auction?.currentPrice,
			message: notification.message,
			createdAt: notification.createdAt,
			notificationId: notification.notificationId,
			image: product?.images[0],
			auctionId: auction?.auctionId
		};
	});
	return result;
};
