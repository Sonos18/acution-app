// import { S3 } from "aws-sdk";
// import { HandlerFn } from "~/utils/createHandler";

// const bucketName = process.env.BUCKET_NAME ?? '';
// const s3 = new S3();
// const allowedTypes = ['image/jpeg', 'image/png'];
// export const handler: HandlerFn = async (event, context, callback) => {
//     const { file } = event.body;
// }import { S3 } from "aws-sdk";
// import { HandlerFn } from "~/utils/createHandler";

// const bucketName = process.env.BUCKET_NAME ?? '';
// const s3 = new S3();
// const allowedTypes = ['image/jpeg', 'image/png'];

// export const handler: HandlerFn = async (event, context, callback) => {
//     const { file } = event.body;

//     if (!allowedTypes.includes(file.type)) {
//         callback(new Error(`File type ${file.type} is not allowed`));
//         return;
//     }

//     const params = {
//         Bucket: bucketName,
//         Key: file.name,
//         Body: file.data,
//         ContentType: file.type,
//     };

//     try {
//         const uploadResult = await s3.upload(params).promise();
//         callback(null, uploadResult);
//     } catch (err) {
//         callback(err);
//     }
// }
