import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { ObjectSchema, object, string } from 'yup';

import { HandlerFn } from '~/utils/createHandler';
import { ContentTypeInput } from '~/utils/types/s3-type';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { type } = extractBodyDataFromRequest({ event, schema: ContentTypeSchema });
		const s3 = new S3();
		const bucketName = process.env.BUCKET_NAME ?? '';
		const key = v4();
		const params = { Bucket: bucketName, Key: key, Expires: 5 * 60, ContentType: type };
		const url = s3.getSignedUrl('putObject', params);
		callback(null, {
			statusCode: 200,
			body: JSON.stringify({ url, key })
		});
	} catch (error) {
		const e = error as Error;
		console.log(e);
	}
};
export const ContentTypeSchema: ObjectSchema<ContentTypeInput> = object({
	type: string().required()
});
