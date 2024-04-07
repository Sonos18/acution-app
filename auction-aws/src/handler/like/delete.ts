import { DynamoDB } from 'aws-sdk';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { LikeInput } from '~/utils/types/like-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { likeSchema } from './create';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const likeData = extractBodyDataFromRequest({ event, schema: likeSchema });
		await checkLiked(id, likeData.blogId);
		const res = await disLike(likeData);
		callback(null, { body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
const checkLiked = async (userId: string, blogId: string) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Like',
		IndexName: 'UserIndex',
		KeyConditionExpression: 'userId = :userId',
		FilterExpression: 'blogId = :blogId',
		ExpressionAttributeValues: {
			':userId': userId,
			':blogId': blogId
		}
	};
	let res;
	try {
		res = await dynamoDB.query(params).promise();
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}
	if (!res.Items || res.Items.length < 0) {
		throw customError('Blog not exist', 400);
	}
};
const disLike = async (likeData: LikeInput) => {
	const params: DynamoDB.DocumentClient.DeleteItemInput = {
		TableName: 'Like',
		Key: {
			blogId: likeData.blogId
		}
	};
	let res;
	try {
		res = await dynamoDB.delete(params).promise();
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}
	return res;
};
