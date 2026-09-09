import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Send, 
  Plus, 
  Layers,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Truck,
  Check,
  Package,
  TrendingUp,
  Tag
} from 'lucide-react';
import { cultureAssets } from '../../config/cultureAssets';

export default function BuyerHubPage() {
  const { t } = useLanguage();
  const { buyerRequirements, addBuyerRequirement, addInquiry, navigate, showToast } = useApp();
  const formRef = useRef(null);

  const [isCreatingReq, setIsCreatingReq] = useState(false);
  const [productName, setProductName] = useState('Handwoven Bamboo Food Covers & Bazaar Baskets');
  const [quantity, setQuantity] = useState(500);
  const [targetBudget, setTargetBudget] = useState(350);
  const [deliveryCity, setDeliveryCity] = useState('New Delhi');
  const [timelineDays, setTimelineDays] = useState(30);

  const [isMatching, setIsMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(false);
  const [inquiryDispatched, setInquiryDispatched] = useState(false);

  // Sourcing Clusters catalog data backed by authentic uploaded images
  const sourcingClusters = cultureAssets.buyer?.clusters || [
    {
      id: 'cluster-bamboo-bazaar',
      name: 'Assam Bamboo & Wicker Bazaar Guild',
      hindiName: 'असम बांस व केन बाजार शिल्प संघ',
      craft: 'Bamboo & Cane Weaving',
      region: 'Barpeta & Majuli, Assam',
      image: '/assets/culture/crafts/bamboo-bazaar-baskets.jpg',
      moq: '50 units',
      capacity: '1,200 units / mo',
      priceBand: '₹280 – ₹450',
      leadTime: '15–20 Days',
      speciality: 'Conical food covers, woven bazaar baskets, wicker trays',
      giCertified: true
    },
    {
      id: 'cluster-winnowing-trays',
      name: 'Traditional Bamboo Winnowing Trays (Supa)',
      hindiName: 'पारंपरिक बांस सूप व अनाज टोकरी समूह',
      craft: 'Bamboo Winnowing & Sifting Weave',
      region: 'Purulia, West Bengal & Bihar',
      image: '/assets/culture/crafts/bamboo-winnowing-trays.jpg',
      moq: '100 units',
      capacity: '2,000 units / mo',
      priceBand: '₹120 – ₹220',
      leadTime: '10–15 Days',
      speciality: 'Eco-friendly grain winnowing trays, ritual supa, rustic shallow baskets',
      giCertified: true
    },
    {
      id: 'cluster-sarkanda-mudda',
      name: 'Heritage Sarkanda Mudda Seating Guild',
      hindiName: 'सरकंडा मुड्डा हस्तनिर्मित बैठक समूह',
      craft: 'Wild Reed & Grass Furniture Weaving',
      region: 'Farrukhnagar, Haryana Craft Belt',
      image: '/assets/culture/crafts/sarkanda-mudda-stools.jpg',
      moq: '25 units',
      capacity: '500 units / mo',
      priceBand: '₹450 – ₹750',
      leadTime: '20–25 Days',
      speciality: 'Hand-braided colorful Mudda stools, courtyard ottomans, eco seating',
      giCertified: true
    },
    {
      id: 'cluster-bamboo-pankha',
      name: 'Geometric Handwoven Bamboo Pankha Collective',
      hindiName: 'हस्तनिर्मित रंग-बिरंगा बांस पंखा समूह',
      craft: 'Bamboo Sliver Geometric Weaving',
      region: 'Madhubani & Darbhanga, Bihar',
      image: '/assets/culture/crafts/handwoven-bamboo-pankha.jpg',
      moq: '100 units',
      capacity: '3,500 units / mo',
      priceBand: '₹85 – ₹160',
      leadTime: '10–14 Days',
      speciality: 'Vivid dyed geometric patterns, natural cane handles, ESG wedding favors',
      giCertified: true
    },
    {
      id: 'cluster-bamboo-storage',
      name: 'Cylindrical Bamboo Storage & Kitchen Canisters',
      hindiName: 'बांस भंडारण जार व ढक्कनदार टोकरियां',
      craft: 'Airtight Bamboo Plaiting & Joinery',
      region: 'Nalbari & Guwahati, Assam',
      image: '/assets/culture/crafts/bamboo-storage-containers.jpg',
      moq: '40 units',
      capacity: '800 units / mo',
      priceBand: '₹320 – ₹550',
      leadTime: '15–18 Days',
      speciality: 'Smoked termite-proof grain jars, spice storage canisters with woven lids',
      giCertified: true
    }
  ];

  const handlePreFillRfq = (cluster) => {
    setProductName(cluster.name);
    setQuantity(parseInt(cluster.moq) || 100);
    const avgPrice = parseInt(cluster.priceBand.replace(/[^0-9]/g, '').slice(0, 3)) || 250;
    setTargetBudget(avgPrice);
    setIsCreatingReq(true);
    setMatchDone(false);
    setInquiryDispatched(false);

    if (showToast) {
      showToast({
        type: 'info',
        title: 'RFQ Pre-filled',
        message: `Sourcing details loaded for ${cluster.name}`
      });
    }

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRunAiMatch = () => {
    setIsMatching(true);
    setMatchDone(false);
    setInquiryDispatched(false);

    setTimeout(() => {
      setIsMatching(false);
      setMatchDone(true);
    }, 1400);
  };

  const handleDispatchInquiry = () => {
    const totalVal = Number(quantity || 0) * Number(targetBudget || 0);
    const newInquiry = {
      id: `inq-${Date.now()}`,
      buyerName: 'Direct B2B Enterprise Buyer',
      buyerLocation: deliveryCity,
      productName: productName,
      quantity: Number(quantity),
      targetPrice: Number(targetBudget),
      totalValue: totalVal,
      timeline: `${timelineDays} Days`,
      status: 'new',
      timestamp: 'Just now',
      message: `Direct wholesale sourcing order: ${quantity} units of ${productName} for commercial delivery in ${deliveryCity}. Target budget ₹${targetBudget}/unit.`
    };

    addInquiry(newInquiry);
    setInquiryDispatched(true);

    if (showToast) {
      showToast({
        type: 'success',
        title: 'RFQ Dispatched to Artisan Cluster',
        message: `Order requirement sent for ₹${totalVal.toLocaleString('en-IN')}`
      });
    }
  };

  // Helper to resolve card image with robust fallbacks
  const getReqImage = (req) => {
    if (req.image) return req.image;
    const name = (req.item || '').toLowerCase();
    if (name.includes('bazaar') || name.includes('basket') || name.includes('cover')) {
      return '/assets/culture/crafts/bamboo-bazaar-baskets.jpg';
    }
    if (name.includes('winnow') || name.includes('sup') || name.includes('sifter')) {
      return '/assets/culture/crafts/bamboo-winnowing-trays.jpg';
    }
    if (name.includes('mudda') || name.includes('sarkanda') || name.includes('stool')) {
      return '/assets/culture/crafts/sarkanda-mudda-stools.jpg';
    }
    if (name.includes('pankha') || name.includes('fan')) {
      return '/assets/culture/crafts/handwoven-bamboo-pankha.jpg';
    }
    if (name.includes('jar') || name.includes('storage') || name.includes('canister')) {
      return '/assets/culture/crafts/bamboo-storage-containers.jpg';
    }
    return '/assets/culture/crafts/bamboo-bazaar-baskets.jpg';
  };

  return (
    <div className="buyer-hub-page">
      <div className="container">

        {/* ======================================================== */}
        {/* 1. HERO SHOWCASE WITH AUTHENTIC CRAFT IMAGERY            */}
        {/* ======================================================== */}
        <div className="buyer-hero-card">
          <div className="buyer-hero-grid">
            {/* Left Content */}
            <div className="buyer-hero-content">
              <span className="section-eyebrow">
                <Building2 size={14} />
                DIRECT B2B WHOLESALE PROCUREMENT
              </span>
              <h1 className="serif-title">Direct B2B Sourcing from India's Master Artisans & SHG Clusters</h1>
              <p className="page-desc">
                Source GI-certified handloom, cane & bamboo basketry, sarkanda furniture, and rural folk craft at verified direct-to-artisan cluster gate prices. Zero middlemen markups.
              </p>

              {/* Live Trust Metrics Strip */}
              <div className="buyer-metrics-strip">
                <div className="b-metric">
                  <span className="b-metric-num">120+</span>
                  <span className="b-metric-lbl">Rural SHG Clusters</span>
                </div>
                <div className="b-metric">
                  <span className="b-metric-num">100%</span>
                  <span className="b-metric-lbl">Direct Cluster Gate Price</span>
                </div>
                <div className="b-metric">
                  <span className="b-metric-num">0%</span>
                  <span className="b-metric-lbl">Middlemen Markup</span>
                </div>
                <div className="b-metric">
                  <span className="b-metric-num">GI-Tagged</span>
                  <span className="b-metric-lbl">Authenticity Certified</span>
                </div>
              </div>

              <div className="buyer-action-bar">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setIsCreatingReq(true);
                    setTimeout(() => {
                      if (formRef.current) {
                        formRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 50);
                  }}
                >
                  <Plus size={18} />
                  <span>+ Create Buying Requirement</span>
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('marketplace')}
                >
                  <Search size={16} />
                  <span>Browse Full Catalog</span>
                </button>
              </div>
            </div>

            {/* Right Visual Craft Showcase */}
            <div className="buyer-hero-visual">
              <div className="hero-showcase-card primary-showcase">
                <img 
                  src="/assets/culture/crafts/bamboo-bazaar-baskets.jpg" 
                  alt="Assam Bamboo Bazaar Baskets and Food Covers"
                  className="showcase-img"
                />
                <div className="showcase-badge-pill">
                  <Award size={13} />
                  <span>Verified Assam Bamboo Guild • 1,200 Units / Mo</span>
                </div>
                <div className="showcase-caption">
                  <h4>Handwoven Conical Food Covers & Baskets</h4>
                  <p>Barpeta & Majuli Island, Assam • Direct Gate Wholesale</p>
                </div>
              </div>

              {/* Overlapping secondary authentic badge */}
              <div className="hero-showcase-card secondary-showcase">
                <img 
                  src="/assets/culture/crafts/sarkanda-mudda-stools.jpg" 
                  alt="Farrukhnagar Sarkanda Mudda Seating Stools"
                  className="mini-showcase-img"
                />
                <div className="mini-showcase-info">
                  <span className="mini-tag">HERITAGE SEATING</span>
                  <strong>Sarkanda Mudda Stools</strong>
                  <span className="mini-price">MOQ 25 units • ₹450+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. VERIFIED ARTISAN SOURCING CLUSTERS (DIRECT CATALOG)   */}
        {/* ======================================================== */}
        <section className="sourcing-clusters-section">
          <div className="section-head-row">
            <div>
              <span className="section-eyebrow">
                <Package size={14} />
                AUTHENTIC RURAL CLUSTERS READY FOR WHOLESALE ORDERS
              </span>
              <h2 className="serif-title">Verified Artisan Sourcing Clusters (Direct Bulk Quotations)</h2>
              <p className="section-desc">
                Click <strong>"Request Bulk Quote"</strong> on any cluster below to instantly pre-fill an enterprise RFQ with factory-gate pricing.
              </p>
            </div>
            <span className="badge badge-gi" style={{ alignSelf: 'center' }}>
              ✓ All Clusters GI & Fair-Wage Verified
            </span>
          </div>

          <div className="clusters-catalog-grid">
            {sourcingClusters.map((cluster) => (
              <div key={cluster.id} className="cluster-card">
                <div className="cluster-image-wrapper">
                  <img 
                    src={cluster.image} 
                    alt={cluster.name} 
                    className="cluster-img"
                    loading="lazy" 
                  />
                  <div className="cluster-gi-tag">
                    <ShieldCheck size={13} />
                    <span>GI Certified Producer</span>
                  </div>
                  <div className="cluster-moq-tag">
                    <span>MOQ: {cluster.moq}</span>
                  </div>
                </div>

                <div className="cluster-body">
                  <div className="cluster-craft-type">{cluster.craft}</div>
                  <h3 className="cluster-title">{cluster.name}</h3>
                  {cluster.hindiName && (
                    <span className="cluster-hindi-name">{cluster.hindiName}</span>
                  )}

                  <div className="cluster-location-row">
                    <MapPin size={13} color="var(--primary)" />
                    <span>{cluster.region}</span>
                  </div>

                  <p className="cluster-speciality-text">{cluster.speciality}</p>

                  <div className="cluster-specs-table">
                    <div className="c-spec-row">
                      <span>Wholesale Band:</span>
                      <strong className="price-highlight">{cluster.priceBand} / unit</strong>
                    </div>
                    <div className="c-spec-row">
                      <span>Monthly Output:</span>
                      <strong>{cluster.capacity}</strong>
                    </div>
                    <div className="c-spec-row">
                      <span>Lead Dispatch:</span>
                      <strong>{cluster.leadTime}</strong>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-cluster-rfq"
                    onClick={() => handlePreFillRfq(cluster)}
                  >
                    <Plus size={16} />
                    <span>Request Bulk Quote (RFQ)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. CREATE REQUIREMENT MODAL / EXPANDABLE FORM            */}
        {/* ======================================================== */}
        {isCreatingReq && (
          <div className="card req-form-card" ref={formRef}>
            <div className="req-header">
              <div className="req-title-group">
                <Sparkles size={22} color="var(--primary)" />
                <div>
                  <h3>{t('createRequirementHeading') || "Create B2B Wholesale Requirement (RFQ)"}</h3>
                  <p className="req-subtitle">Configure order specifications to instantly match verified master artisans and rural SHG clusters.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsCreatingReq(false)}>×</button>
            </div>

            <div className="req-form-grid">
              <div className="form-group form-group-span-2">
                <label>{t('reqItemLabel') || "Craft Product / Sourcing Requirement"}</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Handwoven Bamboo Food Covers, Mudda Stools, Winnowing Trays"
                />
              </div>

              <div className="form-group">
                <label>{t('reqQtyLabel') || "Quantity (Units)"}</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>{t('reqBudgetLabel') || "Target Price / Unit (₹)"}</label>
                <input 
                  type="number" 
                  value={targetBudget}
                  onChange={e => setTargetBudget(e.target.value)}
                  min="10"
                />
              </div>

              <div className="form-group">
                <label>{t('reqCityLabel') || "Delivery Destination City"}</label>
                <input 
                  type="text" 
                  value={deliveryCity}
                  onChange={e => setDeliveryCity(e.target.value)}
                  placeholder="e.g. Mumbai, New Delhi, Bengaluru, London"
                />
              </div>

              <div className="form-group">
                <label>{t('reqTimelineLabel') || "Delivery Timeline (Days)"}</label>
                <input 
                  type="number" 
                  value={timelineDays}
                  onChange={e => setTimelineDays(e.target.value)}
                  min="7"
                />
              </div>
            </div>

            {/* Estimated Tender Total */}
            <div className="tender-estimate-strip">
              <div className="est-box">
                <span className="est-lbl">Estimated Total Tender Value:</span>
                <strong className="est-val">₹{(Number(quantity || 0) * Number(targetBudget || 0)).toLocaleString('en-IN')}</strong>
              </div>
              <div className="est-meta">
                <span>Direct cluster escrow • Zero middlemen deductions • GI certification guaranteed</span>
              </div>
            </div>

            <div className="req-submit-row">
              <button 
                className="btn btn-voice"
                onClick={handleRunAiMatch}
                disabled={isMatching}
              >
                <Sparkles size={18} />
                <span>{isMatching ? "Calculating 6-Factor Cluster Compatibility..." : "Run AI Cluster Match Algorithm →"}</span>
              </button>
            </div>

            {/* AI Matching Animation */}
            {isMatching && (
              <div className="ai-matching-indicator">
                <div className="matching-spinner" />
                <div className="factors-list">
                  <span>✓ Checking Craft Lineage & GI Registry</span>
                  <span>✓ Analyzing Monthly Production Capacity (Req: {quantity} units)</span>
                  <span>✓ Benchmarking Fair-Wage Price Bands (Target: ₹{targetBudget}/unit)</span>
                  <span>✓ Verifying Raw Material Sourcing & Transport Logistics</span>
                </div>
              </div>
            )}

            {/* Match Results Display */}
            {matchDone && (
              <div className="best-match-result-card">
                <div className="match-score-badge">
                  <span className="score-num">96%</span>
                  <span className="score-lbl">AI Match Compatibility</span>
                </div>

                <div className="matched-artisan-details">
                  <span className="cluster-badge">RECOMMENDED ARTISAN CLUSTER</span>
                  <h4>Majuli Island & Barpeta Bamboo Guild</h4>
                  <p className="cluster-loc">Brahmaputra Craft Basin, Assam • Verified GI Producer Collective</p>

                  <div className="match-specs-grid">
                    <div className="m-spec">
                      <span>Monthly Capacity:</span>
                      <strong>1,200 Units / Month</strong>
                    </div>
                    <div className="m-spec">
                      <span>Artisan Unit Price:</span>
                      <strong>₹{Math.max(80, Math.round((targetBudget || 250) * 0.95))} – ₹{targetBudget || 250} / unit</strong>
                    </div>
                    <div className="m-spec">
                      <span>Production Lead Time:</span>
                      <strong>{timelineDays || 30} Days (Full Dispatch Ready)</strong>
                    </div>
                    <div className="m-spec">
                      <span>Authenticity:</span>
                      <strong>100% Biodegradable GI Handcraft</strong>
                    </div>
                  </div>

                  {inquiryDispatched ? (
                    <div className="inquiry-dispatched-success">
                      <CheckCircle2 size={24} />
                      <div>
                        <h5>Purchase Opportunity Dispatched Directly to Rural Artisan Cluster!</h5>
                        <p>Artisan master weaver and cluster managers have been notified via SMS and mother-tongue voice assistant.</p>
                      </div>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => navigate('marketplace')}
                      >
                        Browse More Crafts →
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary dispatch-inquiry-btn"
                      onClick={handleDispatchInquiry}
                    >
                      <Send size={16} />
                      <span>{t('sendInquiryBtn') || "Dispatch Purchase Order"} (Total ₹{(Number(quantity || 0) * Number(targetBudget || 0)).toLocaleString('en-IN')})</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. ACTIVE B2B PROCUREMENT PIPELINES                      */}
        {/* ======================================================== */}
        <section className="existing-reqs-section">
          <div className="section-head-row">
            <div>
              <span className="section-eyebrow">
                <Briefcase size={14} />
                LIVE PROCUREMENT TENDERS
              </span>
              <h2 className="serif-title">Active B2B Procurement Pipelines</h2>
              <p className="section-desc">Real-time enterprise wholesale tenders currently active across rural craft clusters.</p>
            </div>
          </div>

          <div className="reqs-grid">
            {buyerRequirements.map(req => {
              const reqImg = getReqImage(req);
              const totalTenderVal = (Number(req.quantity) || 1) * (Number(req.budgetPerUnit) || 0);

              return (
                <div key={req.id} className="req-card">
                  <div className="req-card-img-wrap">
                    <img 
                      src={reqImg} 
                      alt={req.item} 
                      className="req-img" 
                      loading="lazy"
                    />
                    <span className="req-status-pill">{req.status || 'Active Matching'}</span>
                  </div>

                  <div className="req-card-body">
                    <div className="req-card-top">
                      <span className="company-name">{req.buyerCompany}</span>
                      <span className="match-tag">{req.matchScore || 92}% Matched</span>
                    </div>

                    <h3 className="req-item-name">{req.item}</h3>

                    <div className="req-specs-list">
                      <div className="spec-row">
                        <span className="spec-label">Order Volume:</span>
                        <strong>{Number(req.quantity || 0).toLocaleString('en-IN')} units</strong>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Unit Budget:</span>
                        <strong>₹{req.budgetPerUnit} / unit</strong>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Total Value:</span>
                        <strong className="val-highlight">₹{totalTenderVal.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Destination:</span>
                        <span>{req.location}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-label">Matched Cluster:</span>
                        <strong className="cluster-highlight">{req.matchedArtisan}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      <style>{`
        .buyer-hub-page {
          padding: 36px 0 96px;
          min-height: calc(100vh - 72px);
          background: var(--bg-main);
        }

        /* ---------------------------------------------------- */
        /* HERO SECTION                                         */
        /* ---------------------------------------------------- */
        .buyer-hero-card {
          background: linear-gradient(135deg, #1B2A4A 0%, #101B2E 100%);
          border-radius: var(--radius-lg);
          padding: 44px 36px;
          color: #FFFFFF;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(18, 29, 51, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .buyer-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 36px;
          align-items: center;
        }
        @media (max-width: 960px) {
          .buyer-hero-grid {
            grid-template-columns: 1fr;
          }
        }
        .buyer-hero-content {
          max-width: 680px;
        }
        .buyer-hero-card h1 {
          color: #FFFFFF;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          margin: 12px 0 14px;
          line-height: 1.18;
          font-family: var(--font-serif);
        }
        .buyer-hero-card .page-desc {
          color: #CBD5E1;
          font-size: 1.02rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .buyer-metrics-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 28px;
        }
        @media (max-width: 640px) {
          .buyer-metrics-strip {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .b-metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .b-metric-num {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
        }
        .b-metric-lbl {
          font-size: 0.72rem;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .buyer-action-bar {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* Hero Visual Right Side */
        .buyer-hero-visual {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .primary-showcase {
          position: relative;
          width: 100%;
          height: 280px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .showcase-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .primary-showcase:hover .showcase-img {
          transform: scale(1.03);
        }
        .showcase-badge-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #F8FAFC;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .showcase-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(180deg, transparent 0%, rgba(10, 15, 26, 0.95) 100%);
          color: #FFFFFF;
        }
        .showcase-caption h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .showcase-caption p {
          font-size: 0.78rem;
          color: #CBD5E1;
        }

        .secondary-showcase {
          position: absolute;
          bottom: -24px;
          right: -12px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          color: #1E293B;
          padding: 8px 14px 8px 8px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-medium);
          animation: floatSlow 4s ease-in-out infinite;
        }
        @media (max-width: 960px) {
          .secondary-showcase {
            position: relative;
            bottom: auto;
            right: auto;
            margin-top: 16px;
            width: 100%;
          }
        }
        .mini-showcase-img {
          width: 54px;
          height: 54px;
          border-radius: 8px;
          object-fit: cover;
        }
        .mini-showcase-info {
          display: flex;
          flex-direction: column;
        }
        .mini-tag {
          font-size: 0.65rem;
          color: var(--primary);
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .mini-showcase-info strong {
          font-size: 0.88rem;
          color: #0F172A;
        }
        .mini-price {
          font-size: 0.75rem;
          color: #64748B;
        }

        /* ---------------------------------------------------- */
        /* SOURCING CLUSTERS DIRECTORY SECTION                  */
        /* ---------------------------------------------------- */
        .sourcing-clusters-section {
          margin-bottom: 56px;
        }
        .section-head-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .section-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-top: 4px;
        }
        .clusters-catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .cluster-card {
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        .cluster-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-color: rgba(169, 84, 58, 0.3);
        }
        .cluster-image-wrapper {
          position: relative;
          height: 220px;
          background: #F1F5F9;
          overflow: hidden;
        }
        .cluster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .cluster-card:hover .cluster-img {
          transform: scale(1.04);
        }
        .cluster-gi-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(6px);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .cluster-moq-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(169, 84, 58, 0.9);
          backdrop-filter: blur(6px);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .cluster-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .cluster-craft-type {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }
        .cluster-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          line-height: 1.25;
        }
        .cluster-hindi-name {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 10px;
          display: block;
        }
        .cluster-location-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          color: var(--secondary);
          font-weight: 600;
          margin-bottom: 12px;
        }
        .cluster-speciality-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }
        .cluster-specs-table {
          background: #F8FAFC;
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
          font-size: 0.82rem;
          border: 1px solid var(--border-light);
        }
        .c-spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .c-spec-row span {
          color: var(--text-muted);
        }
        .c-spec-row strong {
          color: var(--text-primary);
        }
        .price-highlight {
          color: #059669 !important;
          font-weight: 800;
        }
        .btn-cluster-rfq {
          width: 100%;
          justify-content: center;
          font-weight: 700;
        }

        /* ---------------------------------------------------- */
        /* CREATE REQUIREMENT CARD                              */
        /* ---------------------------------------------------- */
        .req-form-card {
          margin-bottom: 48px;
          border: 1px solid var(--border-medium);
          padding: 36px;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          animation: modalIn 0.25s ease;
        }
        .req-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .req-title-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .req-title-group h3 {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .req-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }
        .req-form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }
        @media (max-width: 860px) {
          .req-form-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-group-span-2 {
          grid-column: span 2;
        }
        @media (max-width: 860px) {
          .form-group-span-2 {
            grid-column: span 1;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .form-group input {
          padding: 12px 14px;
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(169, 84, 58, 0.15);
        }
        .tender-estimate-strip {
          background: #FAF7EE;
          border: 1px solid rgba(169, 84, 58, 0.25);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .est-box {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .est-lbl {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .est-val {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary);
        }
        .est-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .req-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        .ai-matching-indicator {
          background: #F8FAFC;
          border: 1px solid var(--border-light);
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 16px;
        }
        .matching-spinner {
          width: 44px;
          height: 44px;
          border: 4px solid var(--border-medium);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .factors-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--secondary);
          font-weight: 600;
        }
        .best-match-result-card {
          background: linear-gradient(135deg, #FAF7EE 0%, #F5EDE0 100%);
          border: 1px solid rgba(169, 84, 58, 0.3);
          border-radius: 12px;
          padding: 28px;
          display: flex;
          gap: 28px;
          margin-top: 24px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .match-score-badge {
          background: #FFFFFF;
          border: 2px solid var(--primary);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          min-width: 120px;
        }
        .score-num {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          display: block;
          line-height: 1;
        }
        .score-lbl {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .matched-artisan-details {
          flex: 1;
        }
        .cluster-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.1em;
        }
        .matched-artisan-details h4 {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--text-primary);
          margin: 4px 0;
        }
        .cluster-loc {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .match-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
          font-size: 0.88rem;
        }
        .m-spec span {
          color: var(--text-muted);
          margin-right: 6px;
        }
        .m-spec strong {
          color: var(--text-primary);
        }
        .dispatch-inquiry-btn {
          margin-top: 8px;
        }
        .inquiry-dispatched-success {
          background: var(--accent-green-light);
          border: 1px solid rgba(46, 125, 50, 0.3);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: var(--accent-green);
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .inquiry-dispatched-success h5 {
          font-size: 1rem;
          margin-bottom: 2px;
        }
        .inquiry-dispatched-success p {
          font-size: 0.85rem;
        }

        /* ---------------------------------------------------- */
        /* ACTIVE PROCUREMENT PIPELINES GRID                    */
        /* ---------------------------------------------------- */
        .existing-reqs-section h2 {
          margin-bottom: 6px;
        }
        .reqs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
          gap: 24px;
        }
        @media (max-width: 640px) {
          .reqs-grid {
            grid-template-columns: 1fr;
          }
        }
        .req-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: row;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        @media (max-width: 520px) {
          .req-card {
            flex-direction: column;
          }
        }
        .req-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
        }
        .req-card-img-wrap {
          position: relative;
          width: 140px;
          min-width: 140px;
          background: #F1F5F9;
        }
        @media (max-width: 520px) {
          .req-card-img-wrap {
            width: 100%;
            height: 160px;
          }
        }
        .req-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .req-status-pill {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .req-card-body {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .req-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .company-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--secondary);
        }
        .match-tag {
          background: var(--accent-green-light);
          color: var(--accent-green);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .req-item-name {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .req-specs-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
        }
        .spec-label {
          color: var(--text-muted);
        }
        .val-highlight {
          color: #059669;
          font-weight: 800;
        }
        .cluster-highlight {
          color: var(--primary);
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
