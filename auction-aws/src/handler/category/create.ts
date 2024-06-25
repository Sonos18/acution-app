import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { object, string } from 'yup';

import { Category } from '~/db/category-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

import { checkExist, createCategory } from '~/service/category';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { nameCategory } = extractBodyDataFromRequest({ event, schema: createCategorySchema });
		const name = nameCategory.charAt(0).toUpperCase() + nameCategory.slice(1).toLowerCase();
		console.log('name', name);
		// await checkExist(name);
		const category = await createCategory(name);
		callback(null, { statusCode: 201, body: JSON.stringify(category) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};

export const createCategorySchema = object({
	nameCategory: string().required()
});
