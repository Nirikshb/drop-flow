import { describe, expect, it } from 'vitest';
import { normalizeOrigin } from './projects.service.js';

describe('normalizeOrigin', () => {
  it('canonicalises scheme, case and trailing slash', () => {
    expect(normalizeOrigin(' HTTPS://Customer.Example/ ')).toBe('https://customer.example');
  });

  it('rejects wildcards and paths', () => {
    expect(() => normalizeOrigin('*')).toThrow();
    expect(() => normalizeOrigin('https://customer.example/app')).toThrow();
    expect(() => normalizeOrigin('javascript:alert(1)')).toThrow();
  });
});
