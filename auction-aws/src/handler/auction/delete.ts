import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { checkExist } from '~/utils/query-dynamo.ts/get';
import { DeleteAuctionInput } from '~/utils/types/auction-type';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

export const handler: HandlerFn = async (event, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const { auctionId } = extractPathParamsFromRequest({ event, schema: deleteAuctionSchema });
		await checkAuction(auctionId, id);
		callback(null, { statusCode: 200, body: JSON.stringify({ message: 'Delete success' }) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
const checkAuction = async (auctionId: string, userId: string) => {
	const params = {
		KeyConditionExpression: 'userId = :userId and auctionId = :auctionId',
		ExpressionAttributeValues: {
			':userId': userId,
			':auctionId': auctionId
		}
	};
	await checkExist('Auction', params);
};
const deleteAuctionSchema: ObjectSchema<DeleteAuctionInput> = object({
	auctionId: string().required()
});
