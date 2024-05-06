import type { AnyObject, Maybe } from 'yup';

import { customError } from '../createHandler';
import { yupValidator } from '../validators/yup-validator';
import type { ExtractDataFromRequestProps } from './form-data-validate';

export const extractBodyDataFromRequest = <T extends Maybe<AnyObject>>(
	props: ExtractDataFromRequestProps<T>
) => {
	const { event, schema } = props;
	const data = event?.body ? (JSON.parse(event.body) as T) : undefined;
	const validateRes = yupValidator(schema).validateSync({ ...data });
	console.log('validateRes', validateRes);

	if (validateRes.error || validateRes.data === null || validateRes.data === undefined) {
		throw customError('Unprocessable Content', 422);
	}
	return validateRes.data as T;
};
