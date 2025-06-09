import {
  FireAuth2Error,
  FireAuth2ErrorCodeEnum,
  FireAuth2ErrorTypeEnum,
} from '../../errors';

export function assertIsBrowserEnv(): void {
  const isMainThread =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const isWorker =
    typeof self !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (self as any).importScripts === 'function';

  if (!isMainThread && !isWorker) {
    throw new FireAuth2Error({
      message:
        'Expected to be running in a browser main thread or Web Worker environment.',
      code: FireAuth2ErrorCodeEnum.InternalError,
      type: FireAuth2ErrorTypeEnum.Env,
    });
  }

  if (typeof fetch !== 'function' || typeof URL === 'undefined') {
    throw new FireAuth2Error({
      message:
        'Browser environment does not support required APIs (fetch, URL).',
      code: FireAuth2ErrorCodeEnum.InternalError,
      type: FireAuth2ErrorTypeEnum.Env,
    });
  }
}
