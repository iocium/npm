import { UrlscanClient } from '../src/urlscanClient';

const liveTest = process.env.LIVE_TEST === 'true';

(liveTest ? describe : describe.skip)('urlscan (live)', () => {
    let client: UrlscanClient;

    beforeAll(() => {
        const apiKey = process.env.URLSCAN_KEY || '';
        client = new UrlscanClient(apiKey);
    });

    test('should fetch result by ID', async () => {
        const result = await client.getScan('0196c9c1-69ed-7481-bec1-5b368186d037');
        expect(result).toHaveProperty('data');
    });

    test('should search using domain:urlscan.io', async () => {
        const result = await client.search('domain:urlscan.io');
        expect(result).toHaveProperty('results');
    });
});