
import { HandlerFn } from "~/utils/createHandler";

export const handler: HandlerFn = async (event, context, callback) => {

	console.log('Hello World');
	callback(null, 'Hi');
};