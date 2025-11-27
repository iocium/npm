import { FaviconFetcher } from './fetcher';

const liveTest = process.env.LIVE_TEST === 'true';


(liveTest ? describe : describe.skip)('FaviconFetcher (live)', () => {
  it('fetches real favicon from google', async () => {
    const fetcher = new FaviconFetcher('bbc.co.uk');
    const result = await fetcher.fetchFavicon('google');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from duckduckgo', async () => {
    const fetcher = new FaviconFetcher('reddit.com');
    const result = await fetcher.fetchFavicon('duckduckgo');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from bitwarden', async () => {
    const fetcher = new FaviconFetcher('facebook.com');
    const result = await fetcher.fetchFavicon('bitwarden');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from yandex', async () => {
    const fetcher = new FaviconFetcher('cloudflare.com');
    const result = await fetcher.fetchFavicon('yandex');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from fastmail', async () => {
    const fetcher = new FaviconFetcher('joosup.com');
    const result = await fetcher.fetchFavicon('fastmail');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from iconHorse', async () => {
    const fetcher = new FaviconFetcher('github.com');
    const result = await fetcher.fetchFavicon('iconHorse');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from nextdns', async () => {
    const fetcher = new FaviconFetcher('temu.com');
    const result = await fetcher.fetchFavicon('nextdns');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from iocium', async () => {
    const fetcher = new FaviconFetcher('arstechnica.com');
    const result = await fetcher.fetchFavicon('iocium');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from favicon.is', async () => {
    const fetcher = new FaviconFetcher('discord.com');
    const result = await fetcher.fetchFavicon('faviconis');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from favicon.im', async () => {
    const fetcher = new FaviconFetcher('hey.com');
    const result = await fetcher.fetchFavicon('faviconim');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches real favicon from favicon.controld.com', async () => {
    const fetcher = new FaviconFetcher('news.ycombinator.com');
    const result = await fetcher.fetchFavicon('controld');

    expect(result.status).toBe(200);
    expect(result.contentType).toMatch(/image/);
    expect(result.content.byteLength).toBeGreaterThan(0);
  }, 10000);
  it('fetches a real BIMI logo from paypal.com using default DoH', async () => {
    const fetcher = new FaviconFetcher('paypal.com');
    const result = await fetcher.fetchFavicon('bimi');
  
    expect(result.url).toMatch(/^https:\/\/.*\.svg$/);
    expect(result.status).toBe(200);
    expect(result.contentType).toContain('image/svg+xml');
    expect(result.content.byteLength).toBeGreaterThan(0);
  });
  it('fetches a real BIMI logo using custom DoH resolver', async () => {
    const fetcher = new FaviconFetcher('paypal.com', {
      dohServerUrl: 'https://dns.google/dns-query'
    });
    const result = await fetcher.fetchFavicon('bimi');
  
    expect(result.url).toMatch(/^https:\/\/.*\.svg$/);
    expect(result.status).toBe(200);
    expect(result.contentType).toContain('image/svg+xml');
    expect(result.content.byteLength).toBeGreaterThan(0);
  });    
});
