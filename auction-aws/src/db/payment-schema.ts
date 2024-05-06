import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Payment')
export class Payment {
	@hashKey()
	paymentId!: string;

	@attribute()
	userId!: string;

	@attribute()
	total!: number;

	@attribute()
	status!: string;

	@attribute()
	createdAt!: string;

	@attribute()
	auctionId!: string;
}
