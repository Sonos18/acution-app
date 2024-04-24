import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Auction')
export class Auction {
	@hashKey()
	auctionId!: string;

	@attribute()
	userId!: string;

	@attribute()
	productId!: string;

	@attribute()
	startPrice!: number;

	@attribute()
	currentPrice?: number;

	@attribute()
	winner?: string;

	@attribute()
	endPrice!: number;

	@attribute()
	startTime!: string;

	@attribute()
	endTime!: string;

	@attribute()
	status!: string;

	@attribute()
	deleted?: boolean;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	createdAt!: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updatedAt!: string;
}
