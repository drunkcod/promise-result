import { errorResult, Result } from './result.js';

declare global {
	export interface Promise<T> {
		result(): Promise<Result<T>>;
	}
}

Promise.prototype.result = async function result() {
	try {
		return new Result(null, await this);
	} catch (err) {
		return errorResult(err, result);
	}
};
