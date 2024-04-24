import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Product')
export class Product {
	@hashKey()
	productId!: string;

	@attribute()
	categoryId!: string;

	@attribute()
	productName!: string;

	@attribute()
	description!: string;

	@attribute()
	images!: string[];

	@attribute()
	origin!: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	createdAt?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updatedAt?: string;
}
