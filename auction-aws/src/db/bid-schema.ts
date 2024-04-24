import { attribute, autoGeneratedHashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Bid')
export class Bid {
	@autoGeneratedHashKey()
	bidId!: string;

	@attribute()
	userId!: string;

	@attribute()
	auctionId!: string;

	@attribute()
	price?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	created_at?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updated_at?: string;
}
