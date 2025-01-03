import type { Result } from './result.js';
import { ensureError } from './ensureError.js';

declare global {
	export interface Promise<T> {
		result(): Promise<Result<T>>;
	}
}

Promise.prototype.result = async function result() {
	try {
		const r = await this;
		return [null, r];
	} catch (err) {
		return [ensureError(err, result), null];
	}
};
