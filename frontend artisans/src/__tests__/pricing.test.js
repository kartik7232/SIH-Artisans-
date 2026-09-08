import { describe, it, expect } from 'vitest';
import { aiService } from '../services/aiService';

describe('aiService Fair-Wage Pricing Engine', () => {
  it('calculates balanced pricing correctly with fair wage floor', () => {
    const pricing = aiService.calculateSmartPricing({
      rawMaterialCost: 800,
      daysOfWork: 10,
      dailyWageRate: 500,
      giCertified: true,
      strategy: 'balanced'
    });

    expect(pricing.recommended).toBeGreaterThan(pricing.min);
    expect(pricing.max).toBeGreaterThan(pricing.recommended);
    expect(pricing.breakdown.rawMaterial).toBe(800);
    expect(pricing.breakdown.craftGIValue).toBeGreaterThan(0);
    expect(pricing.fairWageCertified).toBe(true);
  });

  it('adjusts prices based on strategy (quicksale vs premium)', () => {
    const params = {
      rawMaterialCost: 500,
      daysOfWork: 5,
      dailyWageRate: 400,
      giCertified: false
    };

    const quick = aiService.calculateSmartPricing({ ...params, strategy: 'quicksale' });
    const balanced = aiService.calculateSmartPricing({ ...params, strategy: 'balanced' });
    const premium = aiService.calculateSmartPricing({ ...params, strategy: 'premium' });

    expect(quick.recommended).toBeLessThanOrEqual(balanced.recommended);
    expect(balanced.recommended).toBeLessThan(premium.recommended);
  });
});

describe('aiService Bilingual Copy Generation', () => {
  it('generates English and Hindi titles and descriptions', () => {
    const copy = aiService.generateCatalogCopy({
      craft: 'Blue Pottery',
      material: 'Quartz Clay',
      region: 'Jaipur, Rajasthan',
      artisanName: 'Kripal Singh'
    });

    expect(copy.titleEn).toContain('Blue Pottery');
    expect(copy.titleHi).toContain('Blue Pottery');
    expect(copy.descEn).toContain('Kripal Singh');
    expect(copy.descHi).toContain('Jaipur, Rajasthan');
    expect(copy.seoKeywords.length).toBeGreaterThanOrEqual(3);
  });
});
