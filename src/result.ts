import { ensureError } from './ensureError.js';

export type Result<T> = [null, T] | [Error, null];

type AnyFn = (...args: any[]) => any;

//prettier-ignore
type ResultFn<Fn extends AnyFn> = (...args: Parameters<Fn>) => Result<ReturnType<Fn>>;

export function result<Fn extends AnyFn>(fn: Fn): ResultFn<Fn> {
	return function result(this: unknown, ...args: Parameters<Fn>) {
		try {
			return [null, fn.call(this, ...args)];
		} catch (error: unknown) {
			return [ensureError(error, result), null];
		}
	};
}
