import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS, isSurfaceAllowedForRole } from '../config/roles';
import { products as initialProducts } from '../data/products';

describe('Buyer Marketplace Experience & Search Features', () => {
  it('confirms Studio is strictly restricted for BUYER role to avoid access toasts', () => {
    expect(isSurfaceAllowedForRole('studio', 'buyer')).toBe(false);
    expect(ROLE_PERMISSIONS.buyer.includes('studio')).toBe(false);
    expect(isSurfaceAllowedForRole('buyer', 'buyer')).toBe(true);
    expect(isSurfaceAllowedForRole('marketplace', 'buyer')).toBe(true);
  });

  it('allows artisan role to access Studio', () => {
    expect(isSurfaceAllowedForRole('studio', 'artisan')).toBe(true);
    expect(ROLE_PERMISSIONS.artisan.includes('studio')).toBe(true);
  });

  describe('Search & Discovery Filter Logic', () => {
    it('filters products correctly by multi-word and Hindi/English search queries', () => {
      const search = (query) => {
        const q = query.toLowerCase().trim();
        return initialProducts.filter(prod => {
          const title = (prod.title || prod.name || '').toLowerCase();
          const hindiTitle = (prod.hindiTitle || prod.hindiName || '').toLowerCase();
          const craft = (prod.craft || '').toLowerCase();
          const region = (prod.region || '').toLowerCase();
          const desc = (prod.descriptionEn || '').toLowerCase();
          return title.includes(q) || hindiTitle.includes(q) || craft.includes(q) || region.includes(q) || desc.includes(q);
        });
      };

      // Search for bamboo
      const bambooResults = search('bamboo');
      expect(bambooResults.length).toBeGreaterThan(0);
      expect(bambooResults.some(p => p.craft.toLowerCase().includes('bamboo'))).toBe(true);

      // Search for warli art & terracotta
      const warliResults = search('warli');
      expect(warliResults.length).toBeGreaterThan(0);
      expect(warliResults.some(p => p.craft.toLowerCase().includes('warli'))).toBe(true);

      // Search for pottery
      const potteryResults = search('pottery');
      expect(potteryResults.length).toBeGreaterThan(0);

      // Search for handloom silk
      const silkResults = search('silk');
      expect(silkResults.length).toBeGreaterThan(0);
    });

    it('filters products by budget / price tiers accurately', () => {
      const filterByPrice = (tier) => {
        return initialProducts.filter(prod => {
          const price = Number(prod.price) || 0;
          if (tier === 'under-1000') return price < 1000;
          if (tier === '1000-2500') return price >= 1000 && price <= 2500;
          if (tier === '2500-6000') return price > 2500 && price <= 6000;
          if (tier === 'above-6000') return price > 6000;
          return true;
        });
      };

      const under1000 = filterByPrice('under-1000');
      expect(under1000.every(p => p.price < 1000)).toBe(true);

      const midTier = filterByPrice('1000-2500');
      expect(midTier.every(p => p.price >= 1000 && p.price <= 2500)).toBe(true);

      const highTier = filterByPrice('above-6000');
      expect(highTier.every(p => p.price > 6000)).toBe(true);
    });

    it('filters strictly by GI Certification when toggled', () => {
      const giProducts = initialProducts.filter(prod => prod.giCertified);
      expect(giProducts.length).toBeGreaterThan(0);
      expect(giProducts.every(p => p.giCertified === true)).toBe(true);
    });

    it('sorts correctly by price low-to-high and high-to-low', () => {
      const priceAsc = [...initialProducts].sort((a, b) => a.price - b.price);
      for (let i = 0; i < priceAsc.length - 1; i++) {
        expect(priceAsc[i].price).toBeLessThanOrEqual(priceAsc[i + 1].price);
      }

      const priceDesc = [...initialProducts].sort((a, b) => b.price - a.price);
      for (let i = 0; i < priceDesc.length - 1; i++) {
        expect(priceDesc[i].price).toBeGreaterThanOrEqual(priceDesc[i + 1].price);
      }
    });
  });
});
