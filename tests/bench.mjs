import etag from 'etag';
import { etag as fastEtag, weakEtag as fastWeakEtag } from '../index.mjs';

const ITERATIONS = 500_000;

const payloads = {
  small:  'Hello, World!',
  medium: 'x'.repeat(1_024),
  large:  'x'.repeat(64 * 1_024),
};

function bench(label, fn) {
  // warmup
  for (let i = 0; i < 1_000; i++) fn();

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) fn();
  const ms = performance.now() - start;

  const opsPerSec = Math.round(ITERATIONS / (ms / 1000));
  console.log(`  ${label.padEnd(36)} ${opsPerSec.toLocaleString()} ops/sec  (${ms.toFixed(1)} ms)`);
}

for (const [size, payload] of Object.entries(payloads)) {
  const buf = Buffer.from(payload);

  console.log(`\n── ${size} (${payload.length} bytes) ──`);
  bench('etag (npm) string',           () => etag(payload));
  bench('etag (npm) buffer',           () => etag(buf));
  bench('fast-etag-crc32 etag string', () => fastEtag(payload));
  bench('fast-etag-crc32 etag buffer', () => fastEtag(buf));
  bench('fast-etag-crc32 weakEtag',    () => fastWeakEtag(payload));
}
