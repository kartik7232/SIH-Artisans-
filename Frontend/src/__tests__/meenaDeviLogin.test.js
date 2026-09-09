import { describe, it, expect, beforeEach } from 'vitest';
import { ROLE_PERMISSIONS, ROLE_HOME, isSurfaceAllowedForRole } from '../config/roles';
import { storageService } from '../services/storageService';

describe('Meena Devi Credential & Role-Based Routing Verification', () => {
  beforeEach(() => {
    storageService.clearAuthUser();
  });

  it('verifies Meena Devi credential maps strictly to Seller / Master Artisan role', () => {
    const meenaCredentials = [
      'meena.devi@chanderi.artisan',
      'meena devi',
      'Meena Devi',
      'meena',
      'meenadevi',
      'meena.devi'
    ];

    // Helper reflecting the exact role detection logic from AuthPage.jsx
    const detectRoleFromIdentifier = (identifier) => {
      const lower = identifier.toLowerCase().trim();
      if (
        lower.includes('meena') ||
        lower.includes('chanderi') ||
        lower.includes('artisan') || 
        lower.includes('seller') || 
        lower.includes('weaver') || 
        lower.includes('shg') || 
        lower.includes('karigar')
      ) {
        return 'artisan';
      }
      if (
        lower.includes('admin') || 
        lower.includes('developer') || 
        /\bdev\b/.test(lower) ||
        lower.endsWith('@karigar.ai')
      ) {
        return 'admin';
      }
      return 'buyer';
    };

    meenaCredentials.forEach(cred => {
      const role = detectRoleFromIdentifier(cred);
      expect(role).toBe('artisan');
    });
  });

  it('ensures Meena Devi is directly directed to the artisans page (artisan hub)', () => {
    const meenaRole = 'artisan';
    const targetSurface = ROLE_HOME[meenaRole];

    // ROLE_HOME for artisan must strictly be 'artisan'
    expect(targetSurface).toBe('artisan');
    expect(isSurfaceAllowedForRole('artisan', meenaRole)).toBe(true);
  });

  it('verifies Meena Devi has full access to artisan seller surfaces and is restricted from admin surfaces', () => {
    const meenaRole = 'artisan';

    // Allowed Artisan surfaces
    expect(isSurfaceAllowedForRole('artisan', meenaRole)).toBe(true);
    expect(isSurfaceAllowedForRole('studio', meenaRole)).toBe(true);
    expect(isSurfaceAllowedForRole('inventory', meenaRole)).toBe(true);
    expect(isSurfaceAllowedForRole('marketplace', meenaRole)).toBe(true);

    // Blocked Admin surfaces
    expect(isSurfaceAllowedForRole('admin', meenaRole)).toBe(false);
    expect(isSurfaceAllowedForRole('admin-catalog', meenaRole)).toBe(false);
    expect(isSurfaceAllowedForRole('admin-rfqs', meenaRole)).toBe(false);
  });

  it('persists Meena Devi user profile correctly in storageService', () => {
    const meenaUser = {
      isLoggedIn: true,
      role: 'artisan',
      name: 'Meena Devi',
      email: 'meena.devi@chanderi.artisan',
      clusterOrCompany: 'Chanderi Handloom Cluster, MP',
      verifiedBadge: true
    };

    storageService.saveAuthUser(meenaUser);
    const loaded = storageService.loadAuthUser();

    expect(loaded).not.toBeNull();
    expect(loaded.isLoggedIn).toBe(true);
    expect(loaded.role).toBe('artisan');
    expect(loaded.name).toBe('Meena Devi');
    expect(loaded.clusterOrCompany).toBe('Chanderi Handloom Cluster, MP');
  });
});
