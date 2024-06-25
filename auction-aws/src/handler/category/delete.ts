import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { object, string } from 'yup';

import { Category } from '~/db/category-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

import { checkExist, createCategory, deleteCategory } from '~/service/category';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: deleteCategorySchema });
		await deleteCategory(params.id);
		callback(null, { statusCode: 201, body: JSON.stringify({ message: 'Deleted' }) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};

export const deleteCategorySchema = object({
	id: string().required()
});
