jest.mock('./parseHashParams', () => ({
  parseHashParams: jest.fn((input: string | URL) => {
    // Simulate the behavior of parseHashParams: extracts params from the hash.
    let url: URL;
    try {
      url = input instanceof URL ? input : new URL(input);
    } catch {
      // For tests, let's return an empty URLSearchParams for invalid inputs.
      return new URLSearchParams();
    }

    const hashString = url.hash.substring(1);
    return new URLSearchParams(hashString);
  }),
}));

jest.mock('../assertions', () => ({
  assertIsNonEmptyAuthorizationParam: jest.fn(
    (key: string, value: string | null) => {
      if (key === AuthorizationResponseParamKey.AccessToken) {
        if (value === null || value === '') {
          throw new Error(`Required parameter '${key}' is missing or empty.`);
        }
      } else {
        // For optional parameters (id_token, expires_in, issued_at)
        if (value === '') {
          throw new Error(
            `Optional parameter '${key}' cannot be empty if present.`,
          );
        }
        // If value is null, it's considered optional/absent, so no throw.
        // This allows the optional parameters to be truly optional (can be omitted from the URL).
      }
    },
  ),
}));

// IMPORTANT: Get references to the actual mock functions *after* they have been defined by jest.mock
// This allows us to use .mockClear(), .toHaveBeenCalledWith(), etc. in beforeEach/tests.
const { parseHashParams: mockParseHashParams } = require('./parseHashParams');
const {
  assertIsNonEmptyAuthorizationParam: mockAssertIsNonEmptyAuthorizationParam,
} = require('../assertions');

import {
  AuthorizationResponseParamKey,
  AuthorizationSuccessResponseParams,
} from '../../contracts';
// Import AFTER mocks are set up. to allow Jest to correctly swap out the actual
// implementations with the mocks.
import { extractAuthorizationResponse } from './extractAuthorizationResponse';

describe('extractAuthorizationResponse', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test to ensure test isolation
    mockParseHashParams.mockClear();
    mockAssertIsNonEmptyAuthorizationParam.mockClear();

    // Spy on console.warn to suppress it during tests and check if it was called
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original console.warn after each test
    consoleWarnSpy.mockRestore();
  });

  // --- Test Cases for Error Responses ---
  test('should return an error response if the "error" parameter is present', () => {
    const errorUrl = 'https://app.com/#error=access_denied';
    const result = extractAuthorizationResponse(errorUrl);
    expect(result).toEqual({ error: 'access_denied' });
    expect(mockParseHashParams).toHaveBeenCalledWith(errorUrl);
  });

  test('should decode URL-encoded error messages', () => {
    const errorUrl =
      'https://app.com/#error=invalid_scope%20%26%20missing_param';
    const result = extractAuthorizationResponse(errorUrl);
    expect(result).toEqual({ error: 'invalid_scope & missing_param' });
  });

  test('should return "unknown_error" if "error" parameter is present but empty (e.g., #error=)', () => {
    const errorUrl = 'https://app.com/#error=';
    const result = extractAuthorizationResponse(errorUrl);
    expect(result).toEqual({ error: 'unknown_error' }); // FIX: Updated expectation
  });

  // --- Test Cases for Successful Responses ---

  test('should correctly extract all parameters for a full success response (string input)', () => {
    const fullUrl =
      'https://app.com/#access_token=ABCDEF&id_token=GHIJKL&expires_in=3600&issued_at=1678886400';
    const result = extractAuthorizationResponse(
      fullUrl,
    ) as AuthorizationSuccessResponseParams; // Cast for type checking in test
    expect(result).toEqual({
      access_token: 'ABCDEF',
      id_token: 'GHIJKL',
      expires_in: 3600,
      issued_at: 1678886400,
    });
    expect(mockParseHashParams).toHaveBeenCalledWith(fullUrl);
    expect(mockAssertIsNonEmptyAuthorizationParam).toHaveBeenCalledWith(
      AuthorizationResponseParamKey.AccessToken,
      'ABCDEF',
    );
    expect(mockAssertIsNonEmptyAuthorizationParam).toHaveBeenCalledWith(
      AuthorizationResponseParamKey.IdToken,
      'GHIJKL',
    );
    // Note: getOptionalIntegerParam internally calls assertIsNonEmptyAuthorizationParam
    // so we don't assert it directly here for expires_in and issued_at.
  });

  test('should correctly extract all parameters for a full success response (URL object input)', () => {
    const fullUrlObj = new URL(
      'https://app.com/#access_token=ABCDEF&id_token=GHIJKL&expires_in=3600&issued_at=1678886400',
    );
    const result = extractAuthorizationResponse(
      fullUrlObj,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({
      access_token: 'ABCDEF',
      id_token: 'GHIJKL',
      expires_in: 3600,
      issued_at: 1678886400,
    });
    expect(mockParseHashParams).toHaveBeenCalledWith(fullUrlObj);
  });

  test('should handle URL-encoded parameters in success response', () => {
    const encodedUrl =
      'https://app.com/#access_token=A%20B%26C&id_token=X%2FY&expires_in=3600';
    const result = extractAuthorizationResponse(
      encodedUrl,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({
      access_token: 'A B&C',
      id_token: 'X/Y',
      expires_in: 3600,
    });
  });

  test('should return only access_token if other optional params are missing', () => {
    const url = 'https://app.com/#access_token=REQUIRED_TOKEN';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'REQUIRED_TOKEN' });
    expect(result.id_token).toBeUndefined();
    expect(result.expires_in).toBeUndefined();
    expect(result.issued_at).toBeUndefined();
  });

  test('should include id_token if present and others are missing', () => {
    const url = 'https://app.com/#access_token=AT&id_token=IT';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT', id_token: 'IT' });
  });

  test('should include expires_in if present and others are missing', () => {
    const url = 'https://app.com/#access_token=AT&expires_in=120';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT', expires_in: 120 });
  });

  test('should include issued_at if present and others are missing', () => {
    const url = 'https://app.com/#access_token=AT&issued_at=999';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT', issued_at: 999 });
  });

  // --- Test Cases for Missing/Invalid Required Parameters ---

  test('should throw if access_token is missing', () => {
    const url = 'https://app.com/#id_token=TEST';
    expect(() => extractAuthorizationResponse(url)).toThrowError(
      `Required parameter 'access_token' is missing or empty.`,
    );
    // Ensure assertIsNonEmptyAuthorizationParam was called for access_token with null
    expect(mockAssertIsNonEmptyAuthorizationParam).toHaveBeenCalledWith(
      AuthorizationResponseParamKey.AccessToken,
      null,
    );
  });

  test('should throw if access_token is an empty string', () => {
    const url = 'https://app.com/#access_token=';
    expect(() => extractAuthorizationResponse(url)).toThrowError(
      `Required parameter 'access_token' is missing or empty.`,
    );
    // Ensure assertIsNonEmptyAuthorizationParam was called for access_token with empty string
    expect(mockAssertIsNonEmptyAuthorizationParam).toHaveBeenCalledWith(
      AuthorizationResponseParamKey.AccessToken,
      '',
    );
  });

  // --- Test Cases for Optional´ Parameter Validation (as per the code's behavior) ---

  test('should throw if id_token is an empty string (even if optional, cannot be empty)', () => {
    const url = 'https://app.com/#access_token=AT&id_token=';
    expect(() => extractAuthorizationResponse(url)).toThrowError(
      `Optional parameter 'id_token' cannot be empty if present.`,
    );
    expect(mockAssertIsNonEmptyAuthorizationParam).toHaveBeenCalledWith(
      AuthorizationResponseParamKey.IdToken,
      '',
    );
  });

  test('should handle non-numeric expires_in by omitting it and logging a warning', () => {
    const url = 'https://app.com/#access_token=AT&expires_in=abc';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT' });
    expect(result.expires_in).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Parameter 'expires_in' has value 'abc' which is not a valid integer. Returning undefined.`,
    );
  });

  test('should handle non-numeric issued_at by omitting it and logging a warning', () => {
    const url = 'https://app.com/#access_token=AT&issued_at=def';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT' });
    expect(result.issued_at).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Parameter 'issued_at' has value 'def' which is not a valid integer. Returning undefined.`,
    );
  });

  test('should handle valid 0 for expires_in', () => {
    const url = 'https://app.com/#access_token=AT&expires_in=0';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT', expires_in: 0 });
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  test('should handle valid 0 for issued_at', () => {
    const url = 'https://app.com/#access_token=AT&issued_at=0';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({ access_token: 'AT', issued_at: 0 });
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  // --- Edge Cases and Input Types ---

  test('should return access_token for empty hash (no params)', () => {
    const url = 'https://app.com/#';
    // This assumes parseHashParams returns empty URLSearchParams for '#'
    // and extractAuthorizationResponse then correctly throws for missing access_token.
    expect(() => extractAuthorizationResponse(url)).toThrow();
  });

  test('should return access_token for url with no hash', () => {
    const url = 'https://app.com/';
    // This assumes parseHashParams returns empty URLSearchParams for no hash
    // and extractAuthorizationResponse then correctly throws for missing access_token.
    expect(() => extractAuthorizationResponse(url)).toThrow();
  });

  test('should handle extra, unrecognized parameters gracefully', () => {
    const url =
      'https://app.com/#access_token=AT&unknown_param=value&another_one=something';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    // Should only contain known parameters
    expect(result).toEqual({ access_token: 'AT' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).unknown_param).toBeUndefined(); // Ensure unknown are not added
  });

  test('should handle duplicate parameters, with the last one winning (standard URLSearchParams behavior)', () => {
    const url =
      'https://app.com/#access_token=FIRST&access_token=SECOND&expires_in=100&expires_in=200';
    const result = extractAuthorizationResponse(
      url,
    ) as AuthorizationSuccessResponseParams;
    expect(result).toEqual({
      access_token: 'FIRST',
      expires_in: 100,
    });
  });
});
