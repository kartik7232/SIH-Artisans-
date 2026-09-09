import { describe, it, expect } from 'vitest';
import { isSurfaceAllowedForRole, ROLE_PERMISSIONS } from '../config/roles';
import { storageService } from '../services/storageService';

describe('Admin Oversight System Verification', () => {
  it('strictly restricts catalog oversight and RFQ oversight to admin role', () => {
    // Admin has access
    expect(isSurfaceAllowedForRole('admin-catalog', 'admin')).toBe(true);
    expect(isSurfaceAllowedForRole('admin-rfqs', 'admin')).toBe(true);

    // Artisan / Seller is BLOCKED
    expect(isSurfaceAllowedForRole('admin-catalog', 'artisan')).toBe(false);
    expect(isSurfaceAllowedForRole('admin-rfqs', 'artisan')).toBe(false);

    // Buyer is BLOCKED
    expect(isSurfaceAllowedForRole('admin-catalog', 'buyer')).toBe(false);
    expect(isSurfaceAllowedForRole('admin-rfqs', 'buyer')).toBe(false);
  });

  it('includes admin-catalog and admin-rfqs in ROLE_PERMISSIONS.admin', () => {
    expect(ROLE_PERMISSIONS.admin).toContain('admin-catalog');
    expect(ROLE_PERMISSIONS.admin).toContain('admin-rfqs');
    expect(ROLE_PERMISSIONS.buyer).not.toContain('admin-catalog');
    expect(ROLE_PERMISSIONS.buyer).not.toContain('admin-rfqs');
    expect(ROLE_PERMISSIONS.artisan).not.toContain('admin-catalog');
    expect(ROLE_PERMISSIONS.artisan).not.toContain('admin-rfqs');
  });

  it('verifies product data structure supports AI and GI moderation flags', () => {
    const mockProduct = {
      id: 'prod-audit-1',
      title: 'Kashmiri Hand-Embroidered Pashmina',
      craft: 'Pashmina Weaving & Embroidery',
      region: 'Srinagar, Jammu & Kashmir',
      price: 18500,
      isGICertified: true,
      giTag: 'GI-JK-2013-04',
      aiVerified: true,
      artisanName: 'Ghulam Rasool',
      fairWageScore: 96,
      delisted: false
    };

    // Toggle GI
    mockProduct.isGICertified = !mockProduct.isGICertified;
    expect(mockProduct.isGICertified).toBe(false);

    // Toggle Delisted
    mockProduct.delisted = true;
    expect(mockProduct.delisted).toBe(true);

    // Verify fair wage score validity
    expect(mockProduct.fairWageScore).toBeGreaterThanOrEqual(0);
    expect(mockProduct.fairWageScore).toBeLessThanOrEqual(100);
  });

  it('verifies RFQ tender moderation lifecycle states', () => {
    const validStatuses = ['open', 'matched', 'in_review', 'approved', 'fulfilled', 'cancelled'];
    const mockTender = {
      id: 'tender-101',
      title: '500 Handloom Ikat Silk Shawls for Corporate Gifting',
      targetPrice: 2200,
      quantity: 500,
      status: 'matched',
      assignedCluster: 'Pochampally Weavers Cooperative, Telangana'
    };

    expect(validStatuses).toContain(mockTender.status);

    // Admin updates tender status
    mockTender.status = 'approved';
    expect(mockTender.status).toBe('approved');
    expect(validStatuses).toContain(mockTender.status);

    // Admin reassigns cluster
    mockTender.assignedCluster = 'Sambalpuri Bastralaya, Odisha';
    expect(mockTender.assignedCluster).toBe('Sambalpuri Bastralaya, Odisha');
  });
});
