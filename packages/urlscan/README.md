# @iocium/urlscan

A simple client for interacting with the [urlscan.io API](https://urlscan.io/docs/api/). This library provides easy-to-use methods to scan URLs, retrieve scan results, and search for previously scanned URLs.

## Install

To install the `@iocium/urlscan` package, use npm:

```bash
npm install @iocium/urlscan
```

## Usage

To get started, you need to initialize the `UrlscanClient` with your API key:

```typescript
import { UrlscanClient } from '@iocium/urlscan';

const client = new UrlscanClient('YOUR_API_KEY');
```

### Scanning a URL

You can scan a URL by calling the `scan` method. Optionally, you can provide additional options.

```typescript
const response = await client.scan('https://example.com', {
    // Optional parameters can be included here
});
console.log(response);
```

### Retrieving Scan Results

To retrieve the results of a scan, use the `getScan` method with the scan ID.

```typescript
const result = await client.getScan('SCAN_ID');
console.log(result);
```

### Searching Scans

You can search for scans using specific terms. The `search` method allows you to pass optional search parameters.

```typescript
const searchResults = await client.search('example query', {
    // Optional search parameters can be included here
});
console.log(searchResults);
```

## Error Handling

The `UrlscanClient` handles errors gracefully. If an error occurs during a fetch operation, it will log the error message to the console. Additionally, certain methods throw errors when required parameters are not provided. Ensure to handle these appropriately in your application.

Example of handling errors:

```typescript
try {
    const result = await client.scan('https://example.com');
} catch (error) {
    console.error('An error occurred:', error.message);
}
```
## Testing

```bash
npm test         # Runs mocked tests
npm run test:live  # Runs real network integration tests (LIVE_TEST=true). This needs an urlscan.io API key via URLSCAN_API
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with 💙 by [Iocium](https://github.com/iocium)