# fast-etag-crc32

Fast ETag generation for Node.js via N-API native bindings. Uses CRC32 (zlib) instead of SHA-1, making it significantly faster than the popular [`etag`](https://www.npmjs.com/package/etag) package. Accepts `string` or `Buffer`.

## Installation

```sh
npm install fast-etag-crc32
# or
yarn add fast-etag-crc32
# or
pnpm install fast-etag-crc32
```

## Usage

```js
import { etag, weakEtag } from 'fast-etag-crc32';

etag('Hello, World!')        // "13-2287966064"
weakEtag('Hello, World!')    // W/"13-2287966064"

// Buffer input (faster for large payloads)
const buf = Buffer.from('Hello, World!');
etag(buf)                    // "13-2287966064"
```

## API

### `etag(content: string | Buffer): string`

Returns a strong ETag (e.g. `"13-2287966064"`). The value is the byte length and CRC32 of the content.

### `weakEtag(content: string | Buffer): string`

Returns a weak ETag (e.g. `W/"13-2287966064"`).

## Benchmark

Measured against `etag@1.8.1` (SHA-1 based) on Linux x64, 500,000 iterations.

```
── small (13 bytes) ──
  etag (npm) string                    1,123,283 ops/sec  (445.1 ms)
  etag (npm) buffer                    1,308,061 ops/sec  (382.2 ms)
  fast-etag-crc32 etag string          5,693,258 ops/sec  (87.8 ms)
  fast-etag-crc32 etag buffer          5,729,102 ops/sec  (87.3 ms)
  fast-etag-crc32 weakEtag             4,943,559 ops/sec  (101.1 ms)

── medium (1024 bytes) ──
  etag (npm) string                      414,884 ops/sec  (1205.2 ms)
  etag (npm) buffer                      641,051 ops/sec  (780.0 ms)
  fast-etag-crc32 etag string            882,562 ops/sec  (566.5 ms)
  fast-etag-crc32 etag buffer          2,104,478 ops/sec  (237.6 ms)
  fast-etag-crc32 weakEtag               867,480 ops/sec  (576.4 ms)

── large (65536 bytes) ──
  etag (npm) string                       11,461 ops/sec  (43627.3 ms)
  etag (npm) buffer                       20,992 ops/sec  (23818.5 ms)
  fast-etag-crc32 etag string             19,149 ops/sec  (26111.5 ms)
  fast-etag-crc32 etag buffer             79,464 ops/sec  (6292.2 ms)
  fast-etag-crc32 weakEtag                19,219 ops/sec  (26016.1 ms)
```

Pass a `Buffer` when the content is already buffered (e.g. from `fs.readFile`) — it avoids an internal string copy and is significantly faster at large sizes.

## Notes

- ETag format: `"<byteLength>-<crc32>"` — differs from `etag` npm which uses `"<hexLen>-<sha1>"`
- Not a drop-in replacement if consumers validate ETag format
- Linux and macOS only. Windows is not supported
