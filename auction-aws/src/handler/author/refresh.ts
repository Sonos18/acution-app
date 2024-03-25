import { DynamoDB } from 'aws-sdk';
import jwt from 'jsonwebtoken';

import { RefreshToken } from '~/db/token-schema';

import { HandlerFn, customError } from '~/utils/createHandler';

import { generateAccessToken } from '../user/signin';

const dynamoDB = new DynamoDB.DocumentClient();

const keyRefresh = process.env.KEY_REFRESH_TOKEN ?? '';
export const handler: HandlerFn = async (event, context, callback) => {
	try {
		if (event.headers?.authorization === undefined) {
			throw new Error('Authorization header is missing');
		}
		const token = event.headers.authorization.replace('Bearer ', '');
		const decoded = jwt.verify(token, keyRefresh) as jwt.JwtPayload;
		console.log('decoded', decoded);
		const refreshtoken = new RefreshToken();
		refreshtoken.userId = decoded.id;
		refreshtoken.token = token;
		const params = {
			TableName: 'RefreshToken',
			IndexName: 'TokenIndex',
			KeyConditionExpression: '#t = :token and userId = :userId',
			ExpressionAttributeValues: {
				':token': token,
				':userId': decoded.id
			},
			ExpressionAttributeNames: {
				'#t': 'token'
			}
		};
		const result = await dynamoDB.query(params).promise();
		if (result.Items === undefined) throw customError('You do not have permission', 401);
		console.log('result', result);
		const accessToken = generateAccessToken(decoded.id, decoded.role);
		return callback(null, {
			body: JSON.stringify({ accessToken })
		});
	} catch (error) {
		const e = error as Error;
		return callback(null, { body: e.message, statusCode: 500 });
	}
};
