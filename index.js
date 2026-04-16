const { load } = require('node-gyp-build-esm');

const binding = load(__dirname, () => ({
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

module.exports = { etag: binding.etag, weakEtag: binding.weakEtag };
