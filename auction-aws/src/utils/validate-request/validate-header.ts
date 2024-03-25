import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';

import { customError } from '../createHandler';

const keyAccess = process.env.KEY_ACCESS_TOKEN ?? '';

export const decodedTokenFromHeader = (event: APIGatewayProxyEvent) => {
	if (event.headers?.authorization === undefined) {
		throw customError('Authorization header is missing', 401);
	}
	const token = event.headers.authorization.replace('Bearer ', '');
	const { id, role } = jwt.verify(token, keyAccess) as jwt.JwtPayload;
	return { id, role };
};
