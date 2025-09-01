import { describe, expect, test } from '@jest/globals';
import './promise-result.js';
import { result, safeApply, safeCall } from './index.js';

describe('Promise.result', () => {
	test('success', async () => {
		expect((await Promise.resolve(42).result()).toArray()).toEqual([null, 42]);
	});

	test('error', async () => {
		const error = new Error();
		expect((await Promise.reject(error).result()).toArray()).toEqual([error, null]);
	});
});

describe('result', () => {
	test('success', () => {
		expect(result(() => 1)().toArray()).toEqual([null, 1]);
	});

	test('error', () => {
		const error = new Error();
		expect(
			result(() => {
				throw Error();
			})().toArray(),
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
			bob: result(obj.hello).call({ message: 'yo' }, 'bob').toArray(),
			alice: result(obj.hello).bind(obj)('alice').toArray(),
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

describe('safeCall', () => {
	test('success', () => {
		const double = (x: number) => x + x;
		expect(safeCall(double, null, 21).toArray()).toEqual([null, 42]);
	});

	test('error', () => {
		const error = new Error();
		expect(
			safeCall(() => {
				throw Error();
			}).toArray(),
		).toEqual([error, null]);
	});
});

describe('safeApply', () => {
	test('success', () => {
		const double = (x: number) => x + x;
		expect(safeApply(double, null, [21]).toArray()).toEqual([null, 42]);
	});

	test('error', () => {
		const error = new Error();
		expect(
			safeApply(
				() => {
					throw Error();
				},
				null,
				[],
			).toArray(),
		).toEqual([error, null]);
	});
});
