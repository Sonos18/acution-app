import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';

import { customError, customErrorOutput } from '../createHandler';

const dynamoDB = new DynamoDB.DocumentClient();
export const checkExist = async (name: string, condition: object) => {
	try {
		const params = {
			TableName: name,
			...condition
		};
		const result = await dynamoDB.query(params).promise();
		if (result.Items && result.Items.length > 0) {
			return true;
		}
		throw customError('Dont permission for this action', StatusCodes.UNAUTHORIZED);
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const getOne = async (name: string, condition: object) => {
	try {
		const params = {
			TableName: name,
			...condition,
			FilterExpression: 'deleted <> :deleted',
			ExpressionAttributeValues: {
				':deleted': true
			}
		};
		const result = await dynamoDB.query(params).promise();
		if (result.Items && result.Items.length > 0) {
			return result.Items[0];
		}
		throw customError('No exist', StatusCodes.NOT_FOUND);
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const getMany = async (name: string, condition: object) => {
	try {
		const params = {
			TableName: name,
			...condition,
			FilterExpression: 'deleted <> :deleted',
			ExpressionAttributeValues: {
				':deleted': true
			}
		};
		const result = await dynamoDB.query(params).promise();
		if (result.Items && result.Items.length > 0) {
			return result.Items;
		}
		throw customError('No exist', StatusCodes.NOT_FOUND);
	} catch (error) {
		const e = error as Error;
		customError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
