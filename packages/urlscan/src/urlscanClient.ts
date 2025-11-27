/**
 * Types for the UrlscanClient
 */
/**
 * Represents the payload for a scan request.
 */
export interface ScanPayload {
    /**
     * The URL to be scanned.
     */
    url: string;

    /**
     * Optional visibility status for the scan.
     * Can be 'public', 'unlisted', or 'private'.
     */
    visibility?: 'public' | 'unlisted' | 'private';

    /**
     * Optional array of tags associated with the scan.
     */
    tags?: string[];

    /**
     * Optional custom user agent string to use for the scan.
     */
    customagent?: string;

    /**
     * Optional referer URL to include in the scan request.
     */
    referer?: string;

    /**
     * Optional safety override flag.
     * It can be a boolean or a string representation of a boolean ("true"/"false").
     */
    overrideSafety?: boolean | string;

    /**
     * Optional 2-letter ISO-3166-1 alpha-2 country code to specify the location for the scan.
     */
    country?: string;
}

/**
 * Represents the response returned after a scan is initiated.
 */
export interface ScanResultResponse {
    /**
     * A message indicating the status of the scan request.
     */
    message: string;

    /**
     * The unique identifier for the scan.
     */
    uuid: string;

    /**
     * The human readable report, viewable on urlscan.io
     */
    result: string;

    /**
     * The API readable report
     */
    api: string;

    /**
     * The visibility status of the scan.
     */
    visibility: string;

    /**
     * Options that were used for the scan.
     */
    options: ScanResultOptions;

    /**
     * The scanned URL.
     */
    url: string;

    /**
     * The 2-letter ISO-3166-1 alpha-2 country code used for the scan.
     */
    country: string;
}

/**
 * Represents the options used during a scan result.
 */
export interface ScanResultOptions {
    /**
     * The user agent string used for the scan.
     */
    useragent: string;
}

/**
 * Represents the optional parameters for search queries.
 */
export interface SearchOptions {
    /**
     * The number of results to return.
     */
    size: number;

    /**
     * A string indicating the point from which to continue the search.
     */
    search_after: string;
}

/**
 * Represents the response returned when retrieving scan results.
 */
export interface ResultResponse {
    /**
     * Task-related information, such as time, method, options, links to screenshot/DOM
     */
    task: object;

    /**
     * Page-related information, such as geolocation, IP, PTR
     */
    page: object;

    /**
     * Lists related to the scan, such as lists of domains, IPs, URLs, ASNs, servers, hashes
     */
    lists: object;

    /**
     * Information relating to all requests/responses, links, cookies, messages seen during the scan
     */
    data: object;

    /**
     * Metadata about the scan, such as ASN, GeoIP, AdBlock, Google Safe Browsing
     */
    meta: object;

    /**
     * Statistics related to the scan (by type, protocol, IP, etc.)
     */
    stats: object;

    /**
     * Verdicts related to the scan, this are only available to urlscan Pro members
     */
    verdicts: object;
}

/**
 * A client for interacting with the urlscan.io API.
 * This class provides methods to scan URLs, retrieve scan results, and search for previously scanned URLs.
 */
export class UrlscanClient {
    private apiKey: string;
    private baseURL: string;

    /**
     * Initializes a new instance of the UrlscanClient.
     * 
     * @param apiKey - The API key required for authentication with the urlscan.io API.
     * @throws Error if the API key is not provided or is an empty string.
     */
    constructor(apiKey: string) {
        if (!apiKey || apiKey == '') {
            throw new Error('API key is required.');
        }
        this.apiKey = apiKey;
        this.baseURL = 'https://urlscan.io/api/v1/';
    }

    /**
     * Scans a given URL and returns the scan information
     * 
     * @param url - The URL to be scanned.
     * @param {ScanPayload} options - Optional parameters for the scan request (excluding the URL).
     * @returns {Promise<ScanResultResponse>} A promise that resolves to the scan result response or void if an error occurs.
     * 
     * @see ScanPayload
     * @see ScanResultResponse
     */
    async scan(url: string, options?: Omit<ScanPayload, 'url'>): Promise<ScanResultResponse | void> {
        try {
            const payload: ScanPayload = {
                url,
                ...options
            };
            const response = await fetch(`${this.baseURL}scan`, {
                method: 'POST',
                headers: {
                    'API-Key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Retrieves the results of a scan by its ID.
     * 
     * @param id - The unique identifier of the scan.
     * @returns {Promise<ResultResponse>} A promise that resolves to the result response or void if an error occurs.
     */
    async getScan(id: string): Promise<ResultResponse | void> {
        try {
            const response = await fetch(`${this.baseURL}result/${id}`, {
                method: 'GET',
                headers: {
                    'API-Key': this.apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Searches for scans using a specified term.
     * 
     * @param term - The search term to look for in previous scans.
     * @param {SearchOptions} options - Optional parameters for the search query.
     * @returns A promise that resolves to the search results or void if an error occurs.
     * @throws Error if the search term is not provided.
     */
    async search(term: string, options?: SearchOptions): Promise<any | void> {
        if (!term) {
            throw new Error('Search term is required.');
        }

        try {
            const queryParams = new URLSearchParams({ q: term });

            // Append optional fields to query params if they exist
            if (options) {
                Object.entries(options).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, value);
                    }
                });
            }

            const response = await fetch(`${this.baseURL}search?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'API-Key': this.apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Handles errors by logging them to the console.
     * 
     * @param error - The error object to handle.
     */
    private handleError(error: any) {
        console.error('Error:', error.message || error);
    }
}