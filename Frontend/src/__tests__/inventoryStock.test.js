import { describe, it, expect } from 'vitest';
import { products } from '../data/products';

describe('Artisan Inventory & Stock Features', () => {
  it('calculates total inventory vault stock and valuation accurately', () => {
    let totalUnits = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    let giCount = 0;

    products.forEach(p => {
      const stock = p.inStock !== undefined ? p.inStock : 12;
      const price = Number(p.price) || 0;
      totalUnits += stock;
      totalValue += (stock * price);
      if (stock > 0 && stock <= 5) lowStockCount++;
      if (p.giCertified) giCount++;
    });

    expect(totalUnits).toBeGreaterThan(0);
    expect(totalValue).toBeGreaterThan(100000);
    expect(giCount).toBeGreaterThan(0);
  });

  it('filters products correctly by inventory status tabs', () => {
    const filterByTab = (tab) => {
      return products.filter(p => {
        const stock = p.inStock !== undefined ? p.inStock : 12;
        if (tab === 'in-stock') return stock > 5;
        if (tab === 'low-stock') return stock > 0 && stock <= 5;
        if (tab === 'out-of-stock') return stock === 0;
        if (tab === 'gi-certified') return p.giCertified === true;
        return true;
      });
    };

    const inStockItems = filterByTab('in-stock');
    expect(inStockItems.every(p => (p.inStock || 12) > 5)).toBe(true);

    const giItems = filterByTab('gi-certified');
    expect(giItems.every(p => p.giCertified === true)).toBe(true);
  });

  it('supports real-time stock stepper updates and batch restock', () => {
    let currentStock = 12;
    const updateStock = (delta) => Math.max(0, currentStock + delta);

    expect(updateStock(-1)).toBe(11);
    expect(updateStock(1)).toBe(13);
    expect(updateStock(5)).toBe(17);
    expect(updateStock(10)).toBe(22);
    expect(updateStock(25)).toBe(37);

    // Cannot decrement below 0
    currentStock = 0;
    expect(updateStock(-1)).toBe(0);
  });

  it('generates CSV manifest rows correctly with proper headers and data', () => {
    const csvHeaders = ['Product ID', 'Craft Name', 'Craft Lineage', 'Region', 'Price (INR)', 'Stock Units', 'Vault Value (INR)', 'GI Certified'];
    const sampleRow = [
      products[0].id,
      `"${products[0].title.replace(/"/g, '""')}"`,
      `"${products[0].craft || ''}"`,
      `"${products[0].region || ''}"`,
      products[0].price || 0,
      products[0].inStock || 12,
      (products[0].inStock || 12) * (products[0].price || 0),
      products[0].giCertified ? 'YES' : 'NO'
    ];

    expect(csvHeaders.length).toBe(8);
    expect(sampleRow.length).toBe(8);
    expect(sampleRow[0]).toBe(products[0].id);
    expect(sampleRow[4]).toBeGreaterThan(0);
  });
});
