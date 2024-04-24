import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { buyAuction } from '~/service/auction';

import { schema } from './bid';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: schema });
		const user = decodedTokenFromHeader(event);
		await buyAuction(id, user.id);
		callback(null, {
			body: JSON.stringify({ message: 'Product bought successfully' }),
			statusCode: 200
		});
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
