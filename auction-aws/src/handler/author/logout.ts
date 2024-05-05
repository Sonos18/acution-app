import { DynamoDB } from 'aws-sdk';
import jwt from 'jsonwebtoken';

import { RefreshToken } from '~/db/token-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';

const dynamoDB = new DynamoDB.DocumentClient();
const keyRefresh = process.env.KEY_REFRESH_TOKEN ?? '';
export const handler: HandlerFn = async (event, context, callback) => {
	try {
		if (event.headers?.authorization === undefined) {
			throw customError('Authorization header is missing', 401);
		}
		const token = event.headers.authorization.replace('Bearer ', '');
		const decoded = jwt.verify(token, keyRefresh) as jwt.JwtPayload;
		const refreshToken = await getRefreshToken(decoded.id, token);
		await deleteRefreshToken(refreshToken);
		callback(null, { body: JSON.stringify({ message: 'Logout successfully' }) });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
const getRefreshToken = async (userId: string, token: string) => {
	const param = {
		TableName: 'RefreshToken',
		IndexName: 'TokenIndex',
		KeyConditionExpression: 'userId = :userId AND #tk = :token',
		ExpressionAttributeNames: {
			'#tk': 'token'
		},
		ExpressionAttributeValues: {
			':userId': userId,
			':token': token
		}
	};
	try {
		const result = await dynamoDB.query(param).promise();
		if (!result.Items) {
			throw customError('Refresh token not found', 404);
		}
		return result.Items[0] as RefreshToken;
	} catch (error) {
		const err = error as Error;
		throw customError(err.message, 500);
	}
};
const deleteRefreshToken = async (refreshToken: RefreshToken) => {
	const param = {
		TableName: 'RefreshToken',
		Key: {
			tokenId: refreshToken.tokenId
		}
	};
	await dynamoDB.delete(param).promise();
};
