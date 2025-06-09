/**
 * Checks if a token is expired.
 *
 * @param issuedAt - Unix timestamp in seconds when the token was issued.
 * @param expiresIn - Token lifetime in seconds.
 * @returns True if the token is expired.
 */
export function isTokenExpired(issuedAt: number, expiresIn: number): boolean {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  return now >= issuedAt + expiresIn;
}

/**
 * Checks if a token is already expired or will expire within the next `minutes` minutes.
 *
 * @param issuedAt - Unix timestamp in seconds when the token was issued.
 * @param expiresIn - Token lifetime in seconds.
 * @param minutes - Number of minutes before expiry to consider the token "expiring soon".
 * @returns True if the token is expired or about to expire.
 */
export function isTokenExpiringSoon(
  issuedAt: number,
  expiresIn: number,
  minutes: number,
): boolean {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const buffer = minutes * 60; // Convert minutes to seconds
  return now >= issuedAt + expiresIn - buffer;
}
