export class RejectionError extends Error {
	reason;
	constructor(message: string, reason: unknown) {
		super(message);
		this.reason = reason;
		this.name = 'RejectionError';
	}
}

export const ensureError = (err: unknown, fn: Function) => {
	if (err instanceof Error) return err;

	const { stackTraceLimit } = Error;
	Error.stackTraceLimit = 0;
	const e = new RejectionError('Promise rejected.', err);
	Error.stackTraceLimit = stackTraceLimit;
	Error.captureStackTrace(e, fn);

	return e;
};

export const errorResult = (error: unknown, stopAt: Function): [Error, null] => [ensureError(error, stopAt), null];
