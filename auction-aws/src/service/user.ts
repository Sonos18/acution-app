import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import { Auction } from '~/db/auction-schema';
import { User } from '~/db/user-schema';

import { customError } from '~/utils/createHandler';
import { SigninWithProviderInput } from '~/utils/types/auth-type';
import { SiginOutput, UpdateUserInput } from '~/utils/types/user-type';

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
	return null;
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
export const getUserByEmail = async (email: string) => {
	const params = {
		TableName: 'User',
		IndexName: 'EmailIndex',
		KeyConditionExpression: 'email = :email',
		ExpressionAttributeValues: {
			':email': email
		}
	};
	const result = await dynamoDB.query(params).promise();
	if (result.Items && result.Items.length > 0) {
		return result.Items[0] as User;
	}
	return null;
};
export const signinWithProvider = async (data: SigninWithProviderInput, user: User | null) => {
	if (!user || data.provider !== user.provider) {
		const item = {
			userId: data.id,
			email: data.email,
			firstName: data.name,
			avatar: data.picture,
			provider: data.provider,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			role: 'user'
		};
		const params = {
			TableName: 'User',
			Item: item
		};
		await dynamoDB.put(params).promise();
		return {
			avatar: item.avatar,
			firstName: item.firstName,
			userId: item.userId,
			email: item.email,
			role: item.role,
			lastName: ''
		};
	}
	return {
		avatar: user.avatar,
		firstName: user.firstName,
		userId: user.userId,
		email: user.email,
		role: user.role,
		lastName: user.lastName,
		phone: user.phone
	};
};
export const updateUser = async (userId: string, updateData: UpdateUserInput) => {
	const user = await getUserById(userId);
	if (!user) {
		throw customError('User not found', StatusCodes.UNAUTHORIZED);
	}
	const params = {
		TableName: 'User',
		Key: {
			userId: userId
		},
		UpdateExpression:
			'set firstName = :firstName, lastName = :lastName, email = :email, phone = :phone',
		ExpressionAttributeValues: {
			':firstName': updateData.firstName,
			':lastName': updateData.lastName,
			':email': updateData.email,
			':phone': updateData.phone
		},
		ReturnValues: 'ALL_NEW'
	};
	const res = await dynamoDB.update(params).promise();
	return res.Attributes as User;
};
export const treeSakingUser = (user: User) => {
	return {
		userId: user.userId,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		phone: user.phone,
		avatar: user.avatar,
		role: user.role
	};
};
export const getAllUser = async () => {
	const params = {
		TableName: 'User',
		limit: 10
	};
	try {
		const result = await dynamoDB.scan(params).promise();
		return result.Items as User[];
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const treeSakingUsers = (users: User[]) => {
	return users.map((user) => treeSakingUser(user));
};
