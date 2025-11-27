# Iocium NPM Packages

A monorepo of utility packages for web security, InfoSec tooling, and developer utilities, built with Turborepo and pnpm.

## Packages

### Security & Threat Analysis

- **[@iocium/ioc-diff](./packages/ioc-diff)** - Full-featured IOC diffing and normalization library + CLI for InfoSec tooling
- **[@iocium/link-age](./packages/link-age)** - Domain/URL creation time estimator for phishing detection and threat analysis
- **[@iocium/throwaway-lookup](./packages/throwaway-lookup)** - Cross-platform client for throwaway.cloud API
- **[@iocium/rdap-lite](./packages/rdap-lite)** - Lightweight RDAP client with normalized output, caching, CLI, and browser compatibility
- **[@iocium/urlscan](./packages/urlscan)** - Client for interacting with the urlscan.io API

### Web Analysis & DOM Utilities

- **[@iocium/domhash](./packages/domhash)** - Structure- and layout-aware perceptual hashing for HTML/DOM trees
- **[@iocium/favicon-extractor](./packages/favicon-extractor)** - Extract favicons and app icons from HTML and manifests (Cloudflare Workers friendly)
- **[@iocium/favicon-fetcher](./packages/favicon-fetcher)** - Favicon and BIMI logo fetcher for Cloudflare Workers and browser-compatible environments

### Infrastructure & Utilities

- **[@iocium/cachekit](./packages/cachekit)** - Pluggable, backend-agnostic caching adapter for Node.js and serverless platforms

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) 9.0.0 or later

### Setup

Install all dependencies:

```bash
pnpm install
```

### Building

Build all packages:

```bash
pnpm build
```

Build a specific package:

```bash
pnpm build --filter @iocium/domhash
```

### Testing

Run tests for all packages:

```bash
# Note: Configure test scripts as needed in individual packages
pnpm test
```

### Linting

Lint all packages:

```bash
pnpm lint
```

## Technology Stack

- **[Turborepo](https://turbo.build/repo)** - High-performance build system for monorepos
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[tsup](https://tsup.egoist.dev/)** - TypeScript bundler (used by most packages)
- **TypeScript** - Type-safe JavaScript development

## Publishing

Packages are published individually to npm under the `@iocium` scope. Refer to individual package READMEs for specific installation and usage instructions.

## License

Each package has its own license. Please refer to the individual package directories for license information.
