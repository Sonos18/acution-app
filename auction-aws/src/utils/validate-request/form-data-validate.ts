import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { AnyObject, Maybe, ObjectSchema } from 'yup';

export interface ExtractDataFromRequestProps<T extends Maybe<AnyObject>> {
	event: APIGatewayProxyEvent;
	schema: ObjectSchema<T>;
}