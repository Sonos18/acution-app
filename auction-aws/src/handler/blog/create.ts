
import { DynamoDB } from "aws-sdk";
import { Hashtag } from "~/db/hashtag-schema";
import { HandlerFn } from "~/utils/createHandler";
import { v4 } from "uuid";

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const hashtag: Hashtag = {
		id:v4(),
        name: "hi",
        created_at: new Date(),
        updated_at: new Date()
	};
	const dynamoDB = new DynamoDB.DocumentClient();

	const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'Hashtag',
        Item: hashtag
	};
	const res = await dynamoDB.put(params).promise();
	callback(null, JSON.stringify(res.$response));	
    } catch (error) {
        console.error('Error adding hashtag:', error);
        throw error;
    }
};