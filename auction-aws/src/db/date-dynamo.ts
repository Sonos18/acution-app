import { DynamoDB } from 'aws-sdk';

export const dateMarshall = (value: Date): DynamoDB.AttributeValue =>
	({ I: value.getTime() }) as DynamoDB.AttributeValue;
export const dateUnmarshall = ({ N }: DynamoDB.AttributeValue): Date | undefined =>
	N ? new Date(N) : undefined;
