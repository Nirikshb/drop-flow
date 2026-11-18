/**
 * MIME policy shared by uploads and project configuration.
 *
 * An empty allowlist means "any concrete type except active content". Star
 * patterns are never accepted as project patterns because they turn an
 * allowlist into a no-op.
 */
const ACTIVE_CONTENT_TYPES = new Set([
  'text/html',
  'application/xhtml+xml',
  'image/svg+xml',
  'application/xml',
  'text/xml',
  'application/rss+xml',
  'application/atom+xml',
  'application/javascript',
  'text/javascript',
  'application/x-javascript',
  'application/ecmascript',
  'text/ecmascript',
]);

export function baseMimeType(mimeType: string): string {
  return mimeType.split(';')[0]!.trim().toLowerCase();
}

export function isWildcardMimePattern(pattern: string): boolean {
  const base = baseMimeType(pattern);
  return base === '*' || base === '*/*' || base === 'application/*';
}

/**
 * True for anything containing `*`. A declared upload type must be concrete:
 * `image/*` is a policy pattern, never a real Content-Type to sign.
 */
export function isWildcardMimeType(mimeType: string): boolean {
  return baseMimeType(mimeType).includes('*');
}

export function isActiveContentType(mimeType: string): boolean {
  return ACTIVE_CONTENT_TYPES.has(baseMimeType(mimeType));
}

/** Concrete type or concrete major wildcard (`image/*`) only. */
export function matchesMime(allowed: string[], mimeType: string): boolean {
  const mime = baseMimeType(mimeType);
  if (allowed.length === 0) return true;
  return allowed.some((raw) => {
    if (isWildcardMimePattern(raw)) return false;
    const pattern = baseMimeType(raw);
    return pattern === mime || (pattern.endsWith('/*') && mime.startsWith(pattern.slice(0, -1)));
  });
}

/** Final content-type policy applied both at init and again on completion. */
export function isMimeAllowed(allowed: string[], mimeType: string): boolean {
  const mime = baseMimeType(mimeType);
  if (isActiveContentType(mime)) {
    return allowed.some((raw) => baseMimeType(raw) === mime);
  }
  return matchesMime(allowed, mime);
}
