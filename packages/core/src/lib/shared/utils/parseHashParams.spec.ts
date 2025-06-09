// Mock external dependencies first
// We are mocking `assertIsUrl` as it's an external dependency of `parseHashParams`.
// This mock will simulate its behavior (throwing for invalid URLs).

jest.mock('../assertions', () => ({
  assertIsUrl: jest.fn((input: string | URL) => {
    try {
      // Attempt to construct a URL. If it fails, the input is considered invalid.
      new URL(input);
    } catch {
      // In a real scenario, `assertIsUrl` would throw a specific error type.
      // For testing, we'll throw a generic error to indicate failure.
      throw new Error(`Assertion Failed: Invalid URL input: "${input}"`);
    }
  }),
}));

const { assertIsUrl: mockAssertIsUrl } = require('../assertions');

// Import the function to be tested *after* setting up mocks.
import { parseHashParams } from './parseHashParams';

describe('parseHashParams', () => {
  beforeEach(() => {
    // Clear mock calls before each test to ensure test isolation.
    mockAssertIsUrl.mockClear();
  });

  // Full URL string with typical hash parameters
  test('should parse hash parameters from a full URL string', () => {
    const url = 'http://example.com/path?query=abc#token=xyz123&user=jane.doe';
    const expected = new URLSearchParams('token=xyz123&user=jane.doe');
    expect(parseHashParams(url)).toEqual(expected);
    expect(mockAssertIsUrl).toHaveBeenCalledTimes(1);
    expect(mockAssertIsUrl).toHaveBeenCalledWith(url);
  });

  // URL object with hash parameters
  test('should parse hash parameters from a URL object', () => {
    const urlObj = new URL(
      'https://api.service.com/auth#session=sessionID&expires=3600',
    );
    const expected = new URLSearchParams('session=sessionID&expires=3600');
    expect(parseHashParams(urlObj)).toEqual(expected);
    expect(mockAssertIsUrl).toHaveBeenCalledTimes(1);
    expect(mockAssertIsUrl).toHaveBeenCalledWith(urlObj);
  });

  // URL with no hash fragment
  test('should return an empty URLSearchParams for a URL with no hash', () => {
    const url = 'http://example.com/page?param=value';
    const expected = new URLSearchParams();
    expect(parseHashParams(url)).toEqual(expected);
    expect(mockAssertIsUrl).toHaveBeenCalledTimes(1);
    expect(mockAssertIsUrl).toHaveBeenCalledWith(url);
  });

  // URL with only a hash symbol (empty fragment)
  test('should return an empty URLSearchParams for a URL with an empty hash fragment (#)', () => {
    const url = 'http://example.com/page#';
    const expected = new URLSearchParams();
    expect(parseHashParams(url)).toEqual(expected);
    expect(mockAssertIsUrl).toHaveBeenCalledTimes(1);
    expect(mockAssertIsUrl).toHaveBeenCalledWith(url);
  });

  // Hash parameters with URL-encoded characters
  test('should correctly decode URL-encoded characters in hash parameters', () => {
    const url =
      'http://example.com/#name=John%20Doe&id=123%2FXYZ&data=%21%40%23%24';
    const expected = new URLSearchParams('name=John Doe&id=123/XYZ&data=!@#$');
    expect(parseHashParams(url)).toEqual(expected);
  });

  // Hash parameters with duplicate keys (URLSearchParams handles this by retaining the first for .get())
  test('should handle duplicate keys correctly, where .get() returns the first value', () => {
    const url = 'http://example.com/#param=value1&param=value2&status=ok';
    const result = parseHashParams(url);
    expect(result.get('param')).toBe('value1'); // URLSearchParams.get() returns the first
    expect(result.getAll('param')).toEqual(['value1', 'value2']); // .getAll() returns all
    expect(result.get('status')).toBe('ok');
    expect(result.toString()).toBe('param=value1&param=value2&status=ok'); // toString keeps both
  });

  // Hash parameters with empty values
  test('should handle parameters with empty values correctly', () => {
    const url = 'http://example.com/#key1=&key2=value&key3=';
    const expected = new URLSearchParams('key1=&key2=value&key3=');
    expect(parseHashParams(url)).toEqual(expected);
  });

  // Hash parameters with keys but no explicit values (flags)
  test('should handle parameters with no explicit values (flags)', () => {
    const url = 'http://example.com/#flag1&param=value&flag2';
    // URLSearchParams interprets "key" as "key="
    const expected = new URLSearchParams('flag1=&param=value&flag2=');
    expect(parseHashParams(url)).toEqual(expected);
  });

  // URL with query parameters *and* hash parameters
  test('should correctly parse only hash parameters, ignoring query parameters', () => {
    const url =
      'http://example.com/dashboard?q=search&limit=10#view=summary&filter=active';
    const expected = new URLSearchParams('view=summary&filter=active');
    expect(parseHashParams(url)).toEqual(expected);
  });

  // Invalid URL string input (should cause assertIsUrl to throw)
  test('should throw an error for an invalid URL string input', () => {
    const invalidUrl = 'not a valid url string';
    expect(() => parseHashParams(invalidUrl)).toThrowError(
      `Assertion Failed: Invalid URL input: "${invalidUrl}"`,
    );
    expect(mockAssertIsUrl).toHaveBeenCalledTimes(1);
    expect(mockAssertIsUrl).toHaveBeenCalledWith(invalidUrl);
  });

  // Empty string input (should cause assertIsUrl to throw)
  test('should throw an error for an empty string input', () => {
    const emptyUrl = '';
    expect(() => parseHashParams(emptyUrl)).toThrowError(
      `Assertion Failed: Invalid URL input: "${emptyUrl}"`,
    );
    expect(mockAssertIsUrl).toHaveBeenCalledTimes(1);
    expect(mockAssertIsUrl).toHaveBeenCalledWith(emptyUrl);
  });

  // URL hash containing a question mark, but it's part of the value
  test('should treat "?" within the hash as part of the value, not a query separator', () => {
    const url =
      'http://example.com/#next=https://another.com/redirect?param=value';
    const expected = new URLSearchParams(
      'next=https://another.com/redirect?param=value',
    );
    expect(parseHashParams(url)).toEqual(expected);
  });
});
