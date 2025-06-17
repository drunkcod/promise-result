import type { Result } from './result.js';
import { errorResult } from './ensureError.js';

declare global {
	export interface Promise<T> {
		result(): Promise<Result<T>>;
	}
}

Promise.prototype.result = async function result() {
	try {
		return [null, await this];
	} catch (err) {
		return errorResult(err, result);
	}
};
