import { FireAuth2ErrorCode } from "./FireAuth2ErrorCodes";
import { FireAuth2ErrorType } from "./FireAuth2ErrorTypes";


export interface FireAuth2ErrorJSON {
  name: string;
  message: string;
  code: FireAuth2ErrorCode;
  type: FireAuth2ErrorType;
  status?: number;
  cause?: string;
  stack?: string;
}

export class FireAuth2Error extends Error {
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
    this.name = 'FireAuth2Error';
    this.code = options.code ?? 'unknown';
    this.type = options.type;
    this.status = options.status;
    this.cause = options.cause;

    // Optional: Capture stack trace if supported (Node.js)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (Error as any).captureStackTrace === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Error as any).captureStackTrace(this, FireAuth2Error);
    }
  }

  toJSON(): FireAuth2ErrorJSON {
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

  static fromJSON(json: FireAuth2ErrorJSON): FireAuth2Error {
    return new FireAuth2Error({
      message: json.message,
      code: json.code,
      type: json.type,
      status: json.status,
      cause: json.cause ? new Error(json.cause) : undefined,
    });
  }
}

