import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Award, 
  Sparkles, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShoppingBag, 
  RefreshCw, 
  Layers, 
  SlidersHorizontal,
  IndianRupee,
  MapPin,
  Tag,
  Download,
  Check,
  X,
  ChevronDown
} from 'lucide-react';
import storageService from '../../services/storageService';

export default function AdminCatalogOversight() {
  const { productsList, setProductsList, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all'); // 'all' | 'gi' | 'ai' | 'flagged'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-high' | 'price-low' | 'stock'
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  // Crafts categories list
  const craftCategories = useMemo(() => {
    const categories = new Set(productsList.map(p => p.craft || p.category).filter(Boolean));
    return ['all', ...Array.from(categories)];
  }, [productsList]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return productsList.filter(product => {
      const title = (product.title || '').toLowerCase();
      const artisan = (product.artisanName || '').toLowerCase();
      const region = (product.region || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || title.includes(query) || artisan.includes(query) || region.includes(query);
      const matchesCraft = selectedCraft === 'all' || (product.craft || product.category) === selectedCraft;
      
      let matchesVerification = true;
      if (filterVerification === 'gi') matchesVerification = Boolean(product.giCertified);
      if (filterVerification === 'ai') matchesVerification = Boolean(product.aiVerified);
      if (filterVerification === 'flagged') matchesVerification = Boolean(product.isDelisted);

      return matchesSearch && matchesCraft && matchesVerification;
    }).sort((a, b) => {
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'stock') return (b.inStock || 0) - (a.inStock || 0);
      return 0; // default order
    });
  }, [productsList, searchQuery, selectedCraft, filterVerification, sortBy]);

  // High-Level KPIs
  const stats = useMemo(() => {
    const totalCount = productsList.length;
    const totalValuation = productsList.reduce((acc, p) => acc + ((p.price || 0) * (p.inStock || 1)), 0);
    const giCount = productsList.filter(p => p.giCertified).length;
    const aiCount = productsList.filter(p => p.aiVerified).length;
    const delistedCount = productsList.filter(p => p.isDelisted).length;

    return {
      totalCount,
      totalValuation: `₹${(totalValuation / 100000).toFixed(2)} Lakh`,
      giPercentage: totalCount > 0 ? Math.round((giCount / totalCount) * 100) : 0,
      aiPercentage: totalCount > 0 ? Math.round((aiCount / totalCount) * 100) : 0,
      delistedCount
    };
  }, [productsList]);

  // Admin Actions
  const toggleAIVerification = (productId) => {
    setProductsList(prev => prev.map(prod => {
      if (prod.id === productId) {
        const updated = { ...prod, aiVerified: !prod.aiVerified };
        storageService.saveCustomProduct(updated);
        showToast({
          type: updated.aiVerified ? 'success' : 'info',
          title: 'AI Verification Updated',
          message: `"${prod.title}" is now ${updated.aiVerified ? 'AI Verified' : 'Unverified'}.`
        });
        return updated;
      }
      return prod;
    }));
  };

  const toggleGICertification = (productId) => {
    setProductsList(prev => prev.map(prod => {
      if (prod.id === productId) {
        const updated = { ...prod, giCertified: !prod.giCertified };
        storageService.saveCustomProduct(updated);
        showToast({
          type: updated.giCertified ? 'success' : 'info',
          title: 'GI Status Changed',
          message: `"${prod.title}" GI status toggled to ${updated.giCertified ? 'Certified' : 'Standard'}.`
        });
        return updated;
      }
      return prod;
    }));
  };

  const toggleDelistListing = (productId) => {
    setProductsList(prev => prev.map(prod => {
      if (prod.id === productId) {
        const updated = { ...prod, isDelisted: !prod.isDelisted };
        storageService.saveCustomProduct(updated);
        showToast({
          type: updated.isDelisted ? 'warning' : 'success',
          title: updated.isDelisted ? 'Listing Delisted' : 'Listing Restored',
          message: `"${prod.title}" ${updated.isDelisted ? 'hidden from marketplace' : 'live on marketplace'}.`
        });
        return updated;
      }
      return prod;
    }));
  };

  const deleteListing = (productId, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}" from the platform catalog?`)) {
      setProductsList(prev => prev.filter(p => p.id !== productId));
      showToast({
        type: 'error',
        title: 'Listing Removed',
        message: `"${title}" was removed from the active catalog.`
      });
      if (selectedProductDetail?.id === productId) {
        setSelectedProductDetail(null);
      }
    }
  };

  const exportCatalogAudit = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(productsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `karigar_catalog_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      type: 'success',
      title: 'Audit Report Exported',
      message: 'Catalog audit JSON successfully downloaded.'
    });
  };

  return (
    <div className="admin-catalog-page" style={{ padding: '32px 24px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="oversight-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.06em', color: '#A9543A', textTransform: 'uppercase', marginBottom: '6px' }}>
            <ShieldCheck size={16} />
            <span>CENTRAL ADMINISTRATIVE OVERSIGHT</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif, "Cinzel", serif)', fontSize: '2rem', color: '#1B2A4A', margin: 0, fontWeight: 700 }}>
            Catalog Oversight & Product Moderation Desk
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '6px 0 0 0' }}>
            Audit craft authenticity, regulate GI certifications, review fair-wage pricing compliance, and moderate live seller listings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={exportCatalogAudit}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: '600' }}
          >
            <Download size={16} />
            <span>Export Catalog Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(169, 84, 58, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>Active Listings</span>
            <ShoppingBag size={18} color="#A9543A" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1B2A4A', marginTop: '8px' }}>
            {stats.totalCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '4px', fontWeight: '600' }}>
            ● Real-time synced across India
          </div>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>Total Inventory Value</span>
            <IndianRupee size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#065F46', marginTop: '8px' }}>
            {stats.totalValuation}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
            Calculated at fair artisan floor price
          </div>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>GI Certified Rate</span>
            <Award size={18} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#92400E', marginTop: '8px' }}>
            {stats.giPercentage}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#D97706', marginTop: '4px', fontWeight: '600' }}>
            Authenticated Geographical Indication
          </div>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>AI Verified Accuracy</span>
            <Sparkles size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E40AF', marginTop: '8px' }}>
            {stats.aiPercentage}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: '4px', fontWeight: '600' }}>
            Vision & Fair-Wage algorithm verified
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.98)', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
          <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text" 
            placeholder="Search by product title, artisan name, or state/region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
            >
              ×
            </button>
          )}
        </div>

        {/* Filter by Craft Dropdown */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            value={selectedCraft} 
            onChange={(e) => setSelectedCraft(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem', color: '#1B2A4A', outline: 'none', cursor: 'pointer' }}
          >
            {craftCategories.map(craft => (
              <option key={craft} value={craft}>
                {craft === 'all' ? 'All Craft Disciplines' : craft}
              </option>
            ))}
          </select>

          {/* Filter by Verification Status */}
          <select 
            value={filterVerification} 
            onChange={(e) => setFilterVerification(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem', color: '#1B2A4A', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Verification Statuses</option>
            <option value="gi">GI Certified Only</option>
            <option value="ai">AI Verified Only</option>
            <option value="flagged">Delisted / Flagged Only</option>
          </select>

          {/* Sort By Dropdown */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem', color: '#1B2A4A', outline: 'none', cursor: 'pointer' }}
          >
            <option value="newest">Sort: Catalog Order</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="stock">Highest Stock</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 18px' }}>Craft / Title</th>
                <th style={{ padding: '14px 18px' }}>Artisan & Region</th>
                <th style={{ padding: '14px 18px' }}>Price & Fair-Wage</th>
                <th style={{ padding: '14px 18px' }}>Inventory Stock</th>
                <th style={{ padding: '14px 18px' }}>Certifications</th>
                <th style={{ padding: '14px 18px' }}>Visibility</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Admin Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                    <AlertTriangle size={32} style={{ margin: '0 auto 12px auto', display: 'block', color: '#D97706' }} />
                    <p style={{ fontWeight: '600', fontSize: '1rem', color: '#1B2A4A', margin: '0 0 6px 0' }}>No products match your audit filters</p>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing the search query or selecting "All Craft Disciplines".</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isDelisted = Boolean(product.isDelisted);

                  return (
                    <tr 
                      key={product.id} 
                      style={{ 
                        borderBottom: '1px solid #F1F5F9', 
                        background: isDelisted ? '#FEF2F2' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      {/* Product Thumbnail & Title */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: '#1B2A4A', lineHeight: 1.3, marginBottom: '3px' }}>
                              {product.title}
                            </div>
                            <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '600', color: '#A9543A', background: 'rgba(169, 84, 58, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                              {product.craft || product.category || 'Handicraft'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Artisan & Location */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '600', color: '#334155' }}>
                          {product.artisanName || 'Master Artisan'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '0.76rem', marginTop: '2px' }}>
                          <MapPin size={12} />
                          <span>{product.region || 'India'}</span>
                        </div>
                      </td>

                      {/* Price & Fair Wage */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.94rem' }}>
                          ₹{product.price?.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: '600' }}>
                          ✓ Fair-Wage Floor
                        </span>
                      </td>

                      {/* In Stock */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '600', color: (product.inStock || 0) < 3 ? '#DC2626' : '#16A34A' }}>
                          {product.inStock || 0} units
                        </div>
                        {(product.inStock || 0) < 3 && (
                          <span style={{ fontSize: '0.7rem', color: '#DC2626' }}>Low Stock Alert</span>
                        )}
                      </td>

                      {/* Certifications (AI / GI) */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button 
                            onClick={() => toggleGICertification(product.id)}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '5px', 
                              fontSize: '0.72rem', 
                              fontWeight: '600', 
                              padding: '3px 8px', 
                              borderRadius: '6px', 
                              border: 'none', 
                              cursor: 'pointer',
                              background: product.giCertified ? '#FEF3C7' : '#F1F5F9',
                              color: product.giCertified ? '#92400E' : '#94A3B8'
                            }}
                            title="Click to toggle GI certification"
                          >
                            <Award size={12} />
                            <span>{product.giCertified ? 'GI Certified' : 'Standard'}</span>
                          </button>

                          <button 
                            onClick={() => toggleAIVerification(product.id)}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '5px', 
                              fontSize: '0.72rem', 
                              fontWeight: '600', 
                              padding: '3px 8px', 
                              borderRadius: '6px', 
                              border: 'none', 
                              cursor: 'pointer',
                              background: product.aiVerified ? '#E0F2FE' : '#F1F5F9',
                              color: product.aiVerified ? '#075985' : '#94A3B8'
                            }}
                            title="Click to toggle AI verification"
                          >
                            <Sparkles size={12} />
                            <span>{product.aiVerified ? 'AI Verified' : 'Unverified'}</span>
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px' }}>
                        {isDelisted ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEE2E2', color: '#991B1B', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                            Delisted
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>
                            ● Live
                          </span>
                        )}
                      </td>

                      {/* Controls */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          <button 
                            onClick={() => setSelectedProductDetail(product)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer', color: '#1B2A4A', fontSize: '0.76rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="View product technical details"
                          >
                            <Eye size={13} />
                            <span>Audit</span>
                          </button>

                          <button 
                            onClick={() => toggleDelistListing(product.id)}
                            style={{ 
                              padding: '6px 10px', 
                              borderRadius: '6px', 
                              border: '1px solid', 
                              borderColor: isDelisted ? '#10B981' : '#F59E0B', 
                              background: '#FFF', 
                              cursor: 'pointer', 
                              color: isDelisted ? '#065F46' : '#92400E', 
                              fontSize: '0.76rem', 
                              fontWeight: '600' 
                            }}
                            title={isDelisted ? "Restore to marketplace" : "Hide from marketplace"}
                          >
                            {isDelisted ? 'Restore' : 'Delist'}
                          </button>

                          <button 
                            onClick={() => deleteListing(product.id, product.title)}
                            style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FEF2F2', cursor: 'pointer', color: '#DC2626' }}
                            title="Permanently remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detailed Audit Drawer / Modal */}
      {selectedProductDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '18px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <button 
              onClick={() => setSelectedProductDetail(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              <img 
                src={selectedProductDetail.image} 
                alt={selectedProductDetail.title} 
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E2E8F0' }}
              />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#A9543A', textTransform: 'uppercase' }}>
                  {selectedProductDetail.craft}
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '1.2rem', color: '#1B2A4A' }}>
                  {selectedProductDetail.title}
                </h3>
                <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                  Artisan ID: {selectedProductDetail.artisanId || 'Verified Producer'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '0.84rem' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Region / Cluster</span>
                <strong>{selectedProductDetail.region || 'India'}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Direct Price</span>
                <strong style={{ color: '#0F172A' }}>₹{selectedProductDetail.price}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Available Stock</span>
                <strong>{selectedProductDetail.inStock || 0} Units</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Total Buyer Views</span>
                <strong>{selectedProductDetail.views || 1} Views</strong>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Catalog Narrative (English)</label>
              <p style={{ fontSize: '0.85rem', color: '#334155', background: '#F8FAFC', padding: '12px', borderRadius: '8px', lineHeight: 1.5, margin: 0 }}>
                {selectedProductDetail.description || 'No custom description provided.'}
              </p>
            </div>

            {selectedProductDetail.hindiDescription && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Catalog Narrative (Hindi - हिंदी)</label>
                <p style={{ fontSize: '0.85rem', color: '#334155', background: '#F8FAFC', padding: '12px', borderRadius: '8px', lineHeight: 1.5, margin: 0 }}>
                  {selectedProductDetail.hindiDescription}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setSelectedProductDetail(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', borderRadius: '8px' }}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
