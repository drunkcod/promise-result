import { Result, ResultLike } from './result.js';

declare global {
	export interface Promise<T> {
		result(): Promise<ResultLike<T>>;
	}
}

Promise.prototype.result = function result() {
	return Result.of(this);
};
