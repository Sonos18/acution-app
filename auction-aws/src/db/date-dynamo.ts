import { CustomType } from '@aws/dynamodb-data-marshaller';
import { AttributeValue } from 'aws-sdk/clients/dynamodb';

// Import the correct AttributeValue type

export const ISOdateType: CustomType<Date> = {
	type: 'Custom',
	marshall: (input: Date): AttributeValue => ({ S: input.toISOString() }),
	unmarshall: (persistedValue: AttributeValue): Date => new Date(persistedValue.S!)
};
