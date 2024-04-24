import { S3 } from 'aws-sdk';

export const GetImgUrl = async (key: string[]) => {
	const s3 = new S3();
	const bucketName = process.env.BUCKET_NAME ?? '';
	const urlPromises = key.map(
		(k) =>
			new Promise<string>((resolve, reject) => {
				const params = {
					Bucket: bucketName,
					Key: k
				};
				s3.getSignedUrl('getObject', params, (err, url) => {
					if (err) {
						reject(err);
					} else {
						resolve(url);
					}
				});
			})
	);
	const urls = await Promise.all(urlPromises);
	return urls;
};
