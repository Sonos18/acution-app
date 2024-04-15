import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { object, string } from 'yup';

import { Category } from '~/db/category-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { createSchema } from '~/utils/query-dynamo.ts/create';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

export const handler: HandlerFn = async (event, callback) => {
	try {
		const { nameCategory } = extractBodyDataFromRequest({ event, schema: createCategorySchema });
		const category = await createCategory(nameCategory);
		callback(null, { statusCode: 201, body: JSON.stringify(category) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
const createCategory = async (nameCategory: string) => {
	const category = new Category();
	category.categoryName = nameCategory;
	category.categoryId = v4();
	category.createdAt = new Date().toISOString();
	category.updatedAt = new Date().toISOString();
	await createSchema('Category', category);
	return category;
};
export const createCategorySchema = object({
	nameCategory: string().required()
});
