import { Result, resultOf } from './result.js';

declare global {
	export interface Promise<T> {
		result(): Promise<Result<T>>;
	}
}

Promise.prototype.result = resultOf;
