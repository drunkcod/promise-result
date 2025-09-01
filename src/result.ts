import { ensureError } from './ensureError.js';

export class Result<T> {
	error: Error | null;
	value: T | null;

	*[Symbol.iterator]() {
		yield this.error;
		yield this.value;
	}

	toArray() {
		return Array.from(this);
	}

	constructor(error: Error, value: null);
	constructor(error: null, value: T);
	constructor(error: Error | null, value: T | null) {
		this.error = error;
		this.value = value;
	}
}

export const errorResult = <T>(error: unknown, stopAt: Function): Result<T> =>
	new Result<T>(ensureError(error, stopAt), null);

type AnyFn = (...args: any[]) => any;

//prettier-ignore
type ResultFn<Fn extends AnyFn> = (...args: Parameters<Fn>) => Result<ReturnType<Fn>>;

export function result<Fn extends AnyFn>(fn: Fn): ResultFn<Fn> {
	return function result(this: unknown, ...args: Parameters<Fn>) {
		try {
			return new Result(null, fn.call(this, ...args));
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
		return new Result(null, fn.call(thisArg, ...args));
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
		return new Result(null, fn.apply(thisArg, args));
	} catch (error: unknown) {
		return errorResult(error, safeApply);
	}
}
