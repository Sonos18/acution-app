import { v4 } from 'uuid';
import { ObjectSchema, array, number, object, string } from 'yup';

import { Product } from '~/db/product-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { createSchema } from '~/utils/query-dynamo.ts/create';
import { CreateProductInput } from '~/utils/types/product-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const productData = extractBodyDataFromRequest({ event, schema: createProductSchema });
		const product = await createProduct(productData);
		callback(null, { statusCode: 201, body: JSON.stringify(product) });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};
const createProduct = async (data: CreateProductInput) => {
	const param: Product = {
		...data,
		productId: v4()
	};
	await createSchema('Product', param);
	return param;
};
export const createProductSchema: ObjectSchema<CreateProductInput> = object({
	productName: string().required(),
	description: string().required(),
	price: number().required(),
	image: string().required(),
	categoryId: string().required(),
	origin: string().required(),
	images: array().of(string().required()).required()
});
