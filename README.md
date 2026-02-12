# @drunkcod/promise-result

> Promise.result because, yeah.

A lightweight, zero-dependency utility to bring Go-style/Rust-style error handling to TypeScript. It eliminates `try/catch` nesting by converting promises and functions into a `Result` type that is easy to narrow and safe to use.

## Features

- **Type-safe Narrowing:** Full TypeScript support for `Result<T>` which distinguishes between success and error states.
- **Prototype Extension:** Optional `Promise.prototype.result()` for ergonomic chaining.
- **Error Normalization:** Automatically converts non-error throws (like strings) into proper `Error` objects with preserved stack traces.
- **Multi-style Access:** Use object destructuring (`{ error, value }`) or array destructuring (`.toArray()`).

## Installation

```bash
npm install @drunkcod/promise-result
```

## Usage

### Promises (The bread and butter)

By importing the main package, `Promise` is extended with the `.result()` method. This allows for clean handling of async operations without `try/catch`.

```typescript
import '@drunkcod/promise-result';

const { error, value: user } = await fetchUser(id).result();

if (error) {
  console.error('Failed to fetch user:', error.message);
  return;
}

// 'user' is now narrowed and safe to use
console.log(user.name);
```

### Synchronous Functions

Wrap existing functions to make them safe without manual `try/catch`.

```typescript
import { result } from '@drunkcod/promise-result';

const safeJSON = result(JSON.parse);

const { error, value } = safeJSON('{ "malformed": json }');

if (error) {
  // error is a guaranteed Error object
  return;
}

console.log(value);
```

### Multi-style Access

While object destructuring is preferred for type narrowing, you can also use array destructuring via `.toArray()` if that fits your style.

```typescript
import { safeCall } from '@drunkcod/promise-result';

const [err, greeting] = safeCall((name: string) => `Hello ${name}`, null, 'World').toArray();
```

## API

### `Result<T>`
The core type returned by all utilities. It is a union of:
- `{ error: Error; value: null; }`
- `{ error: null; value: T; }`

Both variants include a `.toArray()` method that returns `[Error | null, T | null]`.

### `Promise.prototype.result()`
Extends the global `Promise` interface. Returns a `Promise<Result<T>>`.

### `result(fn)`
Returns a new function that wraps `fn`. The new function returns a `Result`. It preserves `this` context when called or bound.

### `ensureError(err, contextFn)`
A utility used internally (but exported) that ensures any thrown value is converted to an `Error`. If the value isn't an `Error`, it creates a `RejectionError` and uses `Error.captureStackTrace` to keep the stack trace clean.

## Why use this?

`try/catch` blocks create extra indentation and often force you to declare variables with `let` outside the block scope.

**Before:**
```typescript
let user;
try {
  user = await fetchUser();
} catch (e) {
  const error = e instanceof Error ? e : new Error(String(e));
  handleError(error);
  return;
}
console.log(user.id);
```

**After:**
```typescript
const { error, value: user } = await fetchUser().result();
if (error) return handleError(error);

console.log(user.id);
```

## License

MIT
