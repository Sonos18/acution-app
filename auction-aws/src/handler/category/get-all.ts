import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';

import { getAllCategory } from '~/service/category';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const res = await getAllCategory();
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(res)
		});
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
