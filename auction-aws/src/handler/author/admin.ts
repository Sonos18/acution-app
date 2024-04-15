import jwt from 'jsonwebtoken';

import { AuthorizationHandlerFn } from '~/utils/createHandler';

export const handler: AuthorizationHandlerFn = async (event, callback) => {
	try {
		if (event.headers?.authorization === undefined) {
			throw Error();
		}
		const token = event.identitySource[0].replace('Bearer ', '');
		const keySecret = process.env.KEY_ACCESS_TOKEN ?? '';
		const decoded = jwt.verify(token, keySecret);
		if (typeof decoded === 'string' || decoded.role !== 'admin') {
			throw Error();
		}
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
