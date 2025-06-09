export function wrapInPromise<T>(fn: () => T | Promise<T>): Promise<T> {
  try {
    const result = fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (result && typeof (result as any).then === 'function') {
      return result as Promise<T>;
    }
    return Promise.resolve(result);
  } catch (err) {
    // If fn throws synchronously, convert to rejected Promise
    return Promise.reject(err);
  }
}
