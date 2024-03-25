import {
	attribute,
	autoGeneratedHashKey,
	rangeKey,
	table
} from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Like')
export class Like {
	@autoGeneratedHashKey()
	likeId?: string;

	@attribute()
	userId?: string;

	@attribute()
	blogId?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	created_at?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updated_at?: string;
}