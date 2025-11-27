# @iocium/throwaway-lookup

A lightweight, cross-platform client for querying the [throwaway.cloud](https://throwaway.cloud) API — compatible with browsers, Node.js, and serverless platforms like Cloudflare Workers.

---

## ✨ Features

- ✅ Simple API: `lookup(emailOrDomain)`
- 🌐 Works in **Node.js**, **browsers**, and **Cloudflare Workers**
- 🧠 Automatically sets a compliant `User-Agent`
- 🔒 Lets you add custom headers (except `User-Agent`, which is enforced)
- 🚫 Detects disposable email addresses and domains
- ✅ Written in TypeScript with full typings
- 🧪 100% test coverage with `jest`

---

## 🚀 Installation

```bash
npm install @iocium/throwaway-lookup
```

---

## 🧑‍💻 Usage

```ts
import { lookup } from '@iocium/throwaway-lookup';

const result = await lookup('mailinator.com');

if (result.success && result.isDisposable) {
  console.log('Disposable detected!');
} else {
  console.log('Safe to use.');
}
```

---

## 🔧 API

### `lookup(subject: string, options?: LookupOptions): Promise<LookupResult>`

| Parameter | Type | Description |
|----------|------|-------------|
| `subject` | `string` | An email address or domain name to query |
| `options` | `LookupOptions` | Optional object to supply custom headers (except `User-Agent`) |

### `LookupOptions`

```ts
interface LookupOptions {
  headers?: Record<string, string>; // Custom headers
}
```

### `LookupResult`

```ts
interface LookupResult {
  success: boolean;
  isDisposable?: boolean;
  [key: string]: any; // May include additional fields
}
```

---

## 🧪 Testing

```bash
npm test
```

Includes a full test suite with coverage reports for:
- Success paths
- Disposable detection
- Invalid input
- API and network failures

---

## 📘 Documentation

Generate full docs using:

```bash
npm run docs
```

Output is placed in the `docs/` directory and includes all exported types and functions.

---

## 📜 License

MIT
