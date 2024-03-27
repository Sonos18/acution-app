import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { LikeInput } from '~/utils/types/like-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const likeData = extractBodyDataFromRequest({ event, schema: likeSchema });
		await checkLiked(id, likeData.blogId);
		const res = await createLike(id, likeData);
		callback(null, { body: JSON.stringify(res) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
export const checkLiked = async (userId: string, blogId: string) => {
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
	if (res.Items && res.Items.length > 0) {
		throw customError('Already liked', 400);
	}
};

const createLike = async (userId: string, likeData: LikeInput) => {
	const params: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Like',
		Item: {
			userId,
			blogId: likeData.blogId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	};
	try {
		await dynamoDB.put(params).promise();
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}
	return params.Item;
};
export const likeSchema: ObjectSchema<LikeInput> = object({
	blogId: string().required()
});
