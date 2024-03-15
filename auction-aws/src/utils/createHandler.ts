import { APIGatewayEvent, APIGatewayProxyCallbackV2, Context } from "aws-lambda";

export type HandlerFn = (
	event: APIGatewayEvent,
	context: Context,
	callback: APIGatewayProxyCallbackV2
) => void;

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