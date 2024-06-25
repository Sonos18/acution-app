import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Notification')
export class Notification {
	@hashKey()
	notificationId!: string;

	@attribute()
	userId!: string;

	@attribute()
	auctionId!: string;

	@attribute()
	message!: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	createdAt?: string;
}
