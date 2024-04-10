import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { ISOdateType } from './date-dynamo';

@table('Like')
export class Like {
	@hashKey()
	blogId!: string;

	@rangeKey()
	userId!: string;

	@attribute()
	likeId?: string;

	@attribute({ ...ISOdateType, defaultProvider: () => new Date() })
	created_at?: Date;

	@attribute({ ...ISOdateType, defaultProvider: () => new Date() })
	updated_at?: Date;
}
