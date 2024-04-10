import { DynamoDB } from 'aws-sdk';

import { User } from '~/db/user-schema';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

const dynamoDB = new DynamoDB.DocumentClient();
export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const user = await getUser(id);
		const response: User = {
			userId: user.userId,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
			role: user.role
		};
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(response)
		});
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
const getUser = async (id: string) => {
	const params = {
		TableName: 'User',
		Key: {
			userId: id
		}
	};
	const res = await dynamoDB.get(params).promise();
	if (!res.Item) {
		throw customError('User not found', 422);
	}
	return res.Item;
};
