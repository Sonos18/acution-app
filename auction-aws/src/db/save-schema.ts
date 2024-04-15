import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { dateMarshall, dateUnmarshall } from './date-dynamo';

@table('Save')
export class Save {
	@hashKey()
	blogId!: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	created_at?: string;

	@attribute({ marshall: dateMarshall, unmarshall: dateUnmarshall })
	updated_at?: string;
}
