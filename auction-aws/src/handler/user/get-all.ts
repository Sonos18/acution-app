import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';

import { getAllUser } from '~/service/user';

import { treeSakingUsers } from '../../service/user';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		console.log('event', event);
		const users = await getAllUser();
		console.log('users', users);
		const res = treeSakingUsers(users);
		console.log('res', res);
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(res)
		});
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};
