import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { confirmStatusAuction } from '~/service/auction';

import { schema } from './bid';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = extractPathParamsFromRequest({ event, schema: schema });
		const user = decodedTokenFromHeader(event);
		await confirmStatusAuction(id, user.id);
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
