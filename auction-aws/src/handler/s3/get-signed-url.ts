import { S3 } from 'aws-sdk';
import { publicDecrypt } from 'crypto';
import { v4 } from 'uuid';
import { ObjectSchema, array, number, object, string } from 'yup';

import { HandlerFn } from '~/utils/createHandler';
import { GetSignedUrlInput } from '~/utils/types/s3-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { types } = extractBodyDataFromRequest({ event, schema: ContentTypeSchema });
		const s3 = new S3();
		const bucketName = process.env.BUCKET_NAME ?? '';
		const urls = [];
		const keys = [];
		for (const type of types) {
			const key = v4();
			const params = {
				Bucket: bucketName,
				Key: key,
				Expires: 5 * 60,
				ContentType: type
			};
			const url = s3.getSignedUrl('putObject', params);
			urls.push(url);
			keys.push(key);
		}
		callback(null, {
			statusCode: 200,
			body: JSON.stringify({ urls, keys })
		});
	} catch (error) {
		const e = error as Error;
		console.log(e);
	}
};
export const ContentTypeSchema: ObjectSchema<GetSignedUrlInput> = object({
	types: array().of(string().required()).required()
});
