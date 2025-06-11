import { FireAuth2ErrorCode } from './FireAuthErrorCodes';
import { FireAuth2ErrorType } from './FireAuthErrorTypes';

export interface FireAuthErrorJSON {
  name: string;
  message: string;
  code: FireAuth2ErrorCode;
  type: FireAuth2ErrorType;
  status?: number;
  cause?: string;
  stack?: string;
}

export class FireAuthError extends Error {
  readonly code: FireAuth2ErrorCode;
  readonly type: FireAuth2ErrorType;
  readonly status?: number;
  override readonly cause?: Error;

  constructor(options: {
    message: string;
    code?: FireAuth2ErrorCode;
    type: FireAuth2ErrorType;
    status?: number;
    cause?: Error;
  }) {
    super(options.message);
    this.name = 'FireAuthError';
    this.code = options.code ?? 'unknown';
    this.type = options.type;
    this.status = options.status;
    this.cause = options.cause;

    // Optional: Capture stack trace if supported (Node.js)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (Error as any).captureStackTrace === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Error as any).captureStackTrace(this, FireAuthError);
    }
  }

  toJSON(): FireAuthErrorJSON {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      type: this.type,
      status: this.status,
      cause: this.cause?.message,
      stack: this.stack,
    };
  }

  static fromJSON(json: FireAuthErrorJSON): FireAuthError {
    return new FireAuthError({
      message: json.message,
      code: json.code,
      type: json.type,
      status: json.status,
      cause: json.cause ? new Error(json.cause) : undefined,
    });
  }
}
