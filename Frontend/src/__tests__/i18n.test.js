import { describe, it, expect } from 'vitest';
import { translations, getTranslation, SUPPORTED_LANGUAGES } from '../services/i18n';

describe('i18n Localization Integrity', () => {
  it('supports all 8 Indian languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(8);
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('bn');
    expect(codes).toContain('mr');
    expect(codes).toContain('gu');
    expect(codes).toContain('kn');
  });

  it('returns valid translations in Hindi with English fallback', () => {
    const hindiBrand = getTranslation('brandName', 'hi');
    expect(hindiBrand).toBe('कारीगर सेतु');

    const englishBrand = getTranslation('brandName', 'en');
    expect(englishBrand).toBe('KarigarSeetu');

    // Non-existent key should return fallback key
    const fallback = getTranslation('non_existent_key_12345', 'hi');
    expect(fallback).toBe('non_existent_key_12345');
  });
});
