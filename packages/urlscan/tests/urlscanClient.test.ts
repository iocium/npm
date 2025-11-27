import { UrlscanClient } from '../src/urlscanClient';

describe('UrlscanClient', () => {
    const mockApiKey = 'test-api-key';
    let client: UrlscanClient;

    beforeEach(() => {
        client = new UrlscanClient(mockApiKey);
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('throw an error if API key is not provided', () => {
            expect(() => new UrlscanClient('')).toThrow('API key is required.');
        });
    });

    describe('scan', () => {
        it('should call fetch with correct parameters and return response', async () => {
            const mockResponse = { success: true };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockResponse),
            });

            const result = await client.scan('https://example.com');
            expect(global.fetch).toHaveBeenCalledWith('https://urlscan.io/api/v1/scan', expect.any(Object));
            expect(result).toEqual(mockResponse);
        });

        it('should handle fetch errors gracefully', async () => {
            const errorMessage = 'HTTP error! status: 500';
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await client.scan('https://example.com');
            expect(consoleSpy).toHaveBeenCalledWith('Error:', errorMessage);
            consoleSpy.mockRestore();
        });
    });

    describe('getScan', () => {
        it('should call fetch with correct parameters and return response', async () => {
            const mockResponse = { data: 'result' };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockResponse),
            });

            const result = await client.getScan('scan-id');
            expect(global.fetch).toHaveBeenCalledWith('https://urlscan.io/api/v1/result/scan-id', expect.any(Object));
            expect(result).toEqual(mockResponse);
        });

        it('should handle fetch errors gracefully', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });
            
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await client.getScan('scan-id');
            expect(consoleSpy).toHaveBeenCalledWith('Error:', 'HTTP error! status: 404');
            consoleSpy.mockRestore();
        });
    });

    describe('search', () => {
        it('throw an error if search term is not provided', async () => {
            await expect(client.search('')).rejects.toThrow('Search term is required.');
        });

        it('should call fetch with correct parameters and return response', async () => {
            const mockResponse = { results: [] };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockResponse),
            });

            const result = await client.search('example');
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('https://urlscan.io/api/v1/search?q=example'), expect.any(Object));
            expect(result).toEqual(mockResponse);
        });

        it('should handle fetch errors gracefully', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 403 });
            
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await client.search('example');
            expect(consoleSpy).toHaveBeenCalledWith('Error:', 'HTTP error! status: 403');
            consoleSpy.mockRestore();
        });
    });
});