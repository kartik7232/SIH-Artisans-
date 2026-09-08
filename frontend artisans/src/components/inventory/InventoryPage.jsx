import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { cultureAssets } from '../../config/cultureAssets';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Search, 
  Plus, 
  Minus, 
  Sparkles, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  Download,
  QrCode,
  Share2,
  Edit3,
  X,
  SlidersHorizontal,
  RefreshCw,
  Check,
  Layers,
  Tag,
  IndianRupee,
  ShieldCheck,
  LayoutGrid,
  List,
  ExternalLink,
  Package,
  TrendingUp,
  Award
} from 'lucide-react';

export default function InventoryPage() {
  const { t, lang } = useLanguage();
  const { productsList, setProductsList, navigate, setSelectedProduct, showToast, currentUser } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'gi-certified'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [editingProduct, setEditingProduct] = useState(null);
  const [qrProduct, setQrProduct] = useState(null);

  // Local stock adjustments map (persisting real-time adjustments)
  const [stockMap, setStockMap] = useState(() => {
    const initial = {};
    (productsList || []).forEach(p => {
      initial[p.id] = p.inStock !== undefined ? p.inStock : 12;
    });
    return initial;
  });

  const getProductStock = (prodId, fallback = 12) => {
    return stockMap[prodId] !== undefined ? stockMap[prodId] : fallback;
  };

  const updateStock = (productId, delta, productName = 'Craft Item') => {
    setStockMap(prev => {
      const current = prev[productId] !== undefined ? prev[productId] : 12;
      const next = Math.max(0, current + delta);

      if (current === 0 && next > 0) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      }

      showToast({
        type: 'info',
        title: 'Stock Updated',
        message: `${productName}: ${current} → ${next} units in vault`
      });

      return { ...prev, [productId]: next };
    });
  };

  const restockBatch = (productId, amount, productName = 'Craft Item') => {
    updateStock(productId, amount, productName);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleSaveQuickEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const newStock = Number(editingProduct.tempStock);
    const newPrice = Number(editingProduct.tempPrice);
    const newLeadTime = Number(editingProduct.tempLeadTime);

    setStockMap(prev => ({
      ...prev,
      [editingProduct.id]: newStock
    }));

    // Update product list in state if applicable
    if (setProductsList) {
      setProductsList(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            price: newPrice,
            leadTimeDays: newLeadTime,
            inStock: newStock
          };
        }
        return p;
      }));
    }

    showToast({
      type: 'success',
      title: 'Craft Listing Updated',
      message: `Updated ${editingProduct.title} (₹${newPrice.toLocaleString()}, ${newStock} units)`
    });

    setEditingProduct(null);
  };

  const handleExportManifest = () => {
    const csvRows = [
      ['Product ID', 'Craft Name', 'Craft Lineage', 'Region', 'Price (INR)', 'Stock Units', 'Vault Value (INR)', 'GI Certified']
    ];

    productsList.forEach(p => {
      const stock = getProductStock(p.id, p.inStock || 12);
      const val = stock * (p.price || 0);
      csvRows.push([
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.craft || ''}"`,
        `"${p.region || ''}"`,
        p.price || 0,
        stock,
        val,
        p.giCertified ? 'YES' : 'NO'
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KarigarAI_Artisan_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Manifest Exported',
      message: `Exported ${productsList.length} craft items to CSV for workshop recordkeeping`
    });
  };

  const handleShareProduct = (prod) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#/marketplace?product=${prod.id}`);
    }
    showToast({
      type: 'success',
      title: 'Direct Link Copied',
      message: `Share link for "${prod.title}" copied to clipboard!`
    });
  };

  // Compute live inventory totals
  let totalStockCount = 0;
  let totalInventoryValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let giCertifiedCount = 0;

  (productsList || []).forEach(p => {
    const stock = getProductStock(p.id, p.inStock || 12);
    const price = Number(p.price) || 0;
    totalStockCount += stock;
    totalInventoryValue += (stock * price);
    if (stock > 0 && stock <= 5) lowStockCount++;
    if (stock === 0) outOfStockCount++;
    if (p.giCertified) giCertifiedCount++;
  });

  // Filter products by query and tab
  const filteredProducts = (productsList || [])
    .filter(prod => {
      const q = (searchQuery || '').toLowerCase().trim();
      const title = (prod.title || prod.name || '').toLowerCase();
      const craft = (prod.craft || '').toLowerCase();
      const region = (prod.region || '').toLowerCase();
      const material = (prod.materials ? prod.materials.join(' ') : '').toLowerCase();

      const matchesSearch = !q || title.includes(q) || craft.includes(q) || region.includes(q) || material.includes(q);
      if (!matchesSearch) return false;

      const currentStock = getProductStock(prod.id, prod.inStock || 12);

      if (activeTab === 'in-stock') return currentStock > 5;
      if (activeTab === 'low-stock') return currentStock > 0 && currentStock <= 5;
      if (activeTab === 'out-of-stock') return currentStock === 0;
      if (activeTab === 'gi-certified') return prod.giCertified === true;

      return true;
    })
    .sort((a, b) => {
      const stockA = getProductStock(a.id, a.inStock || 12);
      const stockB = getProductStock(b.id, b.inStock || 12);
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sortBy === 'stock-asc') return stockA - stockB;
      if (sortBy === 'stock-desc') return stockB - stockA;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      return 0; // featured default
    });

  return (
    <div className="inventory-page">
      {/* ============================================================ */}
      {/* AMBIENT TRANSLUCENT ARTISAN VILLAGE MURAL WALLPAPER          */}
      {/* ============================================================ */}
      <div 
        className="inventory-wallpaper-layer"
        style={{
          backgroundImage: `url(${cultureAssets.wallpapers.artisanVillageMural || '/assets/culture/wallpapers/artisan-village-mural.jpg'})`
        }}
        aria-hidden="true"
      />

      <div className="container inventory-relative-container">
        {/* ============================================================ */}
        {/* TOP HEADER & WORKSHOP ACTIONS                                */}
        {/* ============================================================ */}
        <div className="inventory-header-glass-card">
          <div className="header-text-block">
            <div className="header-tag-pill">
              <span className="live-dot" />
              <span>AUTHENTIC ARTISAN WORKSHOP & VAULT</span>
            </div>
            <h1 className="inventory-main-title">My Handcrafted Inventory & Vault</h1>
            <p className="inventory-sub-desc">
              Manage physical studio inventory, track real-time craft quantities, monitor low-stock loom alerts, and adjust fair artisan pricing.
            </p>
          </div>

          <div className="header-buttons-cluster">
            <button 
              className="btn btn-secondary manifest-btn"
              onClick={handleExportManifest}
              title="Download full CSV manifest of all workshop crafts"
            >
              <Download size={16} />
              <span>Export Manifest (CSV)</span>
            </button>

            <button 
              className="btn btn-voice create-btn"
              onClick={() => navigate('studio')}
            >
              <Camera size={18} />
              <span>+ Create with AI Studio</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* REAL-TIME INVENTORY KPI METRICS STRIP                        */}
        {/* ============================================================ */}
        <div className="inventory-kpi-grid">
          {/* Card 1: Total Stock Units */}
          <div className="kpi-metric-card glass-panel">
            <div className="kpi-icon-wrap vault">
              <Package size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">VAULT STOCK UNITS</span>
              <div className="kpi-number">{totalStockCount.toLocaleString()}</div>
              <span className="kpi-sub">Across {productsList.length} craft listings</span>
            </div>
          </div>

          {/* Card 2: Total Realized Value */}
          <div className="kpi-metric-card glass-panel">
            <div className="kpi-icon-wrap rupee">
              <IndianRupee size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">TOTAL INVENTORY VALUE</span>
              <div className="kpi-number">₹{totalInventoryValue.toLocaleString()}</div>
              <span className="kpi-sub">100% Direct artisan earnings</span>
            </div>
          </div>

          {/* Card 3: Low Stock Warnings */}
          <div className="kpi-metric-card glass-panel">
            <div className="kpi-icon-wrap alert">
              <AlertTriangle size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">LOW STOCK ALERT</span>
              <div className="kpi-number">{lowStockCount} Heirlooms</div>
              <span className="kpi-sub">≤ 5 units (Re-plait / Loom Alert)</span>
            </div>
          </div>

          {/* Card 4: GI Authenticated Heirlooms */}
          <div className="kpi-metric-card glass-panel">
            <div className="kpi-icon-wrap gi">
              <ShieldCheck size={22} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">GI AUTHENTICATED</span>
              <div className="kpi-number">{giCertifiedCount} Verified</div>
              <span className="kpi-sub">Protected GI Heritage Lineage</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SEARCH, FILTER TABS & DISPLAY CONTROLS                       */}
        {/* ============================================================ */}
        <div className="inventory-controls-glass-panel">
          {/* Search Box */}
          <div className="inventory-search-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Search crafts by title, technique, materials, or origin region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Status Tabs */}
          <div className="inventory-filter-tabs">
            <button 
              className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Items ({productsList.length})
            </button>
            <button 
              className={`filter-tab-pill ${activeTab === 'in-stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('in-stock')}
            >
              <CheckCircle2 size={14} color="#16A34A" />
              <span>In Stock ({productsList.length - lowStockCount - outOfStockCount})</span>
            </button>
            <button 
              className={`filter-tab-pill ${activeTab === 'low-stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('low-stock')}
            >
              <AlertTriangle size={14} color="#D97706" />
              <span>Low Stock ({lowStockCount})</span>
            </button>
            <button 
              className={`filter-tab-pill ${activeTab === 'out-of-stock' ? 'active' : ''}`}
              onClick={() => setActiveTab('out-of-stock')}
            >
              <span>Made-to-Order ({outOfStockCount})</span>
            </button>
            <button 
              className={`filter-tab-pill ${activeTab === 'gi-certified' ? 'active' : ''}`}
              onClick={() => setActiveTab('gi-certified')}
            >
              <ShieldCheck size={14} color="#B45309" />
              <span>GI Tagged ({giCertifiedCount})</span>
            </button>
          </div>

          {/* Secondary Controls: Sort & View Toggle */}
          <div className="inventory-view-sort-row">
            <div className="sort-group">
              <span className="sort-label">Sort:</span>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="inventory-sort-select"
              >
                <option value="featured">✨ Default Workshop Order</option>
                <option value="stock-asc">⚠️ Restock Priority (Low to High)</option>
                <option value="stock-desc">📦 Abundant Stock (High to Low)</option>
                <option value="price-desc">💎 Unit Price: High to Low</option>
                <option value="price-asc">💰 Unit Price: Low to High</option>
                <option value="views">👁️ Most Viewed by Buyers</option>
              </select>
            </div>

            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Artisan Visual Card Grid View"
              >
                <LayoutGrid size={16} />
                <span>Cards</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Workshop Inventory Table Ledger"
              >
                <List size={16} />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRODUCTS RENDER: GRID VIEW                                   */}
        {/* ============================================================ */}
        {viewMode === 'grid' && (
          <div className="inventory-products-grid">
            {filteredProducts.map((prod) => {
              const currentStock = getProductStock(prod.id, prod.inStock || 12);
              const isLowStock = currentStock > 0 && currentStock <= 5;
              const isOutOfStock = currentStock === 0;

              return (
                <div key={prod.id} className="inventory-artisan-card glass-panel">
                  {/* Image Showcase */}
                  <div 
                    className="card-media-wrap"
                    onClick={() => setSelectedProduct(prod)}
                  >
                    <img src={prod.image} alt={prod.title} loading="lazy" />
                    
                    {/* Status Pill on Top Left */}
                    <div className="card-status-badges">
                      {isOutOfStock ? (
                        <span className="badge-status out">Made-to-Order</span>
                      ) : isLowStock ? (
                        <span className="badge-status low">
                          <span className="pulse-dot" />
                          Low Stock: {currentStock} left
                        </span>
                      ) : (
                        <span className="badge-status healthy">
                          ✓ {currentStock} in vault
                        </span>
                      )}
                    </div>

                    {prod.giCertified && (
                      <span className="badge-gi-card">
                        <Award size={13} />
                        <span>GI Certified</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="card-content-wrap">
                    <div className="craft-region-tags">
                      <span className="craft-tag">{prod.craft}</span>
                      <span className="region-tag">{prod.region}</span>
                    </div>

                    <h3 
                      className="card-product-title"
                      onClick={() => setSelectedProduct(prod)}
                      title={prod.title}
                    >
                      {prod.title}
                    </h3>

                    {/* Price & Fair Wage Benchmark */}
                    <div className="card-pricing-strip">
                      <div>
                        <span className="currency-mark">₹</span>
                        <span className="price-bold">{Number(prod.price || 0).toLocaleString()}</span>
                        {prod.originalPrice && (
                          <span className="price-struck">₹{Number(prod.originalPrice).toLocaleString()}</span>
                        )}
                      </div>
                      <span className="fair-wage-label">Fair Wage Direct</span>
                    </div>

                    {/* Stock Stepper & Quick Add Pills */}
                    <div className="card-stock-management-box">
                      <div className="stepper-header">
                        <span className="stepper-title">Studio Stock Available:</span>
                        <span className={`stock-counter-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'ok'}`}>
                          {currentStock} units
                        </span>
                      </div>

                      <div className="stepper-actions-row">
                        <div className="stepper-widget">
                          <button 
                            className="stepper-btn minus"
                            onClick={() => updateStock(prod.id, -1, prod.title)}
                            disabled={currentStock <= 0}
                            title="Decrement 1 unit"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="stepper-number">{currentStock}</span>
                          <button 
                            className="stepper-btn plus"
                            onClick={() => updateStock(prod.id, 1, prod.title)}
                            title="Increment 1 unit"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        {/* 1-Tap Quick Batch Restock */}
                        <div className="quick-restock-pills">
                          <button 
                            className="quick-pill"
                            onClick={() => restockBatch(prod.id, 5, prod.title)}
                            title="Add +5 units from loom"
                          >
                            +5
                          </button>
                          <button 
                            className="quick-pill"
                            onClick={() => restockBatch(prod.id, 10, prod.title)}
                            title="Add +10 units from workshop"
                          >
                            +10
                          </button>
                          <button 
                            className="quick-pill"
                            onClick={() => restockBatch(prod.id, 25, prod.title)}
                            title="Add +25 bulk harvest units"
                          >
                            +25
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Performance Views & Buyer Leads */}
                    <div className="card-stats-row">
                      <div className="stat-item">
                        <Eye size={13} color="var(--primary)" />
                        <span>{prod.views || 184} Views</span>
                      </div>
                      <div className="stat-item">
                        <MessageSquare size={13} color="#0284C7" />
                        <span>{prod.inquiries || 4} Buyer Leads</span>
                      </div>
                      <div className="stat-item">
                        <TrendingUp size={13} color="#16A34A" />
                        <span>{(prod.rating || 4.9).toFixed(1)} ★</span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="card-footer-buttons">
                      <button 
                        className="card-action-btn edit"
                        onClick={() => setEditingProduct({
                          ...prod,
                          tempStock: currentStock,
                          tempPrice: prod.price || 1500,
                          tempLeadTime: prod.leadTimeDays || 7
                        })}
                        title="Edit Price, Stock & Lead Time"
                      >
                        <Edit3 size={14} />
                        <span>Quick Edit</span>
                      </button>

                      <button 
                        className="card-action-btn qr"
                        onClick={() => setQrProduct(prod)}
                        title="Generate Printable Artisan QR Code"
                      >
                        <QrCode size={14} />
                        <span>QR Tag</span>
                      </button>

                      <button 
                        className="card-action-btn share"
                        onClick={() => handleShareProduct(prod)}
                        title="Copy direct buyer share link"
                      >
                        <Share2 size={14} />
                      </button>

                      <button 
                        className="card-action-btn preview"
                        onClick={() => setSelectedProduct(prod)}
                        title="Preview Live Marketplace Listing"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================ */}
        {/* PRODUCTS RENDER: WORKSHOP TABLE VIEW                         */}
        {/* ============================================================ */}
        {viewMode === 'table' && (
          <div className="inventory-table-card glass-panel">
            <div className="table-responsive">
              <table className="workshop-inventory-table">
                <thead>
                  <tr>
                    <th>Product & Craft</th>
                    <th>Region / Origin</th>
                    <th>Fair Price</th>
                    <th>Stock Units</th>
                    <th>Quick Batch</th>
                    <th>Stats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(prod => {
                    const currentStock = getProductStock(prod.id, prod.inStock || 12);
                    const isLowStock = currentStock > 0 && currentStock <= 5;
                    const isOutOfStock = currentStock === 0;

                    return (
                      <tr key={prod.id}>
                        {/* Product Info */}
                        <td className="table-prod-cell">
                          <div className="table-thumb-wrap" onClick={() => setSelectedProduct(prod)}>
                            <img src={prod.image} alt={prod.title} />
                            {prod.giCertified && <span className="mini-gi-badge">GI</span>}
                          </div>
                          <div>
                            <div className="table-prod-name" onClick={() => setSelectedProduct(prod)}>
                              {prod.title}
                            </div>
                            <div className="table-prod-craft">{prod.craft}</div>
                          </div>
                        </td>

                        {/* Region */}
                        <td>
                          <span className="table-region-text">{prod.region}</span>
                        </td>

                        {/* Fair Price */}
                        <td>
                          <div className="table-price">₹{Number(prod.price || 0).toLocaleString()}</div>
                          <span className="table-sub-fair">Artisan Direct</span>
                        </td>

                        {/* Stock Stepper */}
                        <td>
                          <div className="stepper-widget table-stepper">
                            <button 
                              className="stepper-btn minus"
                              onClick={() => updateStock(prod.id, -1, prod.title)}
                              disabled={currentStock <= 0}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="stepper-number">{currentStock}</span>
                            <button 
                              className="stepper-btn plus"
                              onClick={() => updateStock(prod.id, 1, prod.title)}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </td>

                        {/* Quick Batch */}
                        <td>
                          <div className="table-quick-batch">
                            <button onClick={() => restockBatch(prod.id, 5, prod.title)}>+5</button>
                            <button onClick={() => restockBatch(prod.id, 15, prod.title)}>+15</button>
                          </div>
                        </td>

                        {/* Stats */}
                        <td>
                          <div className="table-stats-col">
                            <span>👁️ {prod.views || 184}</span>
                            <span>💬 {prod.inquiries || 4}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          {isOutOfStock ? (
                            <span className="table-badge out">Made-to-Order</span>
                          ) : isLowStock ? (
                            <span className="table-badge low">Low: {currentStock} left</span>
                          ) : (
                            <span className="table-badge healthy">In Stock</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="table-actions-cell">
                            <button 
                              className="table-btn-icon"
                              onClick={() => setEditingProduct({
                                ...prod,
                                tempStock: currentStock,
                                tempPrice: prod.price || 1500,
                                tempLeadTime: prod.leadTimeDays || 7
                              })}
                              title="Edit"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="table-btn-icon"
                              onClick={() => setQrProduct(prod)}
                              title="QR Tag"
                            >
                              <QrCode size={15} />
                            </button>
                            <button 
                              className="table-btn-icon"
                              onClick={() => handleShareProduct(prod)}
                              title="Share"
                            >
                              <Share2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State if No Results */}
        {filteredProducts.length === 0 && (
          <div className="inventory-empty-state glass-panel">
            <Package size={48} color="var(--primary)" />
            <h3>No inventory items match your filter</h3>
            <p>Try clearing your search query or reset status tabs to see all products in your vault.</p>
            <button 
              className="btn btn-primary"
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* QUICK EDIT STOCK & PRICING MODAL                             */}
      {/* ============================================================ */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-card edit-product-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <Edit3 size={20} color="var(--primary)" />
                <h3>Quick Update Studio Inventory</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <p className="modal-sub">
              Updating <strong>{editingProduct.title}</strong> in your real-time artisan vault.
            </p>

            <form onSubmit={handleSaveQuickEdit} className="quick-edit-form">
              <div className="form-group">
                <label>Available Stock Units in Vault:</label>
                <div className="input-with-icon">
                  <Package size={18} className="field-icon" />
                  <input 
                    type="number" 
                    min="0"
                    value={editingProduct.tempStock}
                    onChange={e => setEditingProduct({ ...editingProduct, tempStock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fair Direct Price (₹ INR):</label>
                <div className="input-with-icon">
                  <IndianRupee size={18} className="field-icon" />
                  <input 
                    type="number" 
                    min="100"
                    step="50"
                    value={editingProduct.tempPrice}
                    onChange={e => setEditingProduct({ ...editingProduct, tempPrice: e.target.value })}
                    required
                  />
                </div>
                <span className="field-help">100% of this amount is credited to your bank account upon sale.</span>
              </div>

              <div className="form-group">
                <label>Workshop Dispatch Lead Time (Days):</label>
                <div className="input-with-icon">
                  <RefreshCw size={18} className="field-icon" />
                  <input 
                    type="number" 
                    min="1"
                    max="60"
                    value={editingProduct.tempLeadTime}
                    onChange={e => setEditingProduct({ ...editingProduct, tempLeadTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-row">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <Check size={16} />
                  <span>Save Inventory Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ARTISAN PRINTABLE QR TAG MODAL                               */}
      {/* ============================================================ */}
      {qrProduct && (
        <div className="modal-overlay" onClick={() => setQrProduct(null)}>
          <div className="modal-card qr-tag-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-wrap">
                <QrCode size={20} color="var(--primary)" />
                <h3>Artisan Physical Tag & QR Authenticator</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setQrProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="printable-qr-tag-preview">
              <div className="tag-border">
                <div className="tag-header">
                  <span className="tag-brand">KARIGAR<span style={{ color: 'var(--primary)' }}>AI</span></span>
                  <span className="tag-badge">GENUINE HANDCRAFT</span>
                </div>

                <div className="tag-qr-visual">
                  <div className="qr-simulated-box">
                    <QrCode size={120} color="#1E293B" />
                  </div>
                  <span className="qr-scan-instruction">Scan with phone camera to view artisan bio & provenance</span>
                </div>

                <div className="tag-product-meta">
                  <h4 className="tag-prod-title">{qrProduct.title}</h4>
                  <div className="tag-craft-meta">{qrProduct.craft} • {qrProduct.region}</div>
                  <div className="tag-price-tag">₹{Number(qrProduct.price || 0).toLocaleString()}</div>
                </div>

                {qrProduct.giCertified && (
                  <div className="tag-gi-seal">
                    <ShieldCheck size={14} />
                    <span>GOVERNMENT GI REGISTERED CRAFT</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer-row">
              <button 
                className="btn btn-secondary"
                onClick={() => setQrProduct(null)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  window.print();
                }}
              >
                <span>Print QR Hangtag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* COMPREHENSIVE COMPONENT STYLING                              */}
      {/* ============================================================ */}
      <style>{`
        .inventory-page {
          position: relative;
          padding: 36px 0 90px;
          min-height: calc(100vh - 72px);
          background: #FDFBF7;
        }
        /* Translucent Mural Wallpaper Layer */
        .inventory-wallpaper-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          opacity: 0.16; /* Balanced opacity: visible yet never overpowers text */
          pointer-events: none;
          z-index: 0;
          filter: contrast(1.05) saturate(1.1);
        }
        .inventory-relative-container {
          position: relative;
          z-index: 1;
        }

        /* Glass Panel Shared Style */
        .glass-panel {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        /* Top Header Card */
        .inventory-header-glass-card {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(169, 50, 38, 0.15);
          border-radius: var(--radius-lg);
          padding: 28px 36px;
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          box-shadow: 0 12px 35px rgba(169, 50, 38, 0.06);
        }
        .header-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--primary);
          background: rgba(169, 50, 38, 0.08);
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 10px;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.8s infinite;
        }
        .inventory-main-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .inventory-sub-desc {
          font-size: 0.98rem;
          color: var(--text-secondary);
          max-width: 680px;
          line-height: 1.6;
        }
        .header-buttons-cluster {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .manifest-btn {
          border: 1.5px solid var(--border-medium);
          background: #FFFFFF;
          color: var(--text-primary);
          font-weight: 700;
        }
        .manifest-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* KPI Metrics Grid */
        .inventory-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }
        @media (max-width: 1024px) {
          .inventory-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .inventory-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
        .kpi-metric-card {
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .kpi-metric-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
        }
        .kpi-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .kpi-icon-wrap.vault {
          background: #EFF6FF;
          color: #2563EB;
        }
        .kpi-icon-wrap.rupee {
          background: #ECFDF5;
          color: #059669;
        }
        .kpi-icon-wrap.alert {
          background: #FFFBEB;
          color: #D97706;
        }
        .kpi-icon-wrap.gi {
          background: #FEF2F2;
          color: #DC2626;
        }
        .kpi-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 2px;
        }
        .kpi-number {
          font-size: 1.65rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 2px;
        }
        .kpi-sub {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        /* Controls Panel */
        .inventory-controls-glass-panel {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .inventory-search-wrap {
          position: relative;
          width: 100%;
        }
        .inventory-search-wrap input {
          width: 100%;
          padding: 13px 42px 13px 46px;
          border: 1.5px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.96rem;
          color: var(--text-primary);
          background: #FFFFFF;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .inventory-search-wrap input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(169, 50, 38, 0.1);
        }
        .inventory-search-wrap .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary);
        }
        .search-clear-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: #E2E8F0;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .inventory-filter-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .filter-tab-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .filter-tab-pill:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .filter-tab-pill.active {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
        }
        .filter-tab-pill.active svg {
          color: #FFFFFF !important;
        }

        .inventory-view-sort-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid var(--border-light);
        }
        .sort-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sort-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .inventory-sort-select {
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
        }
        .view-mode-toggle {
          display: flex;
          background: #E2E8F0;
          padding: 3px;
          border-radius: 8px;
          gap: 2px;
        }
        .view-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .view-btn.active {
          background: #FFFFFF;
          color: var(--primary);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Product Cards Grid */
        .inventory-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .inventory-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .inventory-products-grid {
            grid-template-columns: 1fr;
          }
        }
        .inventory-artisan-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .inventory-artisan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.09);
        }
        .card-media-wrap {
          position: relative;
          height: 210px;
          overflow: hidden;
          cursor: pointer;
          background: #F1E8DF;
        }
        .card-media-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .inventory-artisan-card:hover .card-media-wrap img {
          transform: scale(1.06);
        }
        .card-status-badges {
          position: absolute;
          top: 12px;
          left: 12px;
        }
        .badge-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .badge-status.healthy {
          background: rgba(22, 163, 74, 0.92);
          color: #FFFFFF;
        }
        .badge-status.low {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #F59E0B;
        }
        .badge-status.out {
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #F87171;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D97706;
          display: inline-block;
          animation: pulse 1.5s infinite;
        }
        .badge-gi-card {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #FEF3C7;
          border: 1px solid #D97706;
          color: #92400E;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .card-content-wrap {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .craft-region-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .craft-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .region-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .card-product-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.35;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-product-title:hover {
          color: var(--primary);
        }

        .card-pricing-strip {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 12px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }
        .currency-mark {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .price-bold {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .price-struck {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-decoration: line-through;
          margin-left: 6px;
        }
        .fair-wage-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #15803D;
          background: #DCFCE7;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Stock Stepper in Card */
        .card-stock-management-box {
          background: rgba(248, 250, 252, 0.85);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 14px;
        }
        .stepper-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .stepper-title {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .stock-counter-badge {
          font-size: 0.76rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .stock-counter-badge.ok {
          background: #DCFCE7;
          color: #166534;
        }
        .stock-counter-badge.low {
          background: #FEF3C7;
          color: #92400E;
        }
        .stock-counter-badge.out {
          background: #FEE2E2;
          color: #991B1B;
        }
        .stepper-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .stepper-widget {
          display: inline-flex;
          align-items: center;
          background: #FFFFFF;
          border: 1.5px solid var(--border-medium);
          border-radius: 8px;
          overflow: hidden;
        }
        .stepper-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: #FFFFFF;
          color: var(--text-primary);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .stepper-btn:hover:not(:disabled) {
          background: #F1F5F9;
          color: var(--primary);
        }
        .stepper-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .stepper-number {
          padding: 0 10px;
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-primary);
          min-width: 32px;
          text-align: center;
        }
        .quick-restock-pills {
          display: flex;
          gap: 4px;
        }
        .quick-pill {
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .quick-pill:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(169, 50, 38, 0.05);
        }

        /* Stats line */
        .card-stats-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
          color: var(--text-muted);
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid var(--border-light);
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Card footer buttons */
        .card-footer-buttons {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .card-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .card-action-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .card-action-btn.edit {
          flex: 1;
          background: rgba(169, 50, 38, 0.04);
          color: var(--primary);
          border-color: rgba(169, 50, 38, 0.25);
        }
        .card-action-btn.edit:hover {
          background: var(--primary);
          color: #FFFFFF;
        }

        /* Table View Styling */
        .inventory-table-card {
          padding: 16px 20px;
          overflow: hidden;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .workshop-inventory-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .workshop-inventory-table th {
          text-align: left;
          padding: 12px 14px;
          border-bottom: 2px solid var(--border-medium);
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .workshop-inventory-table td {
          padding: 14px;
          border-bottom: 1px solid var(--border-light);
          vertical-align: middle;
        }
        .table-prod-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .table-thumb-wrap {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 8px;
          overflow: hidden;
          background: #F1E8DF;
          cursor: pointer;
          flex-shrink: 0;
        }
        .table-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .mini-gi-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: #B45309;
          color: #FFFFFF;
          font-size: 0.55rem;
          font-weight: 800;
          padding: 1px 3px;
          border-radius: 3px;
        }
        .table-prod-name {
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
        }
        .table-prod-name:hover {
          color: var(--primary);
        }
        .table-prod-craft {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
        }
        .table-region-text {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .table-price {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .table-sub-fair {
          font-size: 0.7rem;
          color: #166534;
          display: block;
        }
        .table-quick-batch button {
          padding: 3px 6px;
          margin-right: 4px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }
        .table-stats-col {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .table-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .table-badge.healthy {
          background: #DCFCE7;
          color: #166534;
        }
        .table-badge.low {
          background: #FEF3C7;
          color: #92400E;
        }
        .table-badge.out {
          background: #FEE2E2;
          color: #991B1B;
        }
        .table-actions-cell {
          display: flex;
          gap: 6px;
        }
        .table-btn-icon {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid var(--border-medium);
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .table-btn-icon:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Empty state */
        .inventory-empty-state {
          text-align: center;
          padding: 60px 20px;
          margin: 40px 0;
        }
        .inventory-empty-state h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-primary);
          margin: 16px 0 8px;
        }
        .inventory-empty-state p {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        /* Modal Overlay & Cards */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .modal-card {
          width: 100%;
          max-width: 520px;
          padding: 32px;
          border-radius: var(--radius-lg);
          animation: popIn 0.25s ease;
        }
        .modal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .modal-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .modal-title-wrap h3 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
        }
        .modal-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .modal-sub {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 22px;
        }
        .quick-edit-form .form-group {
          margin-bottom: 18px;
        }
        .quick-edit-form label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .input-with-icon {
          position: relative;
        }
        .input-with-icon .field-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary);
        }
        .input-with-icon input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .field-help {
          display: block;
          font-size: 0.75rem;
          color: #059669;
          margin-top: 4px;
        }
        .modal-footer-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        /* Printable QR Tag */
        .printable-qr-tag-preview {
          background: #FFFFFF;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--border-medium);
          margin-bottom: 20px;
        }
        .tag-border {
          border: 2px dashed #94A3B8;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .tag-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 8px;
        }
        .tag-brand {
          font-weight: 900;
          letter-spacing: 0.08em;
          font-size: 1rem;
        }
        .tag-badge {
          font-size: 0.65rem;
          font-weight: 800;
          background: #F1F5F9;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .tag-qr-visual {
          margin-bottom: 16px;
        }
        .qr-simulated-box {
          display: inline-block;
          padding: 12px;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          margin-bottom: 6px;
        }
        .qr-scan-instruction {
          display: block;
          font-size: 0.74rem;
          color: var(--text-muted);
        }
        .tag-prod-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .tag-craft-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .tag-price-tag {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .tag-gi-seal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FEF3C7;
          border: 1px solid #D97706;
          color: #92400E;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
