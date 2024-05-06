import { ObjectSchema, object, string } from 'yup';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { SigninWithProviderInput } from '~/utils/types/auth-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

import { getUserByEmail, getUserById, signinWithProvider } from '~/service/user';

import { generateAccessToken, generateRefreshToken } from '../user/signin';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const data = extractBodyDataFromRequest({ event, schema: SigninWithProvider });
		const user = await getUserById(data.id);
		const res = await signinWithProvider(data, user);
		const accessToken = generateAccessToken(res.userId, 'user');
		const refreshToken = generateRefreshToken(res.userId, 'user');
		const response = {
			accessToken,
			refreshToken,
			user: {
				userId: res.userId,
				firstName: res.firstName,
				email: res.email,
				avatar: res.avatar,
				lastName: ''
			}
		};
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(response)
		});
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
const SigninWithProvider: ObjectSchema<SigninWithProviderInput> = object({
	provider: string().required(),
	email: string().email().required(),
	name: string().required(),
	id: string().required(),
	picture: string().required()
});
