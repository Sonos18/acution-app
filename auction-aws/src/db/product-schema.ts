import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

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
}
