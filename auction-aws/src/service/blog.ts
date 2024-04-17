import { DynamoDB } from 'aws-sdk';

import { Blog } from '~/db/blog-schema';

import { customError } from '~/utils/createHandler';

const dynamoDB = new DynamoDB.DocumentClient();

export const getBlogById = async (id: string) => {
	const params = {
		TableName: 'Blog',
		KeyConditionExpression: 'blogId = :blogId',
		FilterExpression: 'deleted <> :deleted',
		ExpressionAttributeValues: {
			':deleted': true,
			':blogId': id
		}
	};
	const result = await dynamoDB.query(params).promise();
	if (result.Items && result.Items.length > 0) {
		return result.Items[0] as Blog;
	}
	throw customError('Blog not exist', 404);
};
