import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { SiginOutput, SigninInput } from '~/utils/types/user-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

const dynamoDB = new DynamoDB.DocumentClient();
const keyAccess = process.env.KEY_ACCESS_TOKEN ?? '';
const keyRefresh = process.env.KEY_REFRESH_TOKEN ?? '';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const data = extractBodyDataFromRequest({ event, schema: SigninSchema });
		const user = await signin(data);
		const accessToken = generateAccessToken(user.userId, user.role);
		const refreshToken = generateRefreshToken(user.userId, user.role);
		await saveToken(user.userId, refreshToken);

		const response: SiginOutput = {
			access_token: accessToken,
			refresh_token: refreshToken,
			user: {
				userId: user.userId
			}
		};
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(response)
		});
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
const signin = async (data: SigninInput) => {
	const params = {
		TableName: 'User',
		IndexName: 'EmailIndex',
		KeyConditionExpression: 'email = :email',
		ExpressionAttributeValues: {
			':email': data.email
		}
	};
	const res = await dynamoDB.query(params).promise();
	if (!res.Items || res.Items.length === 0) {
		throw customError('User not found', 404);
	}
	const user = res.Items[0];
	const passwordIsValid = await bcrypt.compare(data.password, user.password);

	if (!passwordIsValid) {
		throw customError('Invalid password', 401);
	}
	return user;
};
export const SigninSchema: ObjectSchema<SigninInput> = object({
	email: string().email().required(),
	password: string().required()
});

export const generateAccessToken = (userId: string, role: string) => {
	return jwt.sign({ id: userId, role: role }, keyAccess, {
		expiresIn: '6d'
	});
};

export const generateRefreshToken = (userId: string, role: string) => {
	return jwt.sign({ id: userId, role: role }, keyRefresh, {
		expiresIn: '60d'
	});
};

export const saveToken = async (userId: string, token: string) => {
	const params = {
		TableName: 'RefreshToken',
		Item: {
			tokenId: v4(),
			userId,
			token
		}
	};
	await dynamoDB.put(params).promise();
};
