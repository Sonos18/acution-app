import { DynamoDB } from 'aws-sdk';
import { stat } from 'fs';
import { StatusCodes } from 'http-status-codes';

import { Auction } from '~/db/auction-schema';
import { User } from '~/db/user-schema';

import { customError } from '~/utils/createHandler';

const dynamoDB = new DynamoDB.DocumentClient();

export const getUserById = async (id: string) => {
	const params = {
		TableName: 'User',
		KeyConditionExpression: 'userId = :userId',
		FilterExpression: 'deleted <> :deleted',
		ExpressionAttributeValues: {
			':deleted': true,
			':userId': id
		}
	};
	const result = await dynamoDB.query(params).promise();
	if (result.Items && result.Items.length > 0) {
		return result.Items[0] as User;
	}
	throw customError('User not exist', 404);
};

export const getUserByListId = async (auctions: Auction[]) => {
	const userIds = [...new Set(auctions.map((auction: Auction) => auction.userId))].filter(
		(userId) => userId !== undefined
	);
	const params: DynamoDB.DocumentClient.BatchGetItemInput = {
		RequestItems: {
			User: {
				Keys: userIds.map((userId: string | undefined) => ({
					userId: userId
				}))
			}
		}
	};
	try {
		const result = await dynamoDB.batchGet(params).promise();
		return result.Responses?.User as User[];
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
