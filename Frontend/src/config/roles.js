/**
 * KARIGARAI - Role-Based Access Control (RBAC) Matrix
 */

export const ROLE_PERMISSIONS = {
  admin: ['admin', 'admin-catalog', 'admin-rfqs', 'marketplace', 'buyer', 'finance'],
  artisan: ['artisan', 'studio', 'inventory', 'finance', 'marketplace', 'onboarding'],
  seller: ['artisan', 'studio', 'inventory', 'finance', 'marketplace', 'onboarding'],
  buyer: ['marketplace', 'buyer']
};

export const ROLE_HOME = {
  admin: 'admin',
  artisan: 'artisan',
  seller: 'artisan',
  buyer: 'marketplace'
};

export const isSurfaceAllowedForRole = (surface, role) => {
  if (!role) return surface === 'auth';
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(surface);
};

export default {
  ROLE_PERMISSIONS,
  ROLE_HOME,
  isSurfaceAllowedForRole
};
