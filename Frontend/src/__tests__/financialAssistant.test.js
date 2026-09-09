import { describe, it, expect, beforeEach } from 'vitest';
import storageService, { DEFAULT_FINANCIAL_TRANSACTIONS } from '../services/storageService';
import { isSurfaceAllowedForRole } from '../config/roles';

describe('Financial Management Assistant for Artisans', () => {
  beforeEach(() => {
    // Reset financial ledger to defaults in localStorage
    storageService.saveFinancialLedger(DEFAULT_FINANCIAL_TRANSACTIONS);
  });

  describe('Ledger Storage & Transaction Management', () => {
    it('loads realistic pre-seeded craft transactions', () => {
      const ledger = storageService.loadFinancialLedger();
      expect(Array.isArray(ledger)).toBe(true);
      expect(ledger.length).toBeGreaterThanOrEqual(8);

      const b2bSale = ledger.find(t => t.category === 'B2B Wholesale');
      expect(b2bSale).toBeDefined();
      expect(b2bSale.amount).toBe(45000);
      expect(b2bSale.type).toBe('income');

      const rawMaterial = ledger.find(t => t.category === 'Raw Materials');
      expect(rawMaterial).toBeDefined();
      expect(rawMaterial.type).toBe('expense');
    });

    it('accurately computes financial summary, net profit and profit margin', () => {
      const summary = storageService.getFinancialSummary();
      expect(summary.totalIncome).toBeGreaterThan(0);
      expect(summary.totalExpense).toBeGreaterThan(0);
      expect(summary.netProfit).toBe(summary.totalIncome - summary.totalExpense);
      expect(summary.profitMargin).toBeGreaterThanOrEqual(0);
      expect(summary.healthScore).toBeGreaterThanOrEqual(500);
      expect(summary.healthScore).toBeLessThanOrEqual(900);
    });

    it('adds a new craft transaction and updates ledger dynamically', () => {
      const initialCount = storageService.loadFinancialLedger().length;

      const newEntry = {
        date: '2026-09-09',
        description: 'Patan Patola Silk Dupatta Exhibition Sale',
        type: 'income',
        category: 'Exhibition & Haat',
        amount: 18000,
        paymentMethod: 'UPI',
        notes: 'Handcrafted natural dye piece'
      };

      const added = storageService.addLedgerTransaction(newEntry);
      expect(added).not.toBeNull();
      expect(added.id).toBeDefined();
      expect(added.amount).toBe(18000);

      const updatedLedger = storageService.loadFinancialLedger();
      expect(updatedLedger.length).toBe(initialCount + 1);
      expect(updatedLedger[0].description).toBe('Patan Patola Silk Dupatta Exhibition Sale');

      // Verify that summary re-computes with the added income
      const updatedSummary = storageService.getFinancialSummary(updatedLedger);
      expect(updatedSummary.transactionCount).toBe(initialCount + 1);
    });
  });

  describe('Role-Based Surface Access for Finance', () => {
    it('allows master artisan and seller roles to access financial suite', () => {
      expect(isSurfaceAllowedForRole('finance', 'artisan')).toBe(true);
      expect(isSurfaceAllowedForRole('finance', 'seller')).toBe(true);
      expect(isSurfaceAllowedForRole('finance', 'admin')).toBe(true);
    });

    it('prohibits external buyers from accessing internal workshop finances', () => {
      expect(isSurfaceAllowedForRole('finance', 'buyer')).toBe(false);
      expect(isSurfaceAllowedForRole('finance', null)).toBe(false);
    });
  });

  describe('Working Capital Math & Safety Margins', () => {
    it('accurately calculates required working capital and break-even units', () => {
      const units = 25;
      const rawCost = 840;
      const wageCost = 300;
      const packCost = 100;
      const sellingPrice = 2200;

      const costPerUnit = rawCost + wageCost + packCost; // 1240
      const totalCapital = units * costPerUnit; // 31000
      const projectedRevenue = units * sellingPrice; // 55000
      const netProfit = projectedRevenue - totalCapital; // 24000
      const marginPct = Math.round((netProfit / projectedRevenue) * 100); // 44%
      const breakEven = Math.ceil(totalCapital / sellingPrice); // 15 units

      expect(totalCapital).toBe(31000);
      expect(projectedRevenue).toBe(55000);
      expect(netProfit).toBe(24000);
      expect(marginPct).toBe(44);
      expect(breakEven).toBe(15);
      expect(breakEven).toBeLessThan(units);
    });
  });
});
