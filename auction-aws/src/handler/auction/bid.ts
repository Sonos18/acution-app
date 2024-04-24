import { ObjectSchema, number, object, string } from 'yup';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { bidAuction } from '~/service/auction';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: schema });
		const { price } = extractBodyDataFromRequest({ event, schema: bidSchema });
		const user = decodedTokenFromHeader(event);
		const res = await bidAuction(id, price, user.id);
		callback(null, { body: JSON.stringify(res), statusCode: 200 });
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};

export const schema: ObjectSchema<{ id: string }> = object({
	id: string().required()
});
const bidSchema: ObjectSchema<{ price: number }> = object({
	price: number().required()
});
