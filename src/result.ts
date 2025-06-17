import { errorResult } from './ensureError.js';

export type Result<T> = [error: null, value: T] | [error: Error, value: null];

type AnyFn = (...args: any[]) => any;

//prettier-ignore
type ResultFn<Fn extends AnyFn> = (...args: Parameters<Fn>) => Result<ReturnType<Fn>>;

export function result<Fn extends AnyFn>(fn: Fn): ResultFn<Fn> {
	return function result(this: unknown, ...args: Parameters<Fn>) {
		try {
			return [null, fn.call(this, ...args)];
		} catch (error: unknown) {
			return errorResult(error, result);
		}
	};
}

export function safeCall<Fn extends AnyFn>(
	fn: Fn,
	thisArg?: ThisParameterType<Fn>,
	...args: Parameters<Fn>
): Result<ReturnType<Fn>> {
	try {
		return [null, fn.call(thisArg, ...args)];
	} catch (error: unknown) {
		return errorResult(error, safeCall);
	}
}

export function safeApply<Fn extends AnyFn>(
	fn: Fn,
	thisArg: ThisParameterType<Fn>,
	args: Parameters<Fn>,
): Result<ReturnType<Fn>> {
	try {
		return [null, fn.apply(thisArg, args)];
	} catch (error: unknown) {
		return errorResult(error, safeApply);
	}
}
