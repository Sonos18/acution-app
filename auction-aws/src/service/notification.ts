import { DynamoDB } from 'aws-sdk';

import { Auction } from '~/db/auction-schema';
import { Bid } from '~/db/bid-schema';
import { Notification } from '~/db/notification-schema';

import { getAuctionsByIds } from './auction';
import { getProductsByListId } from './product';

const dynamoDB = new DynamoDB.DocumentClient();
export const createWarning = async (auctions: Auction[]) => {
	const param = {
		TableName: 'Bid',
		IndexName: 'AuctionIndex',
		KeyConditionExpression: 'auctionId = :auctionId'
	};
	auctions.forEach(async (auction) => {
		const updatedParam = {
			...param,
			ExpressionAttributeValues: {
				':auctionId': auction.auctionId
			}
		};
		const result = await dynamoDB.query(updatedParam).promise();
		if (result.Items) {
			const items = result.Items as Bid[];
			const listUser = Array.from(new Set(items.map((item) => item.userId)));
			const message = 'The auction is about to end. Current price is ' + auction.currentPrice;
			await createNotifications(auction.auctionId, listUser, message);
		}
	});
}
export const createNotifications = async (auctionId: string, listUser: string[],message:string) => {
	listUser.forEach(async (user) => {
		const notification = {
			userId: user,
			auctionId: auctionId,
			createdAt: new Date().toISOString(),
			message: message
		};
		const params: DynamoDB.DocumentClient.PutItemInput = {
			TableName: 'Notification',
			Item: notification
		};
		await dynamoDB.put(params).promise();
	});
};
export const createNotification= async (userId: string, auctionId: string, message: string) => {
	const notification = {
		userId,
		auctionId,
		createdAt: new Date().toISOString(),
		message
	};
	const params: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Notification',
		Item: notification
	};
	try{
		await dynamoDB.put(params).promise();
	}catch(e){
		console.log('error',(e as Error).message)
	}
};
export const getNotificationsByUserId = async (userId: string) => {
	const params = {
		TableName: 'Notification',
		KeyConditionExpression: 'userId = :userId',
		ExpressionAttributeValues: {
			':userId': userId
		}
	};
	const result = await dynamoDB.query(params).promise();
	const notifications = result.Items as Notification[];
	const auctionIds = notifications.map((notification) => notification.auctionId);
	const auctions = await getAuctionsByIds(auctionIds);
	const products = await getProductsByListId(auctions);

	return { notifications, auctions, products };
};
export const readNotification = async (notificationId: string) => {
	const params = {
		TableName: 'Notification',
		Key: {
			notificationId
		},
		UpdateExpression: 'set isRead = :isRead',
		ExpressionAttributeValues: {
			':isRead': true
		},
		ReturnValues: 'ALL_NEW'
	};
	const result = await dynamoDB.update(params).promise();
	console.log('result', result.Attributes	);
	
};