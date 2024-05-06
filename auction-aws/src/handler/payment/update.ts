import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { getPaymentById, updateStatusPayment } from '~/service/payment';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: getIdSchema });
		const payment = await getPaymentById(id);
		await updateStatusPayment(payment.paymentId, 'paid');
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
export const getIdSchema: ObjectSchema<{ id: string }> = object({
	id: string().required()
});
