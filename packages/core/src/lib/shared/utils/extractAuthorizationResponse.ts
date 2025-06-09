import {
  AuthorizationResponseParamKey,
  AuthorizationResponseParams,
  AuthorizationSuccessResponseParams,
} from '../../contracts';
import { parseHashParams } from '../../shared/utils/parseHashParams';
import { assertIsNonEmptyAuthorizationParam } from '../assertions';

/**
 * Parses and validates an integer parameter from a URLSearchParams object.
 * This helper returns `undefined` if the parameter is not found or cannot be
 * parsed as a valid integer.
 *
 * @param params The URLSearchParams instance.
 * @param key The key of the parameter to parse.
 * @returns The parsed integer value, or `undefined` if not found or not a valid number.
 * @throws {Error} If `assertIsNonEmptyAuthorizationParam` throws an error due to an invalid string value.
 */
function getOptionalIntegerParam(
  params: URLSearchParams,
  key: AuthorizationResponseParamKey,
): number | undefined {
  const value = params.get(key);

  assertIsNonEmptyAuthorizationParam(key, value);

  if (value === null) {
    return undefined;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    console.warn(
      `Parameter '${key}' has value '${value}' which is not a valid integer. Returning undefined.`,
    );
    return undefined;
  }

  return parsed;
}

/**
 * Extracts {@link AuthorizationResponseParams} from a URL fragment or URLSearchParams object.
 * This function is designed to process an OAuth 2.0 Authorization Response, handling
 * both successful token responses and error responses.
 *
 * It normalizes various input types (URL string, URL object, or pre-parsed URLSearchParams)
 * into a `URLSearchParams` object for consistent parameter retrieval and validation.
 *
 * @param input The URL string, URL object, or URLSearchParams containing the authorization response parameters.
 * @returns An {@link AuthorizationResponseParams} object representing the parsed response.
 * For successful responses, it includes `access_token` (required) and optional
 * `id_token`, `expires_in`, `issued_at`.
 * For error responses, it returns an object with the `error` property.
 * @throws {Error} If a required parameter (like `access_token` for success) is missing or invalid,
 * or if `assertIsNonEmptyAuthorizationParam` throw an error during validation.
 */
export const extractAuthorizationResponse = (
  input: string | URL | URLSearchParams,
): AuthorizationResponseParams | null => {
  const params = parseHashParams(input);

  if (params.size === 0) {
    return null;
  }

  // If the 'error' parameter is present, it signifies an authorization error.
  if (params.has(AuthorizationResponseParamKey.Error)) {
    const error = params.get(AuthorizationResponseParamKey.Error);
    if (error !== null && error !== '') {
      return { error: decodeURIComponent(error) };
    }
    // If 'error' param is present but its value is null (e.g., #error=),
    // return a generic unknown error.
    return { error: 'unknown_error' };
  }

  const response: Partial<AuthorizationSuccessResponseParams> = {};
  const accessToken = params.get(AuthorizationResponseParamKey.AccessToken);
  assertIsNonEmptyAuthorizationParam(
    AuthorizationResponseParamKey.AccessToken,
    accessToken,
  );
  response.access_token = accessToken;

  const idToken = params.get(AuthorizationResponseParamKey.IdToken);
  // `assertIsNonEmptyAuthorizationParam` throws if `idToken` is NOT a non-empty string.
  assertIsNonEmptyAuthorizationParam(
    AuthorizationResponseParamKey.IdToken,
    idToken,
  );
  if (idToken !== null) {
    response.id_token = idToken;
  }

  const expiresIn = getOptionalIntegerParam(
    params,
    AuthorizationResponseParamKey.ExpiresIn,
  );
  if (expiresIn !== undefined) {
    response.expires_in = expiresIn;
  }

  const issuedAt = getOptionalIntegerParam(
    params,
    AuthorizationResponseParamKey.IssuedAt,
  );
  if (issuedAt !== undefined) {
    response.issued_at = issuedAt;
  }

  return response as never as AuthorizationSuccessResponseParams;
};
