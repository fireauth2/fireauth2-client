import { isAuthorizationSuccessResponse } from './isAuthorizationResponse';

describe('isAuthorizationSuccessResponse', () => {
  it('should return false for invalid token shape', () => {
    expect(isAuthorizationSuccessResponse({ invalid: true })).toBe(false);
    expect(isAuthorizationSuccessResponse(null)).toBe(false);
    expect(isAuthorizationSuccessResponse({})).toBe(false);
  });

  it('should return true for valid token shape', () => {
    expect(
      isAuthorizationSuccessResponse({
        access_token: 'abc',
        id_token: 'def',
        expires_in: 3600,
        issued_at: 1234567890,
      }),
    ).toBe(true);
  });
});
