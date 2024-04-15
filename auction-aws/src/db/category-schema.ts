import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Category')
export class Category {
	@hashKey()
	categoryId!: string;

	@attribute()
	categoryName!: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	createdAt?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updatedAt?: string;
}
