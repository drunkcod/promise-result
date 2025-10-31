import { ensureError } from './ensureError.js';

const errorResult = <T>(error: unknown, stopAt: Function): Result<T> => new Result<T>(ensureError(error, stopAt), null);

export type ResultLike<T> =
	| { error: Error; value: null; toArray(): [Error, null] }
	| { error: null; value: T; toArray(): [null, T] };

export class Result<T> {
	error: Error | null;
	value: T | null;

	toArray(): [Error, null] | [null, T] {
		return this.error ? [this.error, null] : [null, this.value!];
	}

	static async of<T>(p: Promise<T>): Promise<ResultLike<T>> {
		try {
			return new Result(null, await p) as ResultLike<T>;
		} catch (err) {
			return errorResult(err, Result.of) as ResultLike<T>;
		}
	}

	constructor(error: Error, value: null);
	constructor(error: null, value: T);
	constructor(error: Error | null, value: T | null) {
		this.error = error;
		this.value = value;
	}
}

type AnyFn = (...args: any[]) => any;
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
