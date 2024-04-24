import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { DeleteOrGetOneAuctionInput } from '~/utils/types/auction-type';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const { auctionId } = extractPathParamsFromRequest({
			event,
			schema: DeleteOrGetOneAuctionInputSchema
		});
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
};
export const DeleteOrGetOneAuctionInputSchema: ObjectSchema<DeleteOrGetOneAuctionInput> = object({
	auctionId: string().required()
});
