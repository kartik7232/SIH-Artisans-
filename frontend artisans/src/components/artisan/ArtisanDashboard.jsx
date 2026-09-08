import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Camera, 
  Sparkles, 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  Clock,
  Layers,
  Send,
  X
} from 'lucide-react';

export default function ArtisanDashboard() {
  const { t, speak, lang } = useLanguage();
  const { navigate, inquiries, productsList, openAssistant, currentUser } = useApp();

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseSent, setResponseSent] = useState(false);

  const activeInquiry = inquiries[0];

  const handleOpenInquiry = () => {
    setSelectedInquiry(activeInquiry);
    setResponseSent(false);
  };

  const handleSendResponse = () => {
    setResponseSent(true);
    setTimeout(() => {
      setSelectedInquiry(null);
      setResponseSent(false);
    }, 1800);
  };

  const displayName = currentUser?.name || 'Meena Devi';
  const displayCluster = currentUser?.clusterOrCompany || 'Chanderi Handloom Cluster, MP • Master Weaver #MP-8201';

  return (
    <div className="artisan-dashboard-page">
      <div className="container">
        {/* Header Greeting Bar */}
        <div className="artisan-header-banner">
          <div className="greeting-text">
            <div className="artisan-identity-pill-wrap">
              <span className="artisan-live-chip">🧵 SELLER / MASTER ARTISAN</span>
              <span className="artisan-gi-chip">✨ GI AUTHENTICATED #MP-8201</span>
            </div>
            <h1>{lang === 'hi' ? `नमस्ते, ${displayName} जी` : `Namaste, ${displayName}`}</h1>
            <p>{displayCluster}</p>
          </div>
          <button 
            className="btn btn-voice"
            onClick={() => navigate('studio')}
          >
            <Camera size={18} />
            <span>{t('createProductCta') || '+ Create New Product with AI'}</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-main-grid">
          {/* Left Column: Readiness, Inquiries, AI Insights */}
          <div className="dashboard-col-primary">
            {/* Shop Readiness Card */}
            <div className="card readiness-card">
              <div className="readiness-header">
                <div>
                  <span className="card-tag">DIGITAL SHOP STATUS</span>
                  <h3 className="readiness-title">{t('shopReadiness')}</h3>
                </div>
                <div className="readiness-percentage">82%</div>
              </div>

              {/* Visual Progress Bar */}
              <div className="progress-bar-wrap">
                <div className="progress-fill" style={{ width: '82%' }} />
              </div>

              <p className="readiness-desc">{t('shopReadinessDesc')}</p>

              <div className="readiness-checklist">
                <div className="check-item done">
                  <CheckCircle2 size={16} />
                  <span>Profile & Bio Verified (Hindi + English)</span>
                </div>
                <div className="check-item done">
                  <CheckCircle2 size={16} />
                  <span>GI Craft Certification Attached</span>
                </div>
                <div className="check-item pending">
                  <AlertCircle size={16} />
                  <span>1 Product Draft pending AI photo enhancement</span>
                </div>
              </div>

              <div className="readiness-action">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('studio')}
                >
                  <span>Complete Pending Draft</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Buyer Inquiry Card */}
            {activeInquiry ? (
              <div className="card inquiry-card">
                <div className="inquiry-badge-row">
                  <span className="inquiry-live-badge">
                    <span className="live-dot">●</span>
                    {t('newInquiryAlert') || 'New B2B Buyer Inquiry'}
                  </span>
                  <span className="inquiry-time">{activeInquiry.timestamp || '2 hours ago'}</span>
                </div>

                <div className="inquiry-body">
                  <div className="buyer-avatar">🏢</div>
                  <div className="buyer-info">
                    <h4>{activeInquiry.buyerName || 'Verified Corporate Buyer'}</h4>
                    <p className="inquiry-product">{activeInquiry.productName || 'Artisan Craftwork'}</p>
                    <div className="inquiry-stats-row">
                      <span className="qty-tag">Quantity: <strong>{activeInquiry.quantity || 100} Units</strong></span>
                      <span className="val-tag">Target: <strong>₹{activeInquiry.targetPrice || 500}/unit</strong></span>
                      <span className="tot-tag">Value: <strong>₹{Number(activeInquiry.totalValue || 0).toLocaleString()}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="inquiry-footer">
                  <button 
                    className="btn btn-accent"
                    onClick={handleOpenInquiry}
                  >
                    <MessageSquare size={16} />
                    <span>{t('viewInquiryBtn') || 'View & Respond'}</span>
                  </button>
                  <span className="inquiry-note">Timeline: {activeInquiry.timeline || '30 Days'}</span>
                </div>
              </div>
            ) : null}

            {/* AI Business Suggestion Card */}
            <div className="card ai-suggestion-card">
              <div className="suggestion-icon-wrap">
                <Sparkles size={22} />
              </div>
              <div className="suggestion-content">
                <div className="suggestion-tag">AI BUSINESS INSIGHT</div>
                <h4>{t('aiSuggestionTitle')}</h4>
                <p>{t('aiSuggestionDesc')}</p>
                <div className="suggestion-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('studio')}
                  >
                    <span>{t('improveWithAiBtn')}</span>
                    <ArrowRight size={14} />
                  </button>
                  <button 
                    className="ask-advisor-btn"
                    onClick={() => openAssistant("How do I improve lighting for my Chanderi saree photos?")}
                  >
                    ✨ Ask Assistant for Tips
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inventory Snapshot, Performance */}
          <div className="dashboard-col-secondary">
            {/* Products Summary Card */}
            <div className="card summary-card">
              <div className="summary-header">
                <h3>{t('myProductsTitle')}</h3>
                <button 
                  className="link-btn"
                  onClick={() => navigate('inventory')}
                >
                  View All ({productsList.length}) →
                </button>
              </div>

              <div className="summary-metrics-grid">
                <div className="metric-box">
                  <span className="metric-val">{productsList.length}</span>
                  <span className="metric-lbl">Total Crafts</span>
                </div>
                <div className="metric-box">
                  <span className="metric-val text-success">18</span>
                  <span className="metric-lbl">Published</span>
                </div>
                <div className="metric-box">
                  <span className="metric-val text-warning">4</span>
                  <span className="metric-lbl">Drafts</span>
                </div>
                <div className="metric-box">
                  <span className="metric-val text-danger">2</span>
                  <span className="metric-lbl">Attention</span>
                </div>
              </div>

              {/* Quick Products Mini List */}
              <div className="mini-products-list">
                <div className="mini-product-item">
                  <img 
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=160&q=80" 
                    alt="Chanderi Saree" 
                  />
                  <div className="mini-item-info">
                    <h5>Handwoven Chanderi Silk Saree</h5>
                    <span className="mini-price">₹1,650 • 12 in stock</span>
                  </div>
                  <span className="status-dot green" title="Live in marketplace">● Live</span>
                </div>

                <div className="mini-product-item">
                  <img 
                    src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=160&q=80" 
                    alt="Blue Dupatta" 
                  />
                  <div className="mini-item-info">
                    <h5>Indigo Block Print Dupatta</h5>
                    <span className="mini-price">₹850 • 25 in stock</span>
                  </div>
                  <span className="status-dot green" title="Live in marketplace">● Live</span>
                </div>

                <div className="mini-product-item attention">
                  <img 
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=160&q=80" 
                    alt="Raw Silk Fabric" 
                  />
                  <div className="mini-item-info">
                    <h5>Raw Tussar Silk Stole</h5>
                    <span className="mini-price">Draft • Needs Lighting Fix</span>
                  </div>
                  <button 
                    className="quick-fix-btn"
                    onClick={() => navigate('studio')}
                  >
                    Fix with AI
                  </button>
                </div>
              </div>

              <button 
                className="btn btn-secondary full-width"
                onClick={() => navigate('inventory')}
              >
                Manage Full Inventory & Stock
              </button>
            </div>

            {/* Performance Snapshot */}
            <div className="card performance-card">
              <span className="card-tag">30-DAY PERFORMANCE</span>
              <div className="perf-row">
                <div className="perf-item">
                  <Eye size={18} className="perf-icon" />
                  <span className="perf-num">842</span>
                  <span className="perf-label">Catalog Views</span>
                </div>
                <div className="perf-item">
                  <MessageSquare size={18} className="perf-icon" />
                  <span className="perf-num">12</span>
                  <span className="perf-label">Buyer Leads</span>
                </div>
                <div className="perf-item">
                  <ShoppingBag size={18} className="perf-icon" />
                  <span className="perf-num">4</span>
                  <span className="perf-label">B2B Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Detail & Response Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Building2 size={20} className="modal-icon" />
                <h3>B2B Wholesale Buyer Inquiry</h3>
              </div>
              <button className="close-btn" onClick={() => setSelectedInquiry(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="inquiry-detail-header">
                <h4>{selectedInquiry.buyerName}</h4>
                <p className="buyer-loc">{selectedInquiry.buyerLocation}</p>
                <div className="inquiry-badges">
                  <span className="badge badge-gi">Verified Export Buyer</span>
                  <span className="badge badge-ai">92% Artisan Compatibility</span>
                </div>
              </div>

              <div className="inquiry-order-box">
                <div className="order-box-row">
                  <span>Product Required:</span>
                  <strong>{selectedInquiry.productName}</strong>
                </div>
                <div className="order-box-row">
                  <span>Quantity:</span>
                  <strong>{selectedInquiry.quantity} Units</strong>
                </div>
                <div className="order-box-row">
                  <span>Target Unit Price:</span>
                  <strong>₹{selectedInquiry.targetPrice} / unit</strong>
                </div>
                <div className="order-box-row highlight">
                  <span>Total Order Value:</span>
                  <strong>₹{Number(selectedInquiry?.totalValue || 0).toLocaleString()}</strong>
                </div>
                <div className="order-box-row">
                  <span>Delivery Timeline:</span>
                  <strong>{selectedInquiry.timeline}</strong>
                </div>
              </div>

              <div className="inquiry-message">
                <h5>Buyer Specifications:</h5>
                <p>"{selectedInquiry.message}"</p>
              </div>

              {responseSent ? (
                <div className="response-success-alert">
                  <CheckCircle2 size={24} />
                  <span>Offer and Production Acceptance dispatched to buyer! They will connect on your verified WhatsApp.</span>
                </div>
              ) : (
                <div className="response-action-box">
                  <label>{lang === 'hi' ? 'त्वरित कारीगर उत्तर (आवाज़ से या एक क्लिक से उत्तर दें):' : 'Quick Artisan Response (Click or Speak to Reply):'}</label>
                  <div className="preset-responses">
                    <button className="preset-btn selected">✓ We accept order at ₹200/unit (30 days delivery)</button>
                    <button className="preset-btn">✓ We can supply 300 units immediately</button>
                  </div>
                  <div className="modal-footer-btns">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setSelectedInquiry(null)}
                    >
                      Dismiss
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSendResponse}
                    >
                      <Send size={16} />
                      <span>Accept & Confirm Capacity</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .artisan-dashboard-page {
          padding: 40px 0 80px;
          background: var(--bg-main);
          min-height: calc(100vh - 72px);
        }
        .artisan-header-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .artisan-identity-pill-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .artisan-live-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(169, 84, 58, 0.12);
          color: #A9543A;
          border: 1px solid rgba(169, 84, 58, 0.25);
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .artisan-gi-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(197, 154, 63, 0.12);
          color: #926C15;
          border: 1px solid rgba(197, 154, 63, 0.3);
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .greeting-text h1 {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          color: var(--text-primary);
          line-height: 1.15;
          margin-bottom: 4px;
        }
        .greeting-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 28px;
        }
        @media (max-width: 960px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .dashboard-col-primary, .dashboard-col-secondary {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .card-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .readiness-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #FDFCF9 100%);
        }
        .readiness-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .readiness-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--text-primary);
        }
        .readiness-percentage {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
        }
        .progress-bar-wrap {
          height: 10px;
          background: var(--bg-subtle);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C59A3F 0%, #A9543A 100%);
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .readiness-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .readiness-checklist {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          padding: 8px 12px;
          border-radius: 6px;
          background: var(--bg-subtle);
        }
        .check-item.done {
          color: var(--accent-green);
        }
        .check-item.pending {
          color: #D97706;
          background: #FEF3C7;
        }
        .inquiry-card {
          border-left: 4px solid var(--secondary);
        }
        .inquiry-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .inquiry-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--secondary-light);
          color: var(--secondary);
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .live-dot {
          color: #E53935;
          animation: blink 1s infinite;
        }
        .inquiry-time {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .inquiry-body {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }
        .buyer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: var(--secondary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .buyer-info h4 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .inquiry-product {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }
        .inquiry-stats-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .inquiry-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
          flex-wrap: wrap;
          gap: 12px;
        }
        .inquiry-note {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .ai-suggestion-card {
          background: linear-gradient(135deg, #FAF7F0 0%, #F5EFE4 100%);
          border: 1px dashed rgba(169, 84, 58, 0.4);
          display: flex;
          gap: 20px;
        }
        .suggestion-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .suggestion-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .suggestion-content h4 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .suggestion-content p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .suggestion-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ask-advisor-btn {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--secondary);
          text-decoration: underline;
        }
        .summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .summary-header h3 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
        }
        .link-btn {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--primary);
        }
        .summary-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .metric-box {
          background: var(--bg-subtle);
          border-radius: 8px;
          padding: 12px 8px;
          text-align: center;
        }
        .metric-val {
          font-size: 1.3rem;
          font-weight: 800;
          display: block;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .metric-lbl {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .text-success { color: var(--accent-green); }
        .text-warning { color: #D97706; }
        .text-danger { color: #DC2626; }

        .mini-products-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .mini-product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 8px;
          background: var(--bg-subtle);
        }
        .mini-product-item img {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: cover;
        }
        .mini-item-info {
          flex: 1;
        }
        .mini-item-info h5 {
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .mini-price {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .status-dot.green {
          font-size: 0.75rem;
          color: var(--accent-green);
          font-weight: 700;
        }
        .quick-fix-btn {
          background: var(--primary);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .full-width {
          width: 100%;
        }
        .performance-card {
          text-align: center;
        }
        .perf-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        .perf-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .perf-icon {
          color: var(--primary);
          margin-bottom: 6px;
        }
        .perf-num {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .perf-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-light);
        }
        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .modal-icon {
          color: var(--secondary);
        }
        .modal-body {
          padding: 24px;
        }
        .inquiry-detail-header {
          margin-bottom: 20px;
        }
        .inquiry-detail-header h4 {
          font-size: 1.3rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .buyer-loc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .inquiry-badges {
          display: flex;
          gap: 8px;
        }
        .inquiry-order-box {
          background: var(--bg-subtle);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .order-box-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .order-box-row.highlight {
          border-top: 1px solid var(--border-medium);
          padding-top: 8px;
          font-size: 1.05rem;
          color: var(--primary);
        }
        .inquiry-message {
          margin-bottom: 24px;
        }
        .inquiry-message h5 {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .inquiry-message p {
          font-size: 0.92rem;
          color: var(--text-primary);
          font-style: italic;
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          padding: 12px;
          border-radius: 6px;
        }
        .preset-responses {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 8px 0 20px;
        }
        .preset-btn {
          text-align: left;
          padding: 10px 14px;
          border: 1px solid var(--border-medium);
          border-radius: 6px;
          font-size: 0.88rem;
          color: var(--text-primary);
          background: #FFFFFF;
        }
        .preset-btn.selected {
          border-color: var(--primary);
          background: var(--primary-light);
          font-weight: 600;
        }
        .modal-footer-btns {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .response-success-alert {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--accent-green-light);
          color: var(--accent-green);
          padding: 16px;
          border-radius: 8px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
