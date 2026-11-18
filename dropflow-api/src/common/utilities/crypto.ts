import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/** Cryptographically secure, URL-safe opaque token. Never store the raw value. */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function timingSafeEqualStrings(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

interface SignedPayload<T> {
  payload: T;
  exp: number;
}

/** HMAC-signed, expiring token for email verification and password reset. */
export function signToken<T extends object>(payload: T, secret: string, ttlSeconds: number): string {
  const body: SignedPayload<T> = { payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyToken<T extends object>(token: string, secret: string): T | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = createHmac('sha256', secret).update(encoded).digest('base64url');
  if (!timingSafeEqualStrings(signature, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SignedPayload<T>;
    if (typeof parsed.exp !== 'number' || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed.payload;
  } catch {
    return null;
  }
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `org-${randomToken(4).toLowerCase()}`;
}
