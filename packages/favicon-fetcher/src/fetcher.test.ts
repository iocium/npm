import { FaviconFetcher, Service } from './fetcher';

describe('FaviconFetcher (mocked)', () => {
  /**
   * BEHAVIOUR
   */
  it('throws if hostname is missing', () => {
    expect(() => new FaviconFetcher('' as any)).toThrow('Hostname is required');
  });
  it('prepends CORS proxy URL when useCorsProxy is true', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve(new Response(new ArrayBuffer(10), {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
      }))
    );
    global.fetch = mockFetch as jest.Mock;
  
    const fetcher = new FaviconFetcher('github.com', {
      useCorsProxy: true
    });
  
    await fetcher.fetchFavicon('google');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/corsproxy\.io\/\?https:\/\/www\.google\.com/),
      expect.any(Object)
    );
  });
  it('prepends custom CORS proxy URL when useCorsProxy is a string', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve(new Response(new ArrayBuffer(10), {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
      }))
    );
    global.fetch = mockFetch as jest.Mock;
  
    const fetcher = new FaviconFetcher('duckduckgo.com', {
      useCorsProxy: 'https://my-cors-proxy/'
    });
  
    await fetcher.fetchFavicon('duckduckgo');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/my-cors-proxy\/https:\/\/icons\.duckduckgo\.com/),
      expect.any(Object)
    );
  });
  
  /**
   * SERVICE SUCCESS
   */
  it.each([
    'google',
    'duckduckgo',
    'bitwarden',
    'yandex',
    'fastmail',
    'iconHorse',
    'nextdns',
    'iocium',
    'faviconis',
    'faviconim',
    'controld'
  ])('fetchFavicon covers serviceUrls[%s]', async (service) => {
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(new ArrayBuffer(10), {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
      }))
    ) as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com');
    const result = await fetcher.fetchFavicon(service as Service);
  
    expect(result.status).toBe(200);
  });
  /**
   * REQUEST INTEGRITY
   */
  it('enforces iconHorseApiKey over headers.X-API-Key', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve(new Response(new ArrayBuffer(1), {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
      }))
    );
  
    global.fetch = mockFetch as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com', {
      iconHorseApiKey: 'REAL_KEY',
      headers: {
        'User-Agent': 'TestAgent',
        'X-API-Key': 'BAD_HEADER_SHOULD_BE_OVERRIDDEN'
      }
    });
  
    await fetcher.fetchFavicon('iconHorse');
  
    expect(mockFetch).toHaveBeenCalledWith(
      'https://icon.horse/icon/example.com',
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': 'TestAgent',
          'X-API-Key': 'REAL_KEY'  // this must override the user-provided one
        })
      })
    );
  });
  /**
   * SERVICE FAILURE
   */
  it('throws error if favicon fetch fails', async () => {
    global.fetch = jest.fn(() => {
      return Promise.resolve(new Response('Not Found', { status: 404, statusText: 'Not Found' }));
    }) as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('iconHorse')).rejects.toThrow('Failed to fetch favicon from iconHorse');
  });  
  /**
   * BIMI
   */
  it('successfully fetches BIMI logo using default DoH resolver', async () => {
    const dummySvg = '<svg></svg>';
    const dummyArrayBuffer = new TextEncoder().encode(dummySvg).buffer;
  
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=https://example.com/logo.svg;"' }
          ]
        }), { status: 200 }));
      } else if (typeof url === 'string' && url.includes('logo.svg')) {
        return Promise.resolve(new Response(dummyArrayBuffer, {
          status: 200,
          headers: { 'Content-Type': 'image/svg+xml' }
        }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com');
    const result = await fetcher.fetchFavicon('bimi');
  
    expect(result.url).toBe('https://example.com/logo.svg');
    expect(result.contentType).toBe('image/svg+xml');
    expect(result.status).toBe(200);
  });  
  it('successfully fetches BIMI logo using custom DoH resolver', async () => {
    const dummySvg = '<svg></svg>';
    const dummyArrayBuffer = new TextEncoder().encode(dummySvg).buffer;
  
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns.google')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=https://cdn.example.org/logo.svg;"' }
          ]
        }), { status: 200 }));
      } else if (typeof url === 'string' && url.includes('logo.svg')) {
        return Promise.resolve(new Response(dummyArrayBuffer, {
          status: 200,
          headers: { 'Content-Type': 'image/svg+xml' }
        }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com', {
      dohServerUrl: 'https://dns.google/dns-query'
    });
    const result = await fetcher.fetchFavicon('bimi');
  
    expect(result.url).toBe('https://cdn.example.org/logo.svg');
    expect(result.contentType).toBe('image/svg+xml');
    expect(result.status).toBe(200);
  });  
  it('throws error if no BIMI TXT record is found', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({ Answer: [] }), { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('No BIMI l= logo URL found in TXT record');
  });
  it('throws error if DNS response is malformed', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('No BIMI l= logo URL found in TXT record');
  });
  it('throws error if BIMI logo fetch fails', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=https://cdn.example.com/logo.svg;"' }
          ]
        }), { status: 200 }));
      }
      return Promise.resolve(new Response(null, { status: 404 }));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('Failed to fetch BIMI logo');
  });
  it('throws error if BIMI DNS query fails', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response('Server error', { status: 503, statusText: 'Service Unavailable' }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;
  
    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('BIMI DNS query failed');
  });
  it('throws error if BIMI logo URL is not HTTPS', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=http://example.com/logo.svg;"' }
          ]
        }), { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('BIMI logo URL must use HTTPS');
  });
  it('throws error if BIMI logo URL points to localhost', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=https://localhost/logo.svg;"' }
          ]
        }), { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('BIMI logo URL cannot point to private networks');
  });
  it('throws error if BIMI logo URL points to private IP ranges', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=https://192.168.1.1/logo.svg;"' }
          ]
        }), { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('BIMI logo URL cannot point to private networks');
  });
  it('throws error if BIMI logo URL contains suspicious characters', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=https://example.com/logo<script>.svg;"' }
          ]
        }), { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('BIMI logo URL contains invalid characters');
  });
  it('throws error if BIMI logo URL has invalid format', async () => {
    global.fetch = jest.fn((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('dns-query')) {
        return Promise.resolve(new Response(JSON.stringify({
          Answer: [
            { data: '"v=BIMI1; l=not-a-valid-url;"' }
          ]
        }), { status: 200 }));
      }
      return Promise.reject(new Error('Unexpected fetch'));
    }) as jest.Mock;

    const fetcher = new FaviconFetcher('example.com');
    await expect(fetcher.fetchFavicon('bimi')).rejects.toThrow('Invalid BIMI logo URL format');
  });
  
});
