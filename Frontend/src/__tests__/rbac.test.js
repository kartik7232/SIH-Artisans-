import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS, ROLE_HOME, isSurfaceAllowedForRole } from '../config/roles';

describe('Role-Based Access Control (RBAC)', () => {
  it('allows Admin to view admin console, catalog oversight, and RFQ oversight', () => {
    expect(isSurfaceAllowedForRole('admin', 'admin')).toBe(true);
    expect(isSurfaceAllowedForRole('admin-catalog', 'admin')).toBe(true);
    expect(isSurfaceAllowedForRole('admin-rfqs', 'admin')).toBe(true);
    expect(isSurfaceAllowedForRole('marketplace', 'admin')).toBe(true);
    expect(isSurfaceAllowedForRole('buyer', 'admin')).toBe(true);
    expect(isSurfaceAllowedForRole('studio', 'admin')).toBe(false);
    expect(isSurfaceAllowedForRole('inventory', 'admin')).toBe(false);
    expect(isSurfaceAllowedForRole('artisan', 'admin')).toBe(false);
  });

  it('allows Buyer to view marketplace and buyer RFQs only', () => {
    expect(isSurfaceAllowedForRole('marketplace', 'buyer')).toBe(true);
    expect(isSurfaceAllowedForRole('buyer', 'buyer')).toBe(true);
    expect(isSurfaceAllowedForRole('admin', 'buyer')).toBe(false);
    expect(isSurfaceAllowedForRole('studio', 'buyer')).toBe(false);
    expect(isSurfaceAllowedForRole('artisan', 'buyer')).toBe(false);
  });

  it('allows Artisan to view seller pages and marketplace, but NOT admin', () => {
    expect(isSurfaceAllowedForRole('artisan', 'artisan')).toBe(true);
    expect(isSurfaceAllowedForRole('studio', 'artisan')).toBe(true);
    expect(isSurfaceAllowedForRole('inventory', 'artisan')).toBe(true);
    expect(isSurfaceAllowedForRole('marketplace', 'artisan')).toBe(true);
    expect(isSurfaceAllowedForRole('admin', 'artisan')).toBe(false);
  });

  it('provides correct default home for each role', () => {
    expect(ROLE_HOME.admin).toBe('admin');
    expect(ROLE_HOME.buyer).toBe('marketplace');
    expect(ROLE_HOME.artisan).toBe('artisan');
  });
});
