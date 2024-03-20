import {
	APIGatewayAuthorizerCallback,
	APIGatewayEvent,
	APIGatewayProxyCallbackV2,
	APIGatewayProxyResultV2,
	APIGatewayRequestAuthorizerEventV2,
	Context
} from 'aws-lambda';

export type HandlerFn = (
	event: APIGatewayEvent,
	context: Context,
	callback: APIGatewayProxyCallbackV2
) => void;
export type CreateHandlerCallback = () => Promise<Record<string, unknown> | void>;

export const createHandler =
	(proxyCallback: APIGatewayProxyCallbackV2) =>
	async <T>(callback: () => Promise<T>) => {
		try {
			const body = await callback();
			proxyCallback(null, {
				statusCode: 200,
				body: JSON.stringify(body)
			});
		} catch (e) {
			const typedError = e as ReturnType<typeof customError>;
			console.log('error', JSON.stringify(typedError));

			const res: APIGatewayProxyResultV2 = {
				statusCode: typedError.code ?? 404,
				headers: typedError.headers
			};

			if (typedError.response === undefined) {
				res.body = JSON.stringify({});
			} else {
				res.body = JSON.stringify(typedError.response);
			}

			proxyCallback(null, res);
		}
	};
export type ErrorResponse = string | Record<string, unknown>;
export interface ErrorProps {
	code?: number;
	headers?: Record<string, string>;
	response?: string | Record<string, unknown>;
}
export const customError = (
	response: ErrorResponse,
	code?: number,
	headers?: Record<string, string>
): ErrorProps => {
	return {
		response,
		code,
		headers
	};
};
export const customErrorOutput = (e: Error, callback: APIGatewayProxyCallbackV2) => {
	const typedError = e as ReturnType<typeof customError>;
	const res: APIGatewayProxyResultV2 = {
		statusCode: typedError.code ?? 404,
		headers: typedError.headers
	};
	if (typedError.response === undefined) {
		res.body = JSON.stringify({});
	} else {
		res.body = JSON.stringify(typedError.response);
	}
	callback(null, res);
};
export type AuthorizationHandlerFn = (
	event: APIGatewayRequestAuthorizerEventV2,
	context: Context,
	callback: APIGatewayAuthorizerCallback
) => void;
