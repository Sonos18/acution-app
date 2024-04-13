import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Like')
export class Like {
	@hashKey()
	blogId!: string;

	@rangeKey()
	userId!: string;

	@attribute()
	likeId?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	created_at?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updated_at?: string;
}
