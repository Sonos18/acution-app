import { start } from 'repl';
import { v4 } from 'uuid';
import { ObjectSchema, array, boolean, number, object, string } from 'yup';

import { Auction } from '~/db/auction-schema';
import { Product } from '~/db/product-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { createSchema } from '~/utils/query-dynamo.ts/create';
import { CreateAuctionInput } from '~/utils/types/auction-type';
import { CreateProductInput } from '~/utils/types/product-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

export const handler: HandlerFn = async (event, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const auctionData = extractBodyDataFromRequest({ event, schema: createAuctionSchema });
		const product = await createProduct(auctionData.productData);
		const auction = await createAuction(auctionData, id, product.productId);
		callback(null, { statusCode: 201, body: JSON.stringify(auction) });
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
const createAuction = async (data: CreateAuctionInput, userId: string, productId: string) => {
	const param: Auction = {
		...data,
		status: 'spending',
		productId,
		userId,
		auctionId: v4(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	await createSchema('Auction', param);
	return param;
};

export const createAuctionSchema: ObjectSchema<CreateAuctionInput> = object({
	category: string().required(),
	image: string().required(),
	startPrice: number().required(),
	endPrice: number().required(),
	currentPrice: number().required(),
	endTime: string().required(),
	startTime: string().required(),
	productData: object({
		productName: string().required(),
		description: string().required(),
		price: number().required(),
		image: string().required(),
		categoryId: string().required(),
		origin: string().required(),
		images: array().of(string().required()).required()
	}).required()
});
