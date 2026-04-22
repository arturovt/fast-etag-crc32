const { load } = require('node-gyp-build-esm');

// `__dirname` is undefined when a bundler inlines this CJS file into an ESM
// output. `import.meta.dirname` is used as the fallback — it is available in
// CJS context since Node.js 22.16.0 (promoted to stable).
const binding = load(
  typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname,
  () => ({
    'linux-x64': () =>
      require(
        /* @vite-ignore */ './prebuilds/linux-x64+ia32/fast-etag-crc32.node',
      ),
    'darwin-x64': () =>
      require(
        /* @vite-ignore */ './prebuilds/darwin-x64+arm64/fast-etag-crc32.node',
      ),
    'win32-x64': () =>
      require(
        /* @vite-ignore */ './prebuilds/win32-x64+ia32/fast-etag-crc32.node',
      ),
  }),
);

// `module` is undefined when this file is evaluated in an ESM scope (e.g. when
// a bundler inlines it into an .mjs bundle). index.mjs re-exports everything
// via ESM named exports, so the assignment is not needed in that context.
if (typeof module !== 'undefined') {
  module.exports = { etag: binding.etag, weakEtag: binding.weakEtag };
}
