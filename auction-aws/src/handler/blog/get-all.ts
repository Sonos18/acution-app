import { DynamoDB } from 'aws-sdk';
import { ObjectSchema, number, object, string } from 'yup';

import { HandlerFn, customError, customErrorOutput } from '~/utils/createHandler';
import { paginateBase } from '~/utils/paginate';
import { GetBlogsInput, lastKeyBlogs } from '~/utils/types/blog-type';
import { extractPathParamsFromRequest } from '~/utils/validate-request/validate-params';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const params = extractPathParamsFromRequest({ event, schema: getBlogsSchema });
		const { lastKey, page, limit } = paginateBase(
			params.page,
			params.limit,
			params.keyBlogId,
			params.keyUserId
		);
		const blogs = await getBlogs(page, limit, params.userId, lastKey);
		callback(null, { body: JSON.stringify(blogs) });
	} catch (error) {
		const e = error as Error;
		customErrorOutput(e, callback);
	}
};

export const getBlogs = async (
	page: number,
	limit: number,
	userId?: string,
	lastKey?: lastKeyBlogs
) => {
	let params: DynamoDB.DocumentClient.QueryInput | DynamoDB.DocumentClient.ScanInput = {
		TableName: 'Blog',
		Limit: limit,
		FilterExpression: 'attribute_not_exists(deleted) OR deleted = :deleted',
		ExpressionAttributeValues: {
			':deleted': false
		}
	};
	// If userId is provided, set KeyConditionExpression and ExpressionAttributeValues
	if (userId) {
		params = {
			...params,
			IndexName: 'UserIndex',
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues: {
				...params.ExpressionAttributeValues,
				':userId': userId
			}
		};
	}

	// If it's not the first page, set ExclusiveStartKey
	if (page > 1) {
		if (userId) {
			params.ExclusiveStartKey = lastKey;
		} else {
			params.ExclusiveStartKey = lastKey;
		}
	}

	let result;
	try {
		if (userId) {
			result = await dynamoDB.query(params as DynamoDB.DocumentClient.QueryInput).promise();
		} else {
			result = await dynamoDB.scan(params as DynamoDB.DocumentClient.ScanInput).promise();
		}
	} catch (error) {
		const e = error as Error;
		throw customError(e.message, 500);
	}

	return {
		items: result.Items,
		lastKey: result.LastEvaluatedKey
	};
};
const getBlogsSchema: ObjectSchema<GetBlogsInput> = object({
	page: number().optional(),
	limit: number().optional(),
	userId: string().optional(),
	keyBlogId: string().optional(),
	keyUserId: string().optional()
});
