const { load } = require('node-gyp-build-esm');
const { join } = require('node:path');

function loadViteBinding(dir) {
  return load(dir, () => ({
    'linux-x64': () =>
      require(
        join(
          process.cwd(),
          'node_modules/fast-etag-crc32/prebuilds/linux-x64+ia32/fast-etag-crc32.node',
        ),
      ),
    'darwin-x64': () =>
      require(
        join(
          process.cwd(),
          'node_modules/fast-etag-crc32/prebuilds/darwin-x64+arm64/fast-etag-crc32.node',
        ),
      ),
    'win32-x64': () =>
      require(
        join(
          process.cwd(),
          'node_modules/fast-etag-crc32/prebuilds/win32-x64+ia32/fast-etag-crc32.node',
        ),
      ),
  }));
}

function loadDefaultBinding(dir) {
  return load(dir, () => ({
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
  }));
}

// `__dirname` is undefined when a bundler inlines this CJS file into an ESM
// output. In that case index.mjs handles binding init via import.meta.dirname.
const binding =
  typeof __dirname !== 'undefined' ? loadDefaultBinding(__dirname) : null;

// `module` is undefined when this file is evaluated in an ESM scope (e.g. when
// a bundler inlines it into an .mjs bundle). index.mjs re-exports everything
// via ESM named exports, so the assignment is not needed in that context.
if (typeof module !== 'undefined') {
  module.exports = {
    etag: binding?.etag,
    weakEtag: binding?.weakEtag,
    loadViteBinding,
    loadDefaultBinding,
  };
}
