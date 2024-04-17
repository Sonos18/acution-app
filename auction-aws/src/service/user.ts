import { DynamoDB } from 'aws-sdk';

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
