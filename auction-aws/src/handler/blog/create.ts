
import { DynamoDB } from "aws-sdk";
import { Hashtag } from "~/db/hashtag-schema";
import { HandlerFn } from "~/utils/createHandler";
import { v4 } from "uuid";

export const handler: HandlerFn = async (event, context, callback) => {
    try {
        const hashtag: Hashtag = {
        hashtagId:v4(),
        name: "hi",
    };
    const dynamoDB = new DynamoDB.DocumentClient();

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'Hashtag',
        Item: hashtag
    };
    await dynamoDB.put(params).promise();
    callback(null, { body: JSON.stringify(hashtag) });	
    } catch (error) {
        console.error('Error adding hashtag:', error);
        throw error;
    }
};