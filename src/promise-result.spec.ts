import { describe, expect, test } from '@jest/globals';
import './promise-result.js';
import { result } from './index.js';

describe('Promise.result', () => {
	test('success', async () => {
		expect(await Promise.resolve(42).result()).toEqual([null, 42]);
	});

	test('error', async () => {
		const error = new Error();
		expect(await Promise.reject(error).result()).toEqual([error, null]);
	});
});

describe('result', () => {
	test('success', () => {
		expect(result(() => 1)()).toEqual([null, 1]);
	});

	test('error', () => {
		const error = new Error();
		expect(
			result(() => {
				throw Error();
			})(),
		).toEqual([error, null]);
	});

	test('member function', () => {
		const obj = {
			message: 'hello',
			hello(name: string) {
				return `${this.message} ${name}`;
			},
		};
		expect({
			bob: result(obj.hello).call({ message: 'yo' }, 'bob'),
			alice: result(obj.hello).bind(obj)('alice'),
		}).toEqual({
			bob: [null, 'yo bob'],
			alice: [null, 'hello alice'],
		});
	});

	test('stack', () => {
		const [error, _] = result(() => {
			throw 'rocks';
		})();
		//console.log(error);
	});
});
