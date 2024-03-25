import jwt from 'jsonwebtoken';

import { AuthorizationHandlerFn } from '~/utils/createHandler';

export const handler: AuthorizationHandlerFn = async (event, content, callback) => {
	try {
		if (event.headers?.authorization === undefined) {
			throw Error();
		}
		const token = event.identitySource[0].replace('Bearer ', '');
		const keySecret = process.env.KEY_ACCESS_TOKEN ?? '';
		console.log('token', keySecret);
		const decoded = jwt.verify(token, keySecret);
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
