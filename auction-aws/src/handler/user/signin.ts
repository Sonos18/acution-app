import { DynamoDB } from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import { User } from '~/db/user-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { SigninInput } from '~/utils/types/user-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

const dynamoDB = new DynamoDB.DocumentClient();
const keySecret = process.env.JWT_SECRET ?? '';
export const handler: HandlerFn = async (event, context, callback) => {
	try {
		console.log('show keySecret', keySecret);
		const data = extractBodyDataFromRequest({ event, schema: SigninSchema });
		const user = await signin(data);
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(accessToken)
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

export const generateAccessToken = (user: User) => {
	return jwt.sign({ id: user.userId, role: user.role }, 'key', {
		expiresIn: 3600
	});
};

export const generateRefreshToken = (user: User) => {
	return jwt.sign({ id: user.userId, role: user.role }, 'keySecret', {
		expiresIn: '60d'
	});
};
