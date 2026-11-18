import { describe, expect, it } from 'vitest';
import {
  baseMimeType,
  isActiveContentType,
  isMimeAllowed,
  isWildcardMimePattern,
  isWildcardMimeType,
  matchesMime,
} from './mime-policy.js';

describe('MIME policy', () => {
  it('normalises parameters and case', () => {
    expect(baseMimeType(' Text/Plain; charset=utf-8 ')).toBe('text/plain');
  });

  it('rejects wildcard patterns as policy grants', () => {
    expect(isWildcardMimePattern('*')).toBe(true);
    expect(isWildcardMimePattern('*/*')).toBe(true);
    expect(isWildcardMimePattern('image/*')).toBe(false);
    expect(matchesMime(['*/*'], 'image/png')).toBe(false);
    expect(matchesMime(['*'], 'text/plain')).toBe(false);
  });

  it('rejects any wildcard as a declared upload type', () => {
    expect(isWildcardMimeType('image/*')).toBe(true);
    expect(isWildcardMimeType('text/*')).toBe(true);
    expect(isWildcardMimeType('*/*')).toBe(true);
    expect(isWildcardMimeType('image/png')).toBe(false);
  });

  it('honours concrete types and major wildcards', () => {
    expect(matchesMime(['image/*'], 'image/png')).toBe(true);
    expect(matchesMime(['image/*'], 'application/pdf')).toBe(false);
    expect(matchesMime(['application/pdf'], 'application/pdf')).toBe(true);
    expect(matchesMime([], 'text/plain')).toBe(true);
  });

  it('denies active content unless the exact type is listed', () => {
    expect(isActiveContentType('text/html')).toBe(true);
    expect(isActiveContentType('image/svg+xml')).toBe(true);
    expect(isActiveContentType('text/plain')).toBe(false);

    expect(isMimeAllowed([], 'text/html')).toBe(false);
    expect(isMimeAllowed(['image/*'], 'image/svg+xml')).toBe(false);
    expect(isMimeAllowed(['text/html'], 'text/html')).toBe(true);
  });
});
