import { HandlerFn, customError, customErrorOutput } from "~/utils/createHandler";
import { DynamoDB } from "aws-sdk";
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';
import { extractBodyDataFromRequest } from "~/utils/validate-request/validate-body";
import { CreateUserInput, CreateUserOutput } from "~/utils/types/user-type";
import { v4 } from "uuid";
import { User } from "~/db/user-schema";
import * as bcrypt from 'bcryptjs';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: HandlerFn = async (event, context, callback) => {
    try {
        const userData = extractBodyDataFromRequest({ event, schema: createUserSchema }); 
        await checkEmail(userData.email);
        await checkPhone(userData.phone);
        const user = await createUser(userData);
        const output = responseDataMapping(user);
        callback(null,{ body: JSON.stringify(output)});
    } catch (e) {
        const error = e as Error;
        customErrorOutput(error, callback);
    }
};
const checkEmail = async (email: string) => {
    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'User',
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
        ':email': email
        }
    };
    let result=null;
  try {
    result = await dynamoDB.query(params).promise();
  } catch (error) {
      const e= error as Error;
    throw customError(e.message, 500);
    }
    if (result.Items && result.Items.length > 0) {
      throw new Error('Email already exists');
    }
}
const checkPhone = async (phone: string) => {
    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: "User",
        IndexName: 'PhoneIndex',
        KeyConditionExpression: "phone = :phone",
        ExpressionAttributeValues: {
            ":phone": phone
        }
    };
    let result=null;
    try {
        result = await dynamoDB.query(params).promise();
    } catch (error) {
        const e = error as Error;
        throw customError(e.message, 500);
    }
    if (result.Items && result.Items.length > 0){
        throw customError("Phone already exists", 400);
    }
}
const createUser = async (userData: CreateUserInput) => {
    try {
        const user:User = {
            ...userData,
            userId: v4(),
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password!, salt);
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: "User",
            Item: user
        };
        await dynamoDB.put(params).promise();
        return user;
    } catch (error) {
        throw customError("Error creating user", 500);
    }
};

export const responseDataMapping = (props: User): CreateUserOutput => {
	return {
		created_at: props.createdAt!,
		updated_at: props.updatedAt!,
		email: props.email!,
        user_id: props.userId!,
        first_name: props.firstName!,
        last_name: props.lastName!,
        phone: props.phone!,
	};
};
export const createUserSchema: ObjectSchema<CreateUserInput> = object({
    firstName: string().required(),
    lastName: string().required(),
    email: string().email().required(),
    phone: string().required(),
    role: string().required(),
    password: string().required()
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});