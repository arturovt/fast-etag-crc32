import { loadViteBinding, loadDefaultBinding } from './index.js';

let binding;

// The `if/else` structure is intentional and must not be refactored into a ternary
// or other expression. Bundlers like esbuild and webpack statically analyze
// `typeof require === 'function'` as a known condition at build time, allowing
// them to tree-shake the `else` branch entirely. Collapsing this into an expression
// breaks that static analyzability.
if (typeof require === 'function') {
  const isVite =
    typeof import.meta !== 'undefined' &&
    !!import.meta.env?.MODE &&
    !!import.meta.env.BASE_URL;

  binding = isVite
    ? loadViteBinding(import.meta.dirname)
    : loadDefaultBinding(import.meta.dirname);
} else {
  // Pure ESM: index.js's CJS `require` handles native addon loading, so
  // `createRequire` is not needed here.
  binding = loadDefaultBinding(import.meta.dirname);
}

export const etag = binding.etag;
export const weakEtag = binding.weakEtag;
