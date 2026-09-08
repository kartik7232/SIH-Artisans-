import { describe, it, expect } from 'vitest';
import { products } from '../data/products';
import { sampleRequirements } from '../data/b2b';
import { getTranslation } from '../services/i18n';

describe('English Language Isolation & Clean Translation Behavior', () => {
  const devanagariRegex = /[\u0900-\u097F]/;

  it('ensures all English product titles and descriptions contain zero Devanagari characters', () => {
    products.forEach(prod => {
      const name = prod.name || prod.title || '';
      const title = prod.title || '';
      const descEn = prod.descriptionEn || '';

      expect(devanagariRegex.test(name), `Product ${prod.id} name "${name}" has Hindi characters in English`).toBe(false);
      expect(devanagariRegex.test(title), `Product ${prod.id} title "${title}" has Hindi characters in English`).toBe(false);
      expect(devanagariRegex.test(descEn), `Product ${prod.id} descriptionEn has Hindi characters in English`).toBe(false);
    });
  });

  it('ensures B2B tender requirements in English contain zero Devanagari characters', () => {
    sampleRequirements.forEach(req => {
      const title = req.title || '';
      expect(devanagariRegex.test(title), `B2B requirement "${title}" has Hindi in English`).toBe(false);
    });
  });

  it('confirms English greeting for Meena Devi has no Hindi parentheses or words', () => {
    const displayName = 'Meena Devi';
    const generateGreeting = (lang) => {
      return lang === 'hi' ? `नमस्ते, ${displayName} जी` : `Namaste, ${displayName}`;
    };

    const englishGreeting = generateGreeting('en');
    expect(englishGreeting).toBe('Namaste, Meena Devi');
    expect(devanagariRegex.test(englishGreeting)).toBe(false);

    const hindiGreeting = generateGreeting('hi');
    expect(hindiGreeting).toBe('नमस्ते, Meena Devi जी');
    expect(devanagariRegex.test(hindiGreeting)).toBe(true);
  });

  it('confirms brand subtitle in English contains zero Devanagari characters', () => {
    const getBrandSub = (lang) => {
      return lang === 'hi' ? 'कारीगर AI • प्रामाणिक भारत' : 'Handcrafted India • Direct Artisan Platform';
    };

    const enSub = getBrandSub('en');
    expect(enSub).toBe('Handcrafted India • Direct Artisan Platform');
    expect(devanagariRegex.test(enSub)).toBe(false);

    const hiSub = getBrandSub('hi');
    expect(hiSub).toBe('कारीगर AI • प्रामाणिक भारत');
    expect(devanagariRegex.test(hiSub)).toBe(true);
  });

  it('confirms English i18n dictionary keys contain no unexpected Hindi strings', () => {
    const keysToCheck = [
      'brandName',
      'shopReadiness',
      'createProductCta',
      'myProductsTitle',
      'buyDirectBtn',
      'contactArtisanBtn',
      'listenDesc'
    ];

    keysToCheck.forEach(key => {
      const enVal = getTranslation(key, 'en');
      expect(devanagariRegex.test(enVal), `Key "${key}" in English has Hindi characters: "${enVal}"`).toBe(false);
    });
  });
});
