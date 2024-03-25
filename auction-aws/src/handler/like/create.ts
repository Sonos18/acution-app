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
		const res = await createLike(id, likeData);
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
const createLike = async (userId: string, likeData: LikeInput) => {
	const params: DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'Like',
		Item: {
			userId,
			blogId: likeData.blogId,
			likeId: v4(),
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
const likeSchema: ObjectSchema<LikeInput> = object({
	blogId: string().required()
});
