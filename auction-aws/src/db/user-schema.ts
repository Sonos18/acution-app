import { attribute, autoGeneratedHashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { Blog } from './blog-schema';
import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('User')
export class User {
	@autoGeneratedHashKey()
	userId!: string;

	@attribute()
	firstName?: string;

	@attribute()
	provider?: string;

	@attribute()
	providerAccountId?: string;

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

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	created_at?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updated_at?: string;

	@attribute()
	deleted?: boolean;

	@attribute()
	avatar?: string;

	@attribute()
	coverImage?: string;
}
