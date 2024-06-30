import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { buyAuction } from '~/service/auction';

import { bidSchema, schema } from './bid';
import { createNotification } from '~/service/notification';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: schema });
		const { price } = extractBodyDataFromRequest({ event, schema: bidSchema });
		const user = decodedTokenFromHeader(event);
		await buyAuction(id, user.id, price);
		await createNotification(user.id, id ,'You have bought a product successfully');
		callback(null, {
			body: JSON.stringify({ message: 'Product bought successfully' }),
			statusCode: 200
		});
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
