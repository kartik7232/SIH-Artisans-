import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Award, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  MessageSquare,
  Building2,
  CheckCircle2,
  X,
  Volume2,
  SlidersHorizontal,
  RotateCcw,
  Plus,
  Tag,
  ArrowUpDown,
  Check,
  Package
} from 'lucide-react';

export default function MarketplacePage() {
  const { t, speak, lang } = useLanguage();
  const { 
    productsList, 
    crafts, 
    artisans, 
    surfaceParams, 
    setSelectedProduct, 
    selectedProduct, 
    setSelectedArtisan, 
    selectedArtisan,
    navigate,
    openAssistant,
    showToast,
    currentUser
  } = useApp();

  const [activeCategory, setActiveCategory] = useState(surfaceParams?.filterCraft || 'all');
  const [selectedArtStyle, setSelectedArtStyle] = useState('all');
  const [activeRegion, setActiveRegion] = useState('all');
  const [activeMaterial, setActiveMaterial] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [giOnly, setGiOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [subTab, setSubTab] = useState('products'); // 'products' | 'artisans' | 'crafts'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Visual Art Categories for fast, visual search
  const visualArtStyles = [
    { id: 'all', label: 'All Crafts', img: '/assets/culture/crafts/bamboo-bazaar-baskets.jpg', icon: '🎨' },
    { id: 'bamboo', label: 'Bamboo & Wicker', img: '/assets/culture/crafts/bamboo-bazaar-baskets.jpg', icon: '🧺' },
    { id: 'mudda', label: 'Sarkanda Mudda', img: '/assets/culture/crafts/sarkanda-mudda-stools.jpg', icon: '🪑' },
    { id: 'winnowing', label: 'Winnowing Trays', img: '/assets/culture/crafts/bamboo-winnowing-trays.jpg', icon: '🌾' },
    { id: 'pankha', label: 'Folk Pankha Fans', img: '/assets/culture/crafts/handwoven-bamboo-pankha.jpg', icon: '🪭' },
    { id: 'pottery', label: 'Blue Pottery & Clay', img: '/assets/culture/crafts/jaipur-blue-pottery-artisan.jpg', icon: '🏺' },
    { id: 'handloom', label: 'Banarasi & Handloom', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', icon: '🧵' },
    { id: 'folk-art', label: 'Tribal & Folk Art', img: '/assets/culture/crafts/tribal-terracotta-lamp.jpg', icon: '🖌️' },
    { id: 'embroidery', label: 'Aari & Chikankari', img: '/assets/culture/crafts/kashmiri-aari-embroidery.jpg', icon: '🪡' },
    { id: 'metalcraft', label: 'Copper & Bronze', img: '/assets/culture/crafts/enameled-copper-pottery.jpg', icon: '✨' }
  ];

  // Quick Trending Search Suggestions
  const quickSearchSuggestions = [
    { label: '🌿 Bamboo Baskets', query: 'bamboo basket' },
    { label: '🪑 Mudda Stool', query: 'mudda' },
    { label: '🌾 Winnowing Supa', query: 'winnowing' },
    { label: '🪭 Pankha Fans', query: 'pankha' },
    { label: '🏺 Blue Pottery', query: 'blue pottery' },
    { label: '🧵 Banarasi Silk', query: 'banarasi' },
    { label: '🎨 Warli Art', query: 'warli' },
    { label: '🪔 Terracotta Lamp', query: 'terracotta' },
    { label: '☕ Bamboo Tea Tray', query: 'tray' }
  ];

  // Crafts filter chips
  const craftCategories = [
    { id: 'all', label: 'All Crafts' },
    { id: 'Bamboo', label: '🧺 Bamboo & Cane' },
    { id: 'Handloom', label: '🧵 Handloom' },
    { id: 'Pottery', label: '🏺 Pottery' },
    { id: 'Block Printing', label: '🎨 Block Printing' },
    { id: 'Woodcraft', label: '🪵 Woodcraft' },
    { id: 'Folk Art', label: '🖌️ Folk Art' },
    { id: 'Embroidery', label: '🧶 Embroidery' },
    { id: 'Metalcraft', label: '✨ Metalcraft' }
  ];

  // Price Range Tiers
  const priceOptions = [
    { id: 'all', label: 'All Budgets' },
    { id: 'under-1000', label: 'Under ₹1,000 (Pocket Friendly)' },
    { id: '1000-2500', label: '₹1,000 – ₹2,500 (Home Decor)' },
    { id: '2500-6000', label: '₹2,500 – ₹6,000 (Artisan Heirlooms)' },
    { id: 'above-6000', label: 'Above ₹6,000 (Royal Collections)' }
  ];

  // Region filter chips
  const regionsList = [
    { id: 'all', label: 'All India' },
    { id: 'assam', label: 'Assam' },
    { id: 'haryana', label: 'Haryana' },
    { id: 'west-bengal', label: 'West Bengal' },
    { id: 'bihar', label: 'Bihar' },
    { id: 'rajasthan', label: 'Rajasthan' },
    { id: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { id: 'kashmir', label: 'Kashmir' },
    { id: 'odisha', label: 'Odisha' },
    { id: 'maharashtra', label: 'Maharashtra' },
    { id: 'gujarat', label: 'Gujarat' },
    { id: 'karnataka', label: 'Karnataka' }
  ];

  // Material filter chips
  const materialsList = [
    { id: 'all', label: 'All Materials' },
    { id: 'bamboo', label: 'Natural Bamboo' },
    { id: 'sarkanda', label: 'Sarkanda & Reed' },
    { id: 'silk', label: 'Pure Silk' },
    { id: 'cotton', label: 'Handspun Cotton' },
    { id: 'clay', label: 'Clay & Terracotta' },
    { id: 'brass', label: 'Brass & Bronze' },
    { id: 'wood', label: 'Teak Wood' }
  ];

  // Check if any filter is active
  const isFilterActive = 
    searchQuery.trim() !== '' ||
    activeCategory !== 'all' ||
    selectedArtStyle !== 'all' ||
    activeRegion !== 'all' ||
    activeMaterial !== 'all' ||
    priceRange !== 'all' ||
    giOnly === true ||
    sortBy !== 'featured';

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedArtStyle('all');
    setActiveRegion('all');
    setActiveMaterial('all');
    setPriceRange('all');
    setGiOnly(false);
    setSortBy('featured');
  };

  // Filter and sort products safely
  const filteredProducts = (productsList || [])
    .filter(prod => {
      if (!prod) return false;
      const title = prod.title || prod.name || '';
      const hindiTitle = prod.hindiTitle || prod.hindiName || '';
      const craft = prod.craft || '';
      const region = prod.region || '';
      const category = prod.category || '';
      const desc = prod.descriptionEn || '';
      const q = (searchQuery || '').toLowerCase().trim();

      const matchesSearch = 
        !q ||
        title.toLowerCase().includes(q) ||
        hindiTitle.toLowerCase().includes(q) ||
        craft.toLowerCase().includes(q) ||
        region.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Category filter
      if (activeCategory !== 'all') {
        const matchCat = craft.toLowerCase().includes(activeCategory.toLowerCase()) ||
          category.toLowerCase().includes(activeCategory.toLowerCase());
        if (!matchCat) return false;
      }

      // Visual Art Style filter
      if (selectedArtStyle !== 'all') {
        const text = (title + ' ' + craft + ' ' + category + ' ' + desc).toLowerCase();
        if (selectedArtStyle === 'bamboo' && !text.includes('bamboo') && !text.includes('cane') && !text.includes('wicker')) return false;
        if (selectedArtStyle === 'mudda' && !text.includes('mudda') && !text.includes('sarkanda') && !text.includes('reed')) return false;
        if (selectedArtStyle === 'winnowing' && !text.includes('winnow') && !text.includes('sup') && !text.includes('sifter')) return false;
        if (selectedArtStyle === 'pankha' && !text.includes('pankha') && !text.includes('fan')) return false;
        if (selectedArtStyle === 'pottery' && !text.includes('pottery') && !text.includes('terracotta') && !text.includes('urn')) return false;
        if (selectedArtStyle === 'handloom' && !text.includes('saree') && !text.includes('handloom') && !text.includes('silk') && !text.includes('chanderi')) return false;
        if (selectedArtStyle === 'folk-art' && !text.includes('warli') && !text.includes('madhubani') && !text.includes('pattachitra') && !text.includes('art')) return false;
        if (selectedArtStyle === 'embroidery' && !text.includes('embroidery') && !text.includes('aari') && !text.includes('chikankari') && !text.includes('kantha')) return false;
        if (selectedArtStyle === 'metalcraft' && !text.includes('copper') && !text.includes('dhokra') && !text.includes('bidri') && !text.includes('kansa') && !text.includes('metal')) return false;
      }

      // Region filter
      if (activeRegion !== 'all') {
        const matchReg = region.toLowerCase().includes((activeRegion || '').replace('-', ' '));
        if (!matchReg) return false;
      }

      // Material filter
      if (activeMaterial !== 'all') {
        const mat = (prod.material || (prod.materials || []).join(' ')).toLowerCase();
        if (!mat.includes(activeMaterial.toLowerCase())) return false;
      }

      // Price filter
      const price = Number(prod.price || 0);
      if (priceRange === 'under-1000' && price >= 1000) return false;
      if (priceRange === '1000-2500' && (price < 1000 || price > 2500)) return false;
      if (priceRange === '2500-6000' && (price < 2500 || price > 6000)) return false;
      if (priceRange === 'above-6000' && price <= 6000) return false;

      // GI Certified filter
      if (giOnly && !prod.giCertified) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === 'rating') return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      if (sortBy === 'fastest') return (Number(a.leadTimeDays) || 10) - (Number(b.leadTimeDays) || 10);
      return 0;
    });

  return (
    <div className="marketplace-page">
      {/* Marketplace Top Announcement Banner */}
      <div className="artisan-guarantee-strip">
        <div className="container strip-content">
          <span>🌿 100% Direct From Verified Rural Artisans & Weavers</span>
          <span className="dot">•</span>
          <span>Zero Middlemen Markups</span>
          <span className="dot">•</span>
          <span>Fair Wage Price Transparency Guaranteed</span>
          <span className="dot">•</span>
          <span>Authentic GI-Certified Crafts</span>
        </div>
      </div>

      <div className="container">
        {/* Marketplace Header */}
        <div className="marketplace-header-row">
          <div>
            <span className="section-eyebrow">
              <Award size={14} />
              AUTHENTIC INDIAN CRAFT MARKETPLACE
            </span>
            <h1 className="serif-title">{t('marketplaceTitle')}</h1>
            <p className="page-desc">{t('marketplaceSubtitle')}</p>
          </div>

          <div className="header-actions-group">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('buyer')}
            >
              <Building2 size={16} />
              <span>B2B Wholesale Hub</span>
            </button>

            {/* Strict RBAC: Buyers see B2B RFQ creation button; Artisans/Sellers see Studio */}
            {currentUser?.role === 'buyer' ? (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('buyer')}
                title="Create a custom B2B buying requirement or request quotation"
              >
                <Plus size={16} />
                <span>+ Request Bulk RFQ</span>
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('studio')}
              >
                <Sparkles size={16} />
                <span>List as Artisan</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================== */}
        {/* VISUAL ART STYLES BROWSER (Find Art in 1 Click)            */}
        {/* ========================================================== */}
        <div className="visual-art-browser-section">
          <div className="visual-art-browser-header">
            <span className="visual-browser-eyebrow">
              <Sparkles size={13} color="var(--primary)" />
              EXPLORE BY ART TRADITION
            </span>
            <span className="visual-browser-sub">Click any tradition to instantly filter verified authentic pieces:</span>
          </div>

          <div className="visual-art-styles-scroll">
            {visualArtStyles.map(style => (
              <button
                key={style.id}
                className={`visual-art-card ${selectedArtStyle === style.id ? 'active' : ''}`}
                onClick={() => setSelectedArtStyle(style.id)}
              >
                <div className="art-card-thumb">
                  <img src={style.img} alt={style.label} loading="lazy" />
                  <span className="art-icon-badge">{style.icon}</span>
                </div>
                <span className="art-card-label">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Sub-Tabs */}
        <div className="itokri-discovery-tabs">
          <button 
            className={`disc-tab ${subTab === 'products' ? 'active' : ''}`}
            onClick={() => setSubTab('products')}
          >
            All Products ({filteredProducts.length})
          </button>
          <button 
            className={`disc-tab ${subTab === 'artisans' ? 'active' : ''}`}
            onClick={() => setSubTab('artisans')}
          >
            Artisan Stories ({artisans.length})
          </button>
          <button 
            className={`disc-tab ${subTab === 'crafts' ? 'active' : ''}`}
            onClick={() => setSubTab('crafts')}
          >
            Explore 15+ Crafts
          </button>
        </div>

        {/* ========================================================== */}
        {/* ENHANCED SEARCH & SMART FILTER BAR FOR BUYERS             */}
        {/* ========================================================== */}
        <div className="marketplace-search-section">
          {/* Main Search Input with Clear Button */}
          <div className="search-bar-wrap">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search art forms, products, crafts, regions, or master artisans..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Search Suggestion Chips */}
          <div className="search-suggestions-row">
            <span className="suggestion-label">Trending Art:</span>
            <div className="suggestion-chips-list">
              {quickSearchSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  className={`suggestion-chip ${searchQuery.toLowerCase().includes(item.query) ? 'active' : ''}`}
                  onClick={() => setSearchQuery(item.query)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Craft Filter Pills */}
          <div className="craft-pills-row">
            {craftCategories.map(cat => (
              <button
                key={cat.id}
                className={`craft-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Advanced Filter Controls Row */}
          <div className="secondary-filters-row">
            {/* Price Filter */}
            <div className="filter-group">
              <span className="filter-label">Budget:</span>
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="filter-select-box"
              >
                {priceOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="filter-group">
              <span className="filter-label">Origin State:</span>
              <select
                value={activeRegion}
                onChange={e => setActiveRegion(e.target.value)}
                className="filter-select-box"
              >
                {regionsList.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Material Filter */}
            <div className="filter-group">
              <span className="filter-label">Material:</span>
              <select
                value={activeMaterial}
                onChange={e => setActiveMaterial(e.target.value)}
                className="filter-select-box"
              >
                {materialsList.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="filter-group">
              <span className="filter-label">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="filter-select-box sort-select-box"
              >
                <option value="featured">✨ Featured & GI Certified</option>
                <option value="price-asc">💰 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
                <option value="rating">⭐ Highest Rated (4.9+)</option>
                <option value="fastest">⚡ Fastest Lead Time</option>
              </select>
            </div>

            {/* GI Certified Toggle Button */}
            <div className="filter-group">
              <button 
                className={`gi-toggle-pill ${giOnly ? 'active' : ''}`}
                onClick={() => setGiOnly(!giOnly)}
              >
                <ShieldCheck size={14} />
                <span>GI Certified Only</span>
              </button>
            </div>
          </div>

          {/* Active Filter Tags & Reset Bar */}
          {isFilterActive && (
            <div className="active-filters-strip">
              <span className="active-filters-label">Active Art Filters:</span>

              {searchQuery && (
                <span className="active-filter-badge">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>×</button>
                </span>
              )}

              {selectedArtStyle !== 'all' && (
                <span className="active-filter-badge">
                  Art: {selectedArtStyle.toUpperCase()}
                  <button onClick={() => setSelectedArtStyle('all')}>×</button>
                </span>
              )}

              {activeCategory !== 'all' && (
                <span className="active-filter-badge">
                  Craft: {activeCategory}
                  <button onClick={() => setActiveCategory('all')}>×</button>
                </span>
              )}

              {priceRange !== 'all' && (
                <span className="active-filter-badge">
                  Budget: {priceOptions.find(p => p.id === priceRange)?.label}
                  <button onClick={() => setPriceRange('all')}>×</button>
                </span>
              )}

              {activeRegion !== 'all' && (
                <span className="active-filter-badge">
                  Region: {regionsList.find(r => r.id === activeRegion)?.label}
                  <button onClick={() => setActiveRegion('all')}>×</button>
                </span>
              )}

              {activeMaterial !== 'all' && (
                <span className="active-filter-badge">
                  Material: {materialsList.find(m => m.id === activeMaterial)?.label}
                  <button onClick={() => setActiveMaterial('all')}>×</button>
                </span>
              )}

              {giOnly && (
                <span className="active-filter-badge">
                  GI Certified
                  <button onClick={() => setGiOnly(false)}>×</button>
                </span>
              )}

              <button className="reset-all-btn" onClick={resetAllFilters}>
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>

              <span className="matching-count-badge">
                Found {filteredProducts.length} authentic art pieces
              </span>
            </div>
          )}
        </div>

        {/* ========================================================== */}
        {/* SUBTAB 1: PRODUCTS GRID                                    */}
        {/* ========================================================== */}
        {subTab === 'products' && (
          <div>
            {/* Empty State with Helpful Art Finder Suggestions */}
            {filteredProducts.length === 0 && (
              <div className="marketplace-empty-state">
                <div className="empty-icon-wrap">
                  <Search size={38} color="var(--primary)" />
                </div>
                <h3>No art pieces match your exact criteria</h3>
                <p>Try resetting specific filters or explore one of these authenticated craft traditions:</p>
                <div className="empty-suggestion-btns">
                  <button className="btn btn-secondary" onClick={() => { resetAllFilters(); setSelectedArtStyle('bamboo'); }}>
                    🧺 Bamboo Baskets & Food Covers
                  </button>
                  <button className="btn btn-secondary" onClick={() => { resetAllFilters(); setSelectedArtStyle('mudda'); }}>
                    🪑 Sarkanda Mudda Seating
                  </button>
                  <button className="btn btn-secondary" onClick={() => { resetAllFilters(); setSelectedArtStyle('pottery'); }}>
                    🏺 Jaipur Blue Pottery
                  </button>
                  <button className="btn btn-primary" onClick={resetAllFilters}>
                    <RotateCcw size={15} />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}

            <div className="products-showcase-grid">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.id} 
                  className="product-card"
                  onClick={() => setSelectedProduct(prod)}
                >
                  <div className="product-image-wrap">
                    <img src={prod.image} alt={prod.title} loading="lazy" />
                    {prod.giCertified && (
                      <span className="badge badge-gi" style={{ position: 'absolute', top: 12, right: 12 }}>
                        <Award size={12} />
                        <span>GI Certified</span>
                      </span>
                    )}
                    <span className="badge badge-artisan" style={{ position: 'absolute', bottom: 12, left: 12 }}>
                      ✓ {t('artisanMadeBadge')}
                    </span>
                  </div>

                  <div className="product-content">
                    <span className="prod-craft-type">{prod.craft}</span>
                    <h3 className="product-title">{lang === 'hi' && prod.hindiTitle ? prod.hindiTitle : prod.title}</h3>
                    {lang === 'hi' && prod.hindiTitle && <span className="prod-sub-title">{prod.title}</span>}

                    <div className="product-artisan-info">
                      <MapPin size={13} color="var(--primary)" />
                      <span>{prod.artisanName || "Meena Devi"} • {prod.region}</span>
                    </div>

                    <div className="product-price-row">
                      <div>
                        <span className="product-price">₹{Number(prod.price || 0).toLocaleString()}</span>
                        {prod.originalPrice && (
                          <span className="original-price">₹{Number(prod.originalPrice || 0).toLocaleString()}</span>
                        )}
                      </div>
                      <button className="btn-buy-card">
                        <ShoppingBag size={14} />
                        <span>{t('buyDirectBtn')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SUBTAB 2: ARTISAN STORIES (The Hands Behind the Craft)     */}
        {/* ========================================================== */}
        {subTab === 'artisans' && (
          <div className="artisans-stories-section">
            <div className="section-header-center">
              <span className="section-eyebrow">LIVING MASTERS OF INDIA</span>
              <h2 className="section-title">The Hands Behind the Craft</h2>
              <p className="section-desc">
                Meet the master weavers, potters, and sculptors whose families have preserved India's handloom and handicraft lineages across generations.
              </p>
            </div>

            <div className="artisan-cards-grid">
              {artisans.map(art => (
                <div 
                  key={art.id} 
                  className="artisan-story-card"
                  onClick={() => setSelectedArtisan(art)}
                >
                  <div className="artisan-avatar-wrap">
                    <img src={art.avatar} alt={art.name} />
                    <span className="verified-seal">✓ Verified Master</span>
                  </div>

                  <div className="artisan-story-body">
                    <span className="artisan-craft-tag">{art.craft}</span>
                    <h3 className="artisan-name">{art.name}</h3>
                    <div className="artisan-cluster-loc">
                      <MapPin size={13} />
                      <span>{art.cluster}, {art.state}</span>
                    </div>

                    <p className="artisan-quote">
                      "{art.story ? art.story.slice(0, 120) + '...' : 'Practicing traditional handcraft for over 20 years with passion and dedication.'}"
                    </p>

                    <div className="artisan-stats-strip">
                      <span><strong>{art.experience || '15+'}</strong> Yrs Craft</span>
                      <span><strong>{art.awards?.length || 2}</strong> National Awards</span>
                      <span><strong>{art.productsCount || 18}</strong> Crafts</span>
                    </div>

                    <button className="btn btn-secondary full-width">
                      <span>Meet Artisan & View Shop</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* SUBTAB 3: EXPLORE CRAFTS TAXONOMY                          */}
        {/* ========================================================== */}
        {subTab === 'crafts' && (
          <div className="crafts-taxonomy-grid">
            {crafts.map(c => (
              <div 
                key={c.id} 
                className="craft-tax-card"
                onClick={() => {
                  setActiveCategory(c.name);
                  setSubTab('products');
                }}
              >
                <img src={c.heroImage} alt={c.name} />
                <div className="craft-tax-overlay">
                  <h4>{c.name}</h4>
                  <p>{c.region}</p>
                  <span>{c.artisanCount}+ Artisans • View Products →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* PRODUCT DETAIL MODAL WITH ARTISAN STORY & BUY ACTIONS        */}
      {/* ============================================================ */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-card product-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-corner" onClick={() => setSelectedProduct(null)}>
              <X size={22} />
            </button>

            <div className="prod-detail-grid">
              {/* Product Gallery & GI Seal */}
              <div className="detail-media-wrap">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
                <div className="detail-badges-strip">
                  <span className="badge badge-gi">✓ GI Tag Certified</span>
                  <span className="badge badge-ai">✓ AI Catalogue Verified</span>
                  <span className="badge badge-artisan">✓ 100% Direct to Artisan</span>
                </div>
              </div>

              {/* Product Specifications & Story */}
              <div className="detail-info-wrap">
                <span className="detail-craft-cat">{selectedProduct.craft}</span>
                <h2 className="detail-title">{lang === 'hi' && selectedProduct.hindiTitle ? selectedProduct.hindiTitle : selectedProduct.title}</h2>
                {lang === 'hi' && selectedProduct.title && (
                  <h4 className="detail-hindi-title">{selectedProduct.title}</h4>
                )}

                <div className="detail-price-box">
                  <div className="price-main">
                    <span className="rupee">₹</span>{Number(selectedProduct.price || 0).toLocaleString()}
                  </div>
                  <span className="fair-badge">Fair Artisan Wage Included</span>
                </div>

                {/* Specs Table */}
                <div className="detail-specs-table">
                  <div className="spec-item">
                    <span className="spec-label">Material:</span>
                    <span className="spec-val">{selectedProduct.material || "Pure Silk & Zari"}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Technique:</span>
                    <span className="spec-val">{selectedProduct.technique || "Traditional Pit-Loom"}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Region of Origin:</span>
                    <span className="spec-val">{selectedProduct.region || "Chanderi, Madhya Pradesh"}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Craft Master:</span>
                    <span className="spec-val">{selectedProduct.artisanName || "Meena Devi"}</span>
                  </div>
                </div>

                {/* Craft Description with Audio Listen */}
                <div className="detail-story-box">
                  <div className="story-box-header">
                    <h4>The Artisan's Product Story</h4>
                    <button 
                      className="audio-speech-btn"
                      onClick={() => speak(selectedProduct.description || "Handcrafted pure traditional Indian handloom.")}
                    >
                      <Volume2 size={16} />
                      <span>{t('listenAudio')}</span>
                    </button>
                  </div>
                  <p>{selectedProduct.description || "Every thread of this heirloom piece was placed by hand on traditional wooden looms, preserving centuries-old motifs."}</p>
                </div>

                {/* Action Buttons */}
                <div className="detail-action-buttons">
                  <button 
                    className="btn btn-primary buy-now-btn"
                    onClick={() => {
                      showToast({
                        type: 'success',
                        title: 'Order Placed Directly',
                        message: `Thank you! Direct order for "${selectedProduct.title}" (₹${selectedProduct.price}) placed directly with the artisan.`
                      });
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>{t('buyDirectBtn')} (₹{selectedProduct.price})</span>
                  </button>

                  <button 
                    className="btn btn-secondary contact-artisan-btn"
                    onClick={() => {
                      openAssistant(`I'd like to ask the artisan ${selectedProduct.artisanName} about custom colors for ${selectedProduct.title}`);
                      setSelectedProduct(null);
                    }}
                  >
                    <MessageSquare size={18} />
                    <span>{t('contactArtisanBtn')}</span>
                  </button>

                  <button 
                    className="btn btn-accent bulk-order-btn"
                    onClick={() => {
                      navigate('buyer');
                      setSelectedProduct(null);
                    }}
                  >
                    <Building2 size={18} />
                    <span>{t('bulkOrderBtn')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ARTISAN STORY PROFILE MODAL                                  */}
      {/* ============================================================ */}
      {selectedArtisan && (
        <div className="modal-overlay" onClick={() => setSelectedArtisan(null)}>
          <div className="modal-card artisan-profile-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close-corner" onClick={() => setSelectedArtisan(null)}>
              <X size={22} />
            </button>

            <div className="artisan-profile-header">
              <img src={selectedArtisan.avatar} alt={selectedArtisan.name} className="profile-hero-avatar" />
              <div>
                <span className="profile-badge">MASTER CRAFTSPERSON</span>
                <h2>{selectedArtisan.name}</h2>
                <p className="profile-lineage">{selectedArtisan.craft} • {selectedArtisan.cluster}, {selectedArtisan.state}</p>
                <div className="profile-stats">
                  <span><strong>{selectedArtisan.experience || '20+'}</strong> Years Heritage</span>
                  <span><strong>GI</strong> Authenticated</span>
                  <span><strong>100%</strong> Hand-made</span>
                </div>
              </div>
            </div>

            <div className="artisan-profile-story">
              <h4>Her Heritage & Craft Lineage</h4>
              <p>"{selectedArtisan.story || "I learned weaving from my mother and grandmother. Every saree is woven with traditional motifs that tell stories of our land, rivers, and seasonal flowers."}"</p>
            </div>

            <div className="artisan-modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setActiveCategory(selectedArtisan.craft);
                  setSelectedArtisan(null);
                  setSubTab('products');
                }}
              >
                <span>View {selectedArtisan.name}'s Products</span>
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  openAssistant(`I want to send a personal appreciation and custom inquiry to ${selectedArtisan.name}`);
                  setSelectedArtisan(null);
                }}
              >
                <MessageSquare size={16} />
                <span>Message Artisan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .marketplace-page {
          background: var(--bg-main);
          min-height: calc(100vh - 72px);
          padding-bottom: 96px;
        }
        .artisan-guarantee-strip {
          background: #1B2A4A;
          color: #E2E8F0;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .strip-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .strip-content .dot {
          color: var(--accent-gold);
        }
        .marketplace-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 40px 0 24px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .header-actions-group {
          display: flex;
          gap: 12px;
        }
        .visual-art-browser-section {
          background: linear-gradient(135deg, rgba(169, 50, 38, 0.04) 0%, rgba(212, 175, 55, 0.08) 100%);
          border: 1px solid rgba(169, 50, 38, 0.12);
          border-radius: var(--radius-lg);
          padding: 18px 22px;
          margin-bottom: 28px;
        }
        .visual-art-browser-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .visual-browser-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--primary);
          background: #FFFFFF;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(169, 50, 38, 0.2);
        }
        .visual-browser-sub {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .visual-art-styles-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: thin;
        }
        .visual-art-styles-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .visual-art-styles-scroll::-webkit-scrollbar-thumb {
          background: var(--border-medium);
          border-radius: 4px;
        }
        .visual-art-card {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 8px 10px 10px;
          background: #FFFFFF;
          border: 1.5px solid var(--border-light);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 104px;
          text-align: center;
        }
        .visual-art-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
        }
        .visual-art-card.active {
          border-color: var(--primary);
          background: rgba(169, 50, 38, 0.05);
          box-shadow: 0 0 0 2px var(--primary);
        }
        .art-card-thumb {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          background: #F1E8DF;
        }
        .art-card-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .visual-art-card:hover .art-card-thumb img {
          transform: scale(1.08);
        }
        .art-icon-badge {
          position: absolute;
          bottom: 3px;
          right: 3px;
          background: rgba(0, 0, 0, 0.55);
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        .art-card-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .visual-art-card.active .art-card-label {
          color: var(--primary);
        }
        .itokri-discovery-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--border-medium);
          margin-bottom: 28px;
        }
        .disc-tab {
          padding: 12px 24px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }
        .disc-tab:hover {
          color: var(--primary);
        }
        .disc-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .marketplace-search-section {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
        }
        .search-bar-wrap {
          position: relative;
          margin-bottom: 14px;
        }
        .search-bar-wrap input {
          width: 100%;
          padding: 14px 44px 14px 48px;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 1rem;
          color: var(--text-primary);
          background: var(--bg-subtle);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .search-bar-wrap input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(169, 50, 38, 0.1);
          background: #FFFFFF;
        }
        .search-icon {
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
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .search-clear-btn:hover {
          background: #CBD5E1;
          color: var(--text-primary);
        }
        .search-suggestions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .suggestion-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .suggestion-chips-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .suggestion-chip {
          padding: 4px 11px;
          border-radius: 999px;
          border: 1px dashed var(--border-medium);
          background: var(--bg-subtle);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .suggestion-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: #FFFFFF;
        }
        .suggestion-chip.active {
          border-style: solid;
          border-color: var(--primary);
          background: var(--primary);
          color: #FFFFFF;
        }
        .craft-pills-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .craft-pill-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-medium);
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          background: #FFFFFF;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .craft-pill-btn:hover {
          border-color: var(--primary);
        }
        .craft-pill-btn.active {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
        }
        .secondary-filters-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          white-space: nowrap;
        }
        .filter-select-box {
          padding: 8px 12px;
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          background: #FFFFFF;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .filter-select-box:focus,
        .filter-select-box:hover {
          border-color: var(--primary);
        }
        .sort-select-box {
          font-weight: 700;
          color: var(--primary);
          background: rgba(169, 50, 38, 0.04);
        }
        .gi-toggle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1.5px solid var(--border-medium);
          background: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .gi-toggle-pill:hover {
          border-color: #B45309;
          color: #B45309;
        }
        .gi-toggle-pill.active {
          background: #FEF3C7;
          border-color: #D97706;
          color: #92400E;
          box-shadow: 0 1px 3px rgba(217, 119, 6, 0.2);
        }
        .active-filters-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 14px;
          margin-top: 14px;
          border-top: 1px solid var(--border-light);
        }
        .active-filters-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .active-filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #FEE2E2;
          color: #991B1B;
          border: 1px solid #FCA5A5;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .active-filter-badge button {
          background: none;
          border: none;
          color: #991B1B;
          font-weight: 800;
          cursor: pointer;
          font-size: 0.9rem;
          line-height: 1;
          padding: 0 2px;
        }
        .reset-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .reset-all-btn:hover {
          background: #E2E8F0;
          color: var(--text-primary);
        }
        .matching-count-badge {
          margin-left: auto;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(169, 50, 38, 0.08);
          padding: 4px 10px;
          border-radius: 6px;
        }
        .marketplace-empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border-medium);
          margin: 20px 0 40px;
        }
        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(169, 50, 38, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .marketplace-empty-state h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .marketplace-empty-state p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 22px;
        }
        .empty-suggestion-btns {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .products-showcase-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .products-showcase-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .products-showcase-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 520px) {
          .products-showcase-grid {
            grid-template-columns: 1fr;
          }
        }
        .prod-craft-type {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .prod-sub-title {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .original-price {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-decoration: line-through;
          margin-left: 6px;
        }
        .btn-buy-card {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary);
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .artisan-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 960px) {
          .artisan-cards-grid {
            grid-template-columns: 1fr;
          }
        }
        .artisan-story-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 28px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }
        .artisan-story-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        .artisan-avatar-wrap {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 16px;
          background: #E2E8F0;
        }
        .artisan-avatar-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .verified-seal {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent-green);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .artisan-craft-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
        }
        .artisan-name {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .artisan-cluster-loc {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 14px;
        }
        .artisan-quote {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 18px;
          flex: 1;
        }
        .artisan-stats-strip {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 18px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .crafts-taxonomy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .crafts-taxonomy-grid {
            grid-template-columns: 1fr;
          }
        }
        .craft-tax-card {
          position: relative;
          height: 220px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
        }
        .craft-tax-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .craft-tax-card:hover img {
          transform: scale(1.08);
        }
        .craft-tax-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: #FFFFFF;
        }
        .craft-tax-overlay h4 {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          margin-bottom: 2px;
        }
        .craft-tax-overlay p {
          font-size: 0.82rem;
          color: #CBD5E1;
          margin-bottom: 6px;
        }
        .craft-tax-overlay span {
          font-size: 0.75rem;
          color: var(--accent-gold);
          font-weight: 700;
        }
        /* Product Detail Modal */
        .product-detail-modal {
          max-width: 900px;
          padding: 32px;
        }
        .modal-close-corner {
          position: absolute;
          top: 18px;
          right: 18px;
          color: var(--text-muted);
          cursor: pointer;
        }
        .prod-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .prod-detail-grid {
            grid-template-columns: 1fr;
          }
        }
        .detail-media-wrap {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .detail-media-wrap img {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: 12px;
        }
        .detail-badges-strip {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .detail-craft-cat {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
        }
        .detail-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--text-primary);
          line-height: 1.2;
          margin: 4px 0;
        }
        .detail-hindi-title {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .detail-price-box {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 0;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 16px;
        }
        .price-main {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .fair-badge {
          background: var(--accent-green-light);
          color: var(--accent-green);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .detail-specs-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 0.88rem;
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
        }
        .spec-label {
          color: var(--text-muted);
        }
        .spec-val {
          font-weight: 600;
          color: var(--text-primary);
        }
        .detail-story-box {
          background: var(--bg-subtle);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .story-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .story-box-header h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .audio-speech-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .detail-story-box p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .detail-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        /* Artisan Profile Modal */
        .artisan-profile-modal {
          max-width: 640px;
          padding: 32px;
        }
        .artisan-profile-header {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 24px;
        }
        .profile-hero-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--primary);
        }
        .profile-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.1em;
        }
        .profile-lineage {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .profile-stats {
          display: flex;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--secondary);
        }
        .artisan-profile-story {
          background: var(--bg-subtle);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 24px;
        }
        .artisan-profile-story h4 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .artisan-profile-story p {
          font-size: 0.95rem;
          font-style: italic;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .artisan-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
