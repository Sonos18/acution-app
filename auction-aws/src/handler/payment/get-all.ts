import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { getPaymentsByStatusForUser } from '~/service/payment';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const user = decodedTokenFromHeader(event);
		const payments = await getPaymentsByStatusForUser(user.id, 'pending');
		return callback(null, { body: JSON.stringify(payments), statusCode: 200 });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
