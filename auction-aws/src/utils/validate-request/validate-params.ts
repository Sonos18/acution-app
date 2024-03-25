import type { AnyObject, Maybe } from 'yup';

import { customError } from '../createHandler';
import { yupValidator } from '../validators/yup-validator';
import { ExtractDataFromRequestProps } from './form-data-validate';

export const extractPathParamsFromRequest = <T extends Maybe<AnyObject>>(
	props: ExtractDataFromRequestProps<T>
) => {
	const { event, schema } = props;
	const params = event.queryStringParameters;
	const validateRes = yupValidator(schema).validateSync({ ...params });
	console.log('Paramater', validateRes);

	if (validateRes.error || validateRes.data === null || validateRes.data === undefined) {
		throw customError('Unprocessable Content', 422);
	}
	return validateRes.data as T;
};
