import type { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';

import { customError } from '../createHandler';

export interface YupValidatorResponse {
	data: Maybe<AnyObject>;
	error?: Record<string, string | undefined>;
}

export const yupValidator = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => {
	const respose: YupValidatorResponse = {
		data: null
	};
	const errorHandler = (error: unknown) => {
		const errorRes: Partial<Record<keyof T, string | undefined>> = {};
		const typedError = error as ValidationError;
		typedError.inner.forEach((e) => {
			errorRes[e.path as keyof T] = e.message;
		});
		return errorRes as Readonly<typeof errorRes>;
	};

	const validate = async <T extends Maybe<AnyObject>>(form: T) => {
		try {
			const res = await schema.validate(form, {
				abortEarly: false
			});

			respose.data = res === undefined ? null : res;
			return respose;
		} catch (error) {
			respose.error = errorHandler(error);
			return respose;
		}
	};

	const validateSync = <T extends Maybe<AnyObject>>(form: T) => {
		try {
			const res = schema.validateSync(form, {
				abortEarly: false
			});
			respose.data = res === undefined ? null : res;
			return respose;
		} catch (error) {
			respose.error = errorHandler(error);
			return respose;
		}
	};

	return { validate, validateSync };
};

export const simpleValidateData = <T extends Maybe<AnyObject>>(
	params: T,
	schema: ObjectSchema<T>
) => {
	const validateRes = yupValidator(schema).validateSync({ ...params });

	if (validateRes.error || validateRes.data === null || validateRes.data === undefined) {
		throw customError('Unprocessable Content', 422);
	}
	return validateRes.data as T;
};

export interface SimpleValidateDataWithoutThrowRespose<T> {
	error?: Record<string, string | undefined>;
	data: T;
}

export const simpleValidateDataWithoutThrow = <T extends Maybe<AnyObject>>(
	params: T,
	schema: ObjectSchema<T>
): SimpleValidateDataWithoutThrowRespose<T> => {
	const validateRes = yupValidator(schema).validateSync({ ...params });

	if (validateRes.error || validateRes.data === null || validateRes.data === undefined) {
		return {
			error: validateRes.error,
			data: params
		};
	}
	return {
		error: undefined,
		data: validateRes.data as T
	};
};