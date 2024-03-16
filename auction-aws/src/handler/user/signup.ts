import { HandlerFn } from "~/utils/createHandler";
import { DynamoDB } from "aws-sdk";
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';
import { extractBodyDataFromRequest } from "~/utils/validate-request/validate-body";
import { CreateUserInput } from "~/utils/types/user-type";

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
    try {
        // const userData = extractBodyDataFromRequest({event,schema: createUserSchema});

        // const params = {
        //     TableName: "Users",
        //     Item: userData
        // };

        // await dynamoDB.put(params).promise();

        callback(null, {
            statusCode: 200,
            // body: JSON.stringify({ message: "User created successfully" })
            body: JSON.stringify({ event: event })
        });
    } catch (error) {
        console.error("Error creating user:", error);
        callback(error as Error);
    }
};


export const createUserSchema: ObjectSchema<CreateUserInput> = object({
    firstName: string().required(),
    lastName: string().required(),
    username: string().required(),
    email: string().email().required(),
    phone: string().required(),
    role: string().required(),
    password: string().min(8).max(16).required(),
});