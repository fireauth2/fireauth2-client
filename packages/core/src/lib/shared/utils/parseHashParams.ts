import { assertIsUrl } from '../assertions';

/**
 * Parses hash parameters from a given input.
 *
 * This function extracts key-value pairs found in the hash fragment of a URL,
 * i.e., the portion following the `#` character (e.g., `#access_token=...&id_token=...`).
 * It does not include query string parameters (e.g., `?foo=bar`) unless they are
 * part of the hash fragment itself.
 *
 * @param input - A URL string, `URL` object, or a `URLSearchParams` instance.
 *   - If a `URLSearchParams` is passed, it is returned as-is.
 *   - If a string beginning with `#` is passed, the part after `#` is parsed.
 *   - If a full URL string or `URL` object is passed, the `.hash` portion is extracted and parsed.
 *
 * @returns A `URLSearchParams` instance containing parsed hash parameters.
 *   Returns an empty `URLSearchParams` if no parameters are found.
 *
 * @throws FireAuth2Error if a string input is not a valid URL.
 */
export function parseHashParams(
  input: string | URL | URLSearchParams,
): URLSearchParams {
  if (input instanceof URLSearchParams) {
    return input;
  }

  if (typeof input === 'string' && input.startsWith('#')) {
    const hashString = input.slice(1); // remove leading #
    return new URLSearchParams(hashString);
  }

  assertIsUrl(input);
  const url = new URL(input);

  // The 'hash' includes the leading '#', so we strip it off before parsing.
  const hashString = url.hash.substring(1);

  return new URLSearchParams(hashString);
}
