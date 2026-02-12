import { ensureError } from './ensureError.js';

type ErrorResult = { error: Error; value: null; toArray(): [Error, null] };
type SuccessResult<T> = { error: null; value: T; toArray(): [null, T] };

export type Result<T> = ErrorResult | SuccessResult<T>;

type AnyFn = (...args: any[]) => any;
type ResultFn<Fn extends AnyFn> = (...args: Parameters<Fn>) => Result<ReturnType<Fn>>;

class Outcome<T> {
	error: Error | null;
	value: T | null;

	static error(error: Error): ErrorResult {
		return new Outcome(error, null) as ErrorResult;
	}
	static success<T>(value: T): SuccessResult<T> {
		return new Outcome(null, value) as SuccessResult<T>;
	}

	private constructor(error: Error | null, value: T | null) {
		this.error = error;
		this.value = value;
	}

	toArray() {
		return [this.error, this.value!];
	}
}

const errorResult = (error: unknown, stopAt: Function) => Outcome.error(ensureError(error, stopAt));
const noPromise = () => {
	throw new Error('Missing this or argument.');
};

export async function resultOf<T>(this: Promise<T>): Promise<Result<T>>;
export async function resultOf<T>(arg0: Promise<T>): Promise<Result<T>>;
export async function resultOf<T>(this: Promise<T>, arg0?: Promise<T>): Promise<Result<T>> {
	const target = this ?? arg0 ?? noPromise();
	try {
		return Outcome.success(await target);
	} catch (error) {
		return errorResult(error, resultOf);
	}
}

export function result<Fn extends AnyFn>(fn: Fn): ResultFn<Fn> {
	return function result(this: unknown, ...args: Parameters<Fn>) {
		try {
			return Outcome.success(fn.call(this, ...args));
		} catch (error) {
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
		return Outcome.success(fn.call(thisArg, ...args));
	} catch (error) {
		return errorResult(error, safeCall);
	}
}

export function safeApply<Fn extends AnyFn>(
	fn: Fn,
	thisArg: ThisParameterType<Fn>,
	args: Parameters<Fn>,
): Result<ReturnType<Fn>> {
	try {
		return Outcome.success(fn.apply(thisArg, args));
	} catch (error) {
		return errorResult(error, safeApply);
	}
}
