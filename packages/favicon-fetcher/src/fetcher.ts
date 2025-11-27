export type Service = 'google' | 'duckduckgo' | 'bitwarden' | 'yandex' | 'fastmail' | 'nextdns' | 'iconHorse' | 'bimi' | 'iocium' | 'faviconis' | 'faviconim' | 'controld';

/**
 * Result returned by fetchFavicon including content and metadata.
 */
export interface FaviconResult {
  /** Source URL used to fetch the favicon/logo */
  url: string;
  /** Content-Type of the returned image */
  contentType: string | null;
  /** Raw image data as an ArrayBuffer */
  content: ArrayBuffer;
  /** HTTP response status */
  status: number;
}

/**
 * FaviconFetcher allows downloading favicons or BIMI logos from a hostname using known services.
 */
export class FaviconFetcher {
  /**
   * @param hostname The domain name to fetch the favicon/logo for.
   * @param options Optional configuration including headers, iconHorse API key, and BIMI DNS settings.
   */
  constructor(
    private hostname: string,
    private options?: {
      /** API key for icon.horse Pro access (used only when service is 'iconHorse') */
      iconHorseApiKey?: string;
      /** Optional DNS-over-HTTPS server URL for BIMI lookups (defaults to Cloudflare) */
      dohServerUrl?: string;
      /** Optional custom headers to send with fetch (except protected headers like X-API-Key) */
      headers?: Record<string, string>;
      /** Optional enable or provide a CORS proxy prefix for browser fetch compatibility */
      useCorsProxy?: boolean | string;
    }
  ) {
    if (!hostname) throw new Error('Hostname is required');
  }

  private validateBimiUrl(url: string): void {
    let parsedUrl: URL;
    
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      throw new Error('Invalid BIMI logo URL format');
    }
    
    // Must use HTTPS
    if (parsedUrl.protocol !== 'https:') {
      throw new Error('BIMI logo URL must use HTTPS');
    }
    
    // Must not be localhost or private IP ranges
    const hostname = parsedUrl.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
      throw new Error('BIMI logo URL cannot point to private networks');
    }
    
    // Must not contain suspicious characters
    if (url.includes('<') || url.includes('>') || url.includes('"') || url.includes("'")) {
      throw new Error('BIMI logo URL contains invalid characters');
    }
  }

  private static serviceUrls: Record<Exclude<Service, 'bimi'>, (hostname: string) => string> = {
    google: (hostname) => `https://www.google.com/s2/favicons?domain=${hostname}`,
    duckduckgo: (hostname) => `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
    bitwarden: (hostname) => `https://icons.bitwarden.net/${hostname}/icon.png`,
    yandex: (hostname) => `https://favicon.yandex.net/favicon/${hostname}`,
    fastmail: (hostname) => `https://www.fastmailcdn.com/avatar/${hostname}`,
    iconHorse: (hostname) => `https://icon.horse/icon/${hostname}`,
    nextdns: (hostname) => `https://favicons.nextdns.io/${hostname}@2x.png`,
    iocium: (hostname) => `https://icons.iocium.net/icon/${hostname}`,
    faviconis: (hostname) => `https://favicon.is/${hostname}`,
    faviconim: (hostname) => `https://favicon.im/${hostname}`,
    controld: (hostname) => `https://favicon.controld.com/${hostname}`
  };

  /**
   * Fetches the favicon or BIMI logo for the configured hostname using the specified service.
   *
   * @param service The provider to use (default is 'google').
   * @returns A FaviconResult containing the image, status, and metadata.
   * @throws If the fetch fails or BIMI DNS record is missing/invalid.
   */
  public async fetchFavicon(
    service: Service = "google"
  ): Promise<FaviconResult> {
    if (service === "bimi") {
      const dohUrl = this.options?.dohServerUrl || 'https://cloudflare-dns.com/dns-query';
      const bimiDomain = `default._bimi.${this.hostname}`;
      const dnsUrl = `${dohUrl}?name=${bimiDomain}&type=TXT`;

      const dnsResp = await fetch(dnsUrl, {
        headers: {
          Accept: "application/dns-json",
        },
      });

      if (!dnsResp.ok) {
        throw new Error(`BIMI DNS query failed: ${dnsResp.statusText}`);
      }

      const dnsData = await dnsResp.json();
      const txtRecords: string[] = dnsData?.Answer?.map((a: any) => a.data.replace(/^"|"$/g, '')) || [];

      const lRecord = txtRecords.find(txt => txt.includes('l='));
      const logoUrlMatch = lRecord?.match(/l=([^;]+)/);

      if (!logoUrlMatch) {
        throw new Error('No BIMI l= logo URL found in TXT record');
      }

      const logoUrl = logoUrlMatch[1];
      
      // Validate BIMI logo URL for security
      this.validateBimiUrl(logoUrl);
      
      const response = await fetch(logoUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch BIMI logo: ${response.statusText}`);
      }

      const content = await response.arrayBuffer();

      return {
        url: logoUrl,
        contentType: response.headers.get('content-type'),
        content,
        status: response.status
      };
    }

    const urlFn = FaviconFetcher.serviceUrls[service];
    const url = urlFn(this.hostname);
    const corsProxy = this.options?.useCorsProxy === true
    ? 'https://corsproxy.io/?'
    : typeof this.options?.useCorsProxy === 'string'
      ? this.options.useCorsProxy
      : '';
    const fetchUrl = corsProxy + url;

    const headers: Record<string, string> = {
      ...(this.options?.headers || {})
    };
    // Enforce icon.horse API key protection
    if (service === "iconHorse" && this.options?.iconHorseApiKey) {
      headers["X-API-Key"] = this.options.iconHorseApiKey;
    }

    const response = await fetch(fetchUrl, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch favicon from ${service}: ${response.statusText}`);
    }

    const content = await response.arrayBuffer();

    return {
      url,
      contentType: response.headers.get('content-type'),
      content,
      status: response.status
    };
  }
}