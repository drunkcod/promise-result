import { describe, expect, test } from '@jest/globals';
import './promise-result.js';
import { result, safeApply, safeCall } from './index.js';

describe('Promise.result', () => {
	const notNull = <T>(x: T) => {};

	test('success', async () => {
		const r = (await Promise.resolve(42).result()).toArray();
		expect(r).toEqual([null, 42]);
	});

	test('error', async () => {
		const error = new Error();
		const r = (await Promise.reject(error).result()).toArray();
		expect(r).toEqual([error, null]);
	});

	test('array destructed error', async () => {
		const expectedError = new Error();
		const [error, value] = (await Promise.reject(expectedError).result()).toArray();
		expect([error, value]).toEqual([expectedError, null]);
	});

	test('array destructed value', async () => {
		const [error, value] = (await Promise.resolve('hello').result()).toArray();
		if (!error) notNull<string>(value);
	});

	test('destructed value', async () => {
		const { error, value } = await Promise.resolve(42).result();
		if (!error) notNull(value);
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
		})().toArray();
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
