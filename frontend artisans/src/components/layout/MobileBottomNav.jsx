import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Package, Plus, LayoutDashboard, Building2, ShieldCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const { currentSurface, navigate, currentUser } = useApp();
  const role = currentUser?.role || 'artisan';

  if (role === 'admin') {
    return (
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${currentSurface === 'admin' ? 'active' : ''}`}
          onClick={() => navigate('admin')}
        >
          <ShieldCheck size={20} />
          <span>Admin</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentSurface === 'admin-catalog' ? 'active' : ''}`}
          onClick={() => navigate('admin-catalog')}
        >
          <ShoppingBag size={20} />
          <span>Catalog</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentSurface === 'admin-rfqs' ? 'active' : ''}`}
          onClick={() => navigate('admin-rfqs')}
        >
          <Building2 size={20} />
          <span>B2B RFQs</span>
        </button>
      </nav>
    );
  }

  if (role === 'buyer') {
    return (
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${currentSurface === 'marketplace' ? 'active' : ''}`}
          onClick={() => navigate('marketplace')}
        >
          <ShoppingBag size={20} />
          <span>Marketplace</span>
        </button>

        <button 
          className={`mobile-nav-item ${currentSurface === 'buyer' ? 'active' : ''}`}
          onClick={() => navigate('buyer')}
        >
          <Building2 size={20} />
          <span>B2B Orders</span>
        </button>
      </nav>
    );
  }

  // Default: Artisan / Seller
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-item ${currentSurface === 'artisan' ? 'active' : ''}`}
        onClick={() => navigate('artisan')}
      >
        <LayoutDashboard size={20} />
        <span>Hub</span>
      </button>

      <button 
        className={`mobile-nav-item ${currentSurface === 'inventory' ? 'active' : ''}`}
        onClick={() => navigate('inventory')}
      >
        <Package size={20} />
        <span>Inventory</span>
      </button>

      {/* Center Hero Plus Button */}
      <button 
        className="mobile-nav-item center-plus"
        onClick={() => navigate('studio')}
        title="Create Product with AI Studio"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <button 
        className={`mobile-nav-item ${currentSurface === 'marketplace' ? 'active' : ''}`}
        onClick={() => navigate('marketplace')}
      >
        <ShoppingBag size={20} />
        <span>Market</span>
      </button>
    </nav>
  );
}
