import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { UpdateUserInput } from '~/utils/types/user-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { treeSakingUser, updateUser } from '~/service/user';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const userData = extractBodyDataFromRequest({ event, schema: UpdateUserSchema });
		let userId: string;
		if (userData.userId) {
			userId = userData.userId;
		} else {
			const user = decodedTokenFromHeader(event);
			userId = user.id;
		}
		const userUpdated = await updateUser(userId, userData);
		const res = treeSakingUser(userUpdated);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
export const UpdateUserSchema: ObjectSchema<UpdateUserInput> = object({
	firstName: string().required(),
	lastName: string().required(),
	email: string().email().required(),
	phone: string().required(),
	userId: string().optional()
});
