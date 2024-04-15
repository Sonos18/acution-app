import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';

import { customError } from '../createHandler';

const dynamoDB = new DynamoDB.DocumentClient();
export const createSchema = async (name: string, schema: object) => {
	const params = {
		TableName: name,
		Item: schema
	};
	try {
		await dynamoDB.put(params).promise();
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
