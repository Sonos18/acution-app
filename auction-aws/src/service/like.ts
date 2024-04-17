import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
export const countLikesForBlog = async (blogId: string, userId: string) => {
	const params = {
		TableName: 'Like',
		KeyConditionExpression: 'blogId = :blogId',
		ExpressionAttributeValues: {
			':blogId': blogId
		}
	};
	const likes = await dynamoDB.query(params).promise();
	if (!likes.Items) {
		return {
			likes: 0,
			isLiked: false
		};
	}
	return {
		likes: likes.Items.length,
		isLiked: likes.Items.some((like) => like.userId === userId)
	};
};
