import { version } from '../package.json';

const PACKAGE_NAME = '@iocium/throwaway-lookup';
const USER_AGENT = `${PACKAGE_NAME}/${version}`;
const BASE_URL = 'https://throwaway.cloud/api/v2/';

/**
 * Optional settings for the lookup request.
 */
export interface LookupOptions {
  /**
   * Custom headers to include in the request.
   * Note: `User-Agent` will always be overridden by the library.
   */
  headers?: Record<string, string>;
}

/**
 * Response returned from the throwaway.cloud API.
 */
export interface LookupResult {
  /** Indicates the request succeeded. */
  success: boolean;

  /** Whether the subject is considered disposable. */
  isDisposable?: boolean;

  /** Any additional fields returned by the API. */
  [key: string]: any;
}

/**
 * Looks up an email address or domain against the throwaway.cloud API.
 *
 * @param subject - The email address or domain to look up.
 * @param options - Optional request headers (excluding `User-Agent`).
 * @returns A promise resolving to the API response.
 * @throws If the subject is empty or the API returns a non-2xx response.
 */
export async function lookup(subject: string, options: LookupOptions = {}): Promise<LookupResult> {
  if (!subject) {
    throw new Error('Subject (email or domain) is required');
  }

  const headers = new Headers(options.headers || {});
  headers.set('User-Agent', USER_AGENT);

  const response = await fetch(`${BASE_URL}${encodeURIComponent(subject)}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
