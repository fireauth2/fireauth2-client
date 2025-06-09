import { isTokenExpired, isTokenExpiringSoon } from './isTokenExpired';

describe('isTokenExpired', () => {
  const now = Math.floor(Date.now() / 1000);

  it('should return false if token is valid', () => {
    expect(isTokenExpired(now, 60)).toBe(false);
  });

  it('should return true if token is expired', () => {
    expect(isTokenExpired(now - 3600, 3000)).toBe(true); // issued 1h ago, expired after 50min
  });

  it('should return true if token just expired', () => {
    expect(isTokenExpired(now - 60, 60)).toBe(true);
  });

  it('should return false if token expires in the future', () => {
    expect(isTokenExpired(now - 30, 60)).toBe(false);
  });
});

describe('isTokenExpiringSoon', () => {
  const now = Math.floor(Date.now() / 1000);

  it('should return false if token is valid and not expiring soon', () => {
    expect(isTokenExpiringSoon(now - 10, 300, 1)).toBe(false);
  });

  it('should return true if token is expiring within buffer', () => {
    expect(isTokenExpiringSoon(now - 3540, 3600, 2)).toBe(true);
  });

  it('should return true if token is already expired', () => {
    expect(isTokenExpiringSoon(now - 1000, 500, 5)).toBe(true);
  });

  it('should return true if token expires exactly within the buffer window', () => {
    const bufferMinutes = 5;
    const issuedAt = now - 3000;
    const expiresIn = bufferMinutes * 60 + 10;
    expect(isTokenExpiringSoon(issuedAt, expiresIn, bufferMinutes)).toBe(true);
  });
});
