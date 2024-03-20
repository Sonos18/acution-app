import jwt from 'jsonwebtoken';

import { AuthorizationHandlerFn } from '~/utils/createHandler';

export const TOKEN_USE = process.env.TOKEN_USE as 'id' | 'access' | null | undefined;
export const USER_POOL_ID = process.env.USER_POOL_ID;
export const CLIENT_ID = process.env.CLIENT_ID;

export const handler: AuthorizationHandlerFn = async (event, content, callback) => {
	try {
		if (event.headers?.authorization === undefined) {
			throw Error();
		}
		const token = event.identitySource[0];
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		console.log(decoded);
		return generatePolicy({ allow: true });
	} catch (error) {
		return callback('Unauthorized');
	}
};

const generatePolicy = ({ allow }: { allow: boolean }) => {
	return {
		principalId: 'token',
		policyDocument: {
			Version: '2012-10-17',
			Statement: {
				Action: 'execute-api:Invoke',
				Effect: allow ? 'Allow' : 'Deny',
				Resource: '*'
				// Resource: 'arn:aws:execute-api:us-east-1:*:*/*/*',
				// Resource: 'arn:aws:execute-api:us-east-1:*:*/*/auth/*',
			}
		}
	};
};
