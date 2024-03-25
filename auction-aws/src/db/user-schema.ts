import { attribute, autoGeneratedHashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { Blog } from './blog-schema';
import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('User')
export class User {
	@autoGeneratedHashKey()
	userId?: string;

	@attribute()
	firstName?: string;

	@attribute()
	lastName?: string;

	@attribute()
	email?: string;

	@attribute()
	phone?: string;

	@attribute()
	role?: string;

	@attribute()
	blogs?: Blog[];

	@attribute()
	password?: string;

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