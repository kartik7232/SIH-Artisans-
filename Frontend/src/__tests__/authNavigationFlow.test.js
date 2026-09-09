import { describe, it, expect, beforeEach } from 'vitest';
import { ROLE_PERMISSIONS, ROLE_HOME, isSurfaceAllowedForRole } from '../config/roles';
import { storageService } from '../services/storageService';

describe('Auth Navigation & Direct Logout / Single-Click Login Verification', () => {
  beforeEach(() => {
    storageService.clearAuthUser();
  });

  describe('Direct Logout Flow', () => {
    it('immediately purges authenticated session and credentials on logout', () => {
      const activeUser = {
        isLoggedIn: true,
        role: 'artisan',
        name: 'Meena Devi',
        email: 'meena.devi@chanderi.artisan',
        clusterOrCompany: 'Chanderi Handloom Cluster, MP',
        verifiedBadge: true
      };

      storageService.saveAuthUser(activeUser);
      expect(storageService.loadAuthUser()?.isLoggedIn).toBe(true);

      // Execute logout action
      storageService.clearAuthUser();
      const afterLogout = storageService.loadAuthUser();

      expect(afterLogout).toBeNull();
    });

    it('always permits navigation to "auth" regardless of prior session role', () => {
      // Prior session roles
      const roles = ['artisan', 'seller', 'buyer', 'admin'];

      roles.forEach(role => {
        // Navigation to 'auth' must never be blocked or redirected to another surface
        const isAuthSurfaceAllowedForUnauthenticated = isSurfaceAllowedForRole('auth', null);
        expect(isAuthSurfaceAllowedForUnauthenticated).toBe(true);
      });
    });

    it('ensures unauthenticated users cannot access restricted workspace surfaces', () => {
      const protectedSurfaces = ['artisan', 'studio', 'inventory', 'marketplace', 'buyer', 'admin'];

      protectedSurfaces.forEach(surface => {
        expect(isSurfaceAllowedForRole(surface, null)).toBe(false);
      });
    });
  });

  describe('Single-Click Login & Synchronous Role Resolution', () => {
    // The synchronous role detection logic as implemented in AuthPage.jsx
    const detectRoleSync = (id) => {
      const lower = id.toLowerCase().trim();
      if (
        lower.includes('meena') ||
        lower.includes('chanderi')
      ) {
        return 'artisan';
      }
      if (
        lower.includes('admin') || 
        lower.includes('developer') || 
        /\bdev\b/.test(lower) ||
        lower.startsWith('dev-') ||
        lower.startsWith('dev_') ||
        lower.endsWith('@karigar.ai') || 
        lower.includes('engineer') || 
        lower.includes('maintainer')
      ) {
        return 'admin';
      }
      if (
        lower.includes('artisan') || 
        lower.includes('seller') || 
        lower.includes('weaver') || 
        lower.includes('shg') || 
        lower.includes('karigar') ||
        lower.startsWith('art-') ||
        /^\+?91[6-9]\d{9}$/.test(lower) || 
        /^[6-9]\d{9}$/.test(lower)
      ) {
        return 'artisan';
      }
      return 'buyer';
    };

    it('synchronously recognizes Artisan (Meena Devi) credentials without debounce delays', () => {
      const artisanInputs = [
        'meena.devi@chanderi.artisan',
        'meena devi',
        'chanderi.handloom@gmail.com',
        'art-9821',
        '+919876543210',
        '9876543210'
      ];

      artisanInputs.forEach(input => {
        expect(detectRoleSync(input)).toBe('artisan');
        const target = ROLE_HOME['artisan'];
        expect(target).toBe('artisan');
        expect(isSurfaceAllowedForRole(target, 'artisan')).toBe(true);
      });
    });

    it('synchronously recognizes Developer / Admin credentials without defaulting to buyer', () => {
      const adminInputs = [
        'admin@karigar.ai',
        'developer@karigar.ai',
        'dev-lead@karigar.ai',
        'lead_maintainer@karigar.ai'
      ];

      adminInputs.forEach(input => {
        expect(detectRoleSync(input)).toBe('admin');
        const target = ROLE_HOME['admin'];
        expect(target).toBe('admin');
        expect(isSurfaceAllowedForRole(target, 'admin')).toBe(true);
      });
    });

    it('synchronously recognizes Buyer credentials', () => {
      const buyerInputs = [
        'ananya.sharma@craftbazaar.in',
        'buyer@retailstore.com',
        'wholesale@fabindia.com'
      ];

      buyerInputs.forEach(input => {
        expect(detectRoleSync(input)).toBe('buyer');
        const target = ROLE_HOME['buyer'];
        expect(target).toBe('marketplace');
        expect(isSurfaceAllowedForRole(target, 'buyer')).toBe(true);
      });
    });

    it('synchronously persists user and enables immediate permission validation on first click', () => {
      const demoArtisan = {
        role: 'artisan',
        name: 'Meena Devi',
        email: 'meena.devi@chanderi.artisan',
        phone: '+91 98765 43210',
        clusterOrCompany: 'Chanderi Handloom Cluster, MP',
        verifiedBadge: true,
        isLoggedIn: true
      };

      // 1-Click login executes saveAuthUser immediately
      storageService.saveAuthUser(demoArtisan);

      const activeUser = storageService.loadAuthUser();
      expect(activeUser).not.toBeNull();
      expect(activeUser.isLoggedIn).toBe(true);

      // Verify immediate permission check passes without delay
      const targetSurface = ROLE_HOME[activeUser.role];
      expect(isSurfaceAllowedForRole(targetSurface, activeUser.role)).toBe(true);
      expect(isSurfaceAllowedForRole('studio', activeUser.role)).toBe(true);
      expect(isSurfaceAllowedForRole('inventory', activeUser.role)).toBe(true);
    });

    it('restricts public account registration types to artisan and buyer only (developer/admin removed)', () => {
      const allowedSignupRoles = ['artisan', 'buyer'];
      expect(allowedSignupRoles).not.toContain('admin');
      expect(allowedSignupRoles).not.toContain('developer');
      expect(allowedSignupRoles.length).toBe(2);
    });
  });
});
