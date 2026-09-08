import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, validateProduct, validateInquiry, validateBuyerRequirement } from '../services/storageService';

describe('storageService Schema Validation', () => {
  it('validates and sanitizes a valid product', () => {
    const raw = {
      id: 'prod-test-1',
      title: ' Handwoven Khadi Stole ',
      price: '1250.75',
      craft: 'Handloom',
      region: 'Varanasi',
      inStock: 5
    };
    const validated = validateProduct(raw);
    expect(validated).not.toBeNull();
    expect(validated.id).toBe('prod-test-1');
    expect(validated.title).toBe('Handwoven Khadi Stole');
    expect(validated.price).toBe(1251);
    expect(validated.category).toBe('Handloom');
    expect(validated.inStock).toBe(5);
  });

  it('rejects a product with missing title or negative price', () => {
    expect(validateProduct({ id: 'bad-1', title: '', price: 100 })).toBeNull();
    expect(validateProduct({ id: 'bad-2', title: 'Valid', price: -50 })).toBeNull();
    expect(validateProduct({ id: 'bad-3', title: 'Valid', price: 'invalid_price' })).toBeNull();
    expect(validateProduct(null)).toBeNull();
    expect(validateProduct({})).toBeNull();
  });

  it('validates inquiries and buyer requirements', () => {
    const inquiry = validateInquiry({
      id: 'inq-99',
      productName: 'Clay Teapots',
      quantity: '10'
    });
    expect(inquiry).not.toBeNull();
    expect(inquiry.quantity).toBe(10);
    expect(inquiry.buyerName).toBe('Direct Craft Buyer');

    const req = validateBuyerRequirement({
      id: 'req-99',
      item: 'Brass Lamps',
      quantity: 50
    });
    expect(req).not.toBeNull();
    expect(req.item).toBe('Brass Lamps');
    expect(req.quantity).toBe(50);
  });
});

describe('storageService Persistence and Event Subscription', () => {
  it('saves and retrieves custom products without crashing', () => {
    const testProd = {
      id: 'prod-save-test',
      title: 'Terracotta Bell',
      price: 450,
      craft: 'Pottery'
    };
    const success = storageService.saveCustomProduct(testProd);
    expect(success).toBe(true);

    const loaded = storageService.loadCustomProducts();
    expect(Array.isArray(loaded)).toBe(true);
    const found = loaded.find(p => p.id === 'prod-save-test');
    expect(found).toBeDefined();
    expect(found.title).toBe('Terracotta Bell');
  });

  it('notifies subscribers on writes', () => {
    let notified = false;
    const unsubscribe = storageService.subscribe((event, data) => {
      if (event === 'local_write') notified = true;
    });

    storageService.saveCustomProduct({
      id: 'sub-test-item',
      title: 'Bamboo Basket',
      price: 320
    });

    expect(notified).toBe(true);
    unsubscribe();
  });
});
