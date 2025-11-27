import { lookup } from '../src/index';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe('lookup()', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('throws if no subject is provided', async () => {
    await expect(lookup('')).rejects.toThrow('Subject (email or domain) is required');
  });

  it('returns a successful result for a valid domain', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, isDisposable: false }),
    });

    const result = await lookup('example.com');
    expect(result.success).toBe(true);
    expect(result.isDisposable).toBe(false);
  });

  it('returns a disposable result for a known throwaway domain', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, isDisposable: true }),
    });

    const result = await lookup('mailinator.com');
    expect(result.success).toBe(true);
    expect(result.isDisposable).toBe(true);
  });

  it('throws an error on HTTP 400 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });

    await expect(lookup('invalid@@domain')).rejects.toThrow('API error: 400 Bad Request');
  });

  it('throws an error on HTTP 500 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(lookup('example.com')).rejects.toThrow('API error: 500 Internal Server Error');
  });

  it('throws on fetch/network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'));

    await expect(lookup('example.com')).rejects.toThrow('Network down');
  });

  it('sets the correct User-Agent header and preserves other headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await lookup('example.com', {
      headers: {
        'X-Test': '1234',
        'User-Agent': 'fake-agent',
      },
    });

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.get('User-Agent')).toMatch(/^@iocium\/throwaway-lookup\/\d+\.\d+\.\d+$/);
    expect(headers.get('X-Test')).toBe('1234');
  });
});
