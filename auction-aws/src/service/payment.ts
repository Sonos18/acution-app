import { DynamoDB } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';

import { Payment } from '~/db/payment-schema';

import { customError } from '~/utils/createHandler';

const dynamoDB = new DynamoDB.DocumentClient();
export const getPaymentsByStatusForUser = async (userId: string, status: string) => {
	const params = {
		TableName: 'Payment',
		IndexName: 'UserIndex',
		KeyConditionExpression: 'userId = :userId and #status = :status',
		ExpressionAttributeNames: {
			'#status': 'status'
		},
		ExpressionAttributeValues: {
			':userId': userId,
			':status': status
		}
	};
	try {
		const result = await dynamoDB.query(params).promise();
		return result.Items as Payment[];
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const createPayment = async (payment: Payment) => {
	const params: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Payment',
		Item: payment
	};
	await dynamoDB.put(params).promise();
};
export const getPaymentById = async (paymentId: string) => {
	const params: DynamoDB.DocumentClient.GetItemInput = {
		TableName: 'Payment',
		Key: {
			paymentId
		}
	};
	const result = await dynamoDB.get(params).promise();
	return result.Item as Payment;
};
export const updateStatusPayment = async (paymentId: string, status: string) => {
	const params: DynamoDB.DocumentClient.UpdateItemInput = {
		TableName: 'Payment',
		Key: {
			paymentId
		},
		UpdateExpression: 'SET #status = :status',
		ExpressionAttributeNames: {
			'#status': 'status'
		},
		ExpressionAttributeValues: {
			':status': status
		}
	};
	try {
		await dynamoDB.update(params).promise();
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const getPaymentByPaymentId = async (paymentId: string) => {
	const params = {
		TableName: 'Payment',
		Key: {
			paymentId
		}
	};
	const result = await dynamoDB.get(params).promise();
	if (!result.Item) {
		throw customError('Payment not found', StatusCodes.BAD_REQUEST);
	}
	return result.Item as Payment;
};
export const getPaymentsForSevenDay = async () => {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	console.log('sevenDaysAgo', sevenDaysAgo.toISOString());

	const params = {
		TableName: 'Payment',
		IndexName: 'DateIndex',
		KeyConditionExpression: '#status = :status AND #createdAt BETWEEN :sevenDaysAgo AND :now',
		ExpressionAttributeNames: {
			'#createdAt': 'createdAt',
			'#status': 'status'
		},
		ExpressionAttributeValues: {
			':sevenDaysAgo': sevenDaysAgo.toISOString(),
			':now': new Date().toISOString(),
			':status': 'success'
		}
	};
	try {
		console.log('done');

		const result = await dynamoDB.query(params).promise();

		console.log('result', result);
		return result.Items as Payment[];
	} catch (error) {
		console.log('error', error);

		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
};
export const getPaymentsByStatusSuccess = async () => { 
	const params = {
		TableName: 'Payment',
		IndexName: 'StatusIndex',
		KeyConditionExpression: '#status = :status',
		ExpressionAttributeNames: {
			'#status': 'status'
		},
		ExpressionAttributeValues: {
			':status': 'success'
		}
	};
	try {
		const result = await dynamoDB.query(params).promise();
		return result.Items as Payment[];
	} catch (error) {
		throw customError((error as Error).message, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
