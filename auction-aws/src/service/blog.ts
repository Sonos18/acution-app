import { DynamoDB } from 'aws-sdk';

import { Blog } from '~/db/blog-schema';

import { customError } from '~/utils/createHandler';
import { lastKeyBlogs } from '~/utils/types/blog-type';

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
export const getBlogs = async (limit: number, lastKey?: lastKeyBlogs) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Blog',
		IndexName: 'DeletedIndex',
		KeyConditionExpression: 'deleted =:deleted',
		ExpressionAttributeValues: {
			':deleted': 'false'
		},
		ScanIndexForward: false,
		Limit: limit
	};
	if (lastKey) {
		params.ExclusiveStartKey = lastKey;
	}
	const result = await dynamoDB.query(params).promise();
	return {
		lastKey: result.LastEvaluatedKey as lastKeyBlogs,
		items: result.Items as Blog[]
	};
};
export const getBlogsByUserId = async (userId: string, limit: number, lastKey?: lastKeyBlogs) => {
	const params: DynamoDB.DocumentClient.QueryInput = {
		TableName: 'Blog',
		IndexName: 'UserIndex',
		KeyConditionExpression: 'userId = :userId AND deleted <> :deleted',
		ExpressionAttributeValues: {
			':deleted': DynamoDB.Converter.input(Buffer.from('true')),
			':userId': userId
		},
		ScanIndexForward: false,
		Limit: limit
	};
	if (lastKey) {
		params.ExclusiveStartKey = lastKey;
	}
	const result = await dynamoDB.query(params).promise();
	return {
		lastKey: result.LastEvaluatedKey as lastKeyBlogs,
		items: result.Items as Blog[]
	};
};
