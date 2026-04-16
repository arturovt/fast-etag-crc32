/** Returns a strong ETag (e.g. `"14-1234567890"`) for the given string or Buffer. */
export function etag(content: string | Buffer): string;

/** Returns a weak ETag (e.g. `W/"14-1234567890"`) for the given string or Buffer. */
export function weakEtag(content: string | Buffer): string;
