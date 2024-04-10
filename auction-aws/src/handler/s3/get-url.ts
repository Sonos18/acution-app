import { S3 } from 'aws-sdk';

export const GetImgUrl = async (key: string) => {
	const s3 = new S3();
	const bucketName = process.env.BUCKET_NAME ?? '';
	const params = {
		Bucket: bucketName,
		Key: key,
		Expires: 60 * 60 // URL expires in 1 hour
	};

	return new Promise<string>((resolve, reject) => {
		s3.getSignedUrl('getObject', params, (err, url) => {
			if (err) {
				reject(err);
			} else {
				resolve(url);
			}
		});
	});
};
