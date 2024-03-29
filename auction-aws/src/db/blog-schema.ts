import {
	attribute,
	autoGeneratedHashKey,
	rangeKey,
	table
} from '@aws/dynamodb-data-mapper-annotations';
import { User } from 'aws-sdk/clients/budgets';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Blog')
export class Blog {
	@autoGeneratedHashKey()
	blogId!: string;

	@attribute()
	userId?: string;

	@attribute()
	title?: string;

	@attribute()
	content?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	created_at?: Date;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updated_at?: Date;

	@attribute()
	deleted?: boolean;
}
