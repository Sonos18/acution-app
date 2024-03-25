import { attribute, autoGeneratedHashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

// Import the Blog model

@table('RefreshToken')
export class RefreshToken {
	@autoGeneratedHashKey()
	tokenId?: string;

	@attribute()
	userId!: string;

	@attribute()
	token!: string;

	@attribute({
		defaultProvider: () => new Date(),
		marshall: dateMarshall,
		unmarshall: dateUnmarshall
	})
	createdAt?: Date;

	@attribute({
		defaultProvider: () => new Date(),
		marshall: dateMarshall,
		unmarshall: dateUnmarshall
	})
	updatedAt?: Date;
	@attribute()
	deleted?: boolean;
}