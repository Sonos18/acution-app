import { start } from 'repl';
import { v4 } from 'uuid';
import { ObjectSchema, array, boolean, number, object, string } from 'yup';

import { Auction } from '~/db/auction-schema';
import { Product } from '~/db/product-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { CreateAuctionInput } from '~/utils/types/auction-type';
import { CreateProductInput } from '~/utils/types/product-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';
import { decodedTokenFromHeader } from '~/utils/validate-request/validate-header';

import { createAuction } from '~/service/auction';
import { createProduct } from '~/service/product';

import { GetImgUrl } from '../s3/get-url';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { id } = decodedTokenFromHeader(event);
		const auctionData = extractBodyDataFromRequest({ event, schema: createAuctionSchema });
		console.log('auctionData', auctionData);
		const product = await addProductToAuction(auctionData);
		await createAuction(auctionData, id, product.productId);
		callback(null, { statusCode: 201, body: JSON.stringify('Created auction') });
	} catch (e) {
		const error = e as Error;
		customErrorOutput(error, callback);
	}
};

export const addProductToAuction = async (data: CreateAuctionInput) => {
	const images = await GetImgUrl(data.images);
	const productData: CreateProductInput = {
		categoryId: data.categoryId,
		description: data.description,
		images: images,
		origin: data.origin,
		productName: data.productName
	};
	return await createProduct(productData);
};
export const createAuctionSchema: ObjectSchema<CreateAuctionInput> = object({
	startPrice: number().required(),
	endPrice: number().required(),
	endTime: string().required(),
	startTime: string().required(),
	productName: string().required(),
	description: string().required(),
	categoryId: string().required(),
	origin: string().required(),
	images: array().of(string().required()).required()
});
