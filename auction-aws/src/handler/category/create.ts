import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { object, string } from 'yup';

import { Category } from '~/db/category-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

import { createCategory } from '~/service/category';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { nameCategory } = extractBodyDataFromRequest({ event, schema: createCategorySchema });
		const category = await createCategory(nameCategory);
		callback(null, { statusCode: 201, body: JSON.stringify(category) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};

export const createCategorySchema = object({
	nameCategory: string().required()
});
