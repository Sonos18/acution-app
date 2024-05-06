import { Payment } from '~/db/payment-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { confirmStatusAuction } from '~/service/auction';
import { createPayment } from '~/service/payment';

import { schema } from './bid';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: schema });
		const user = decodedTokenFromHeader(event);
		const payment = await confirmStatusAuction(id, user.id);
		await createPayment(payment);
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
