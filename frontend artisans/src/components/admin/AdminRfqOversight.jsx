import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  Download, 
  Filter, 
  Users, 
  ChevronDown, 
  Check, 
  X,
  FileText,
  MapPin
} from 'lucide-react';
import storageService from '../../services/storageService';

export default function AdminRfqOversight() {
  const { buyerRequirements, setBuyerRequirements, inquiries, setInquiries, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('rfqs'); // 'rfqs' | 'inquiries'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState(null);

  // Pipeline Financial Metrics
  const metrics = useMemo(() => {
    const totalPipelineValue = buyerRequirements.reduce(
      (acc, r) => acc + ((r.quantity || 1) * (r.budgetPerUnit || 0)), 
      0
    );

    const inquiriesValue = inquiries.reduce(
      (acc, i) => acc + (i.totalValue || ((i.quantity || 1) * (i.targetPrice || 0))), 
      0
    );

    const avgScore = buyerRequirements.length > 0 
      ? Math.round(buyerRequirements.reduce((acc, r) => acc + (r.matchScore || 85), 0) / buyerRequirements.length)
      : 0;

    const closedCount = buyerRequirements.filter(r => r.status === 'Contract Closed').length;

    return {
      totalPipeline: `₹${((totalPipelineValue + inquiriesValue) / 100000).toFixed(2)} Lakh`,
      activeTenders: buyerRequirements.length,
      directInquiries: inquiries.length,
      avgMatchScore: `${avgScore}%`,
      closedDeals: closedCount
    };
  }, [buyerRequirements, inquiries]);

  // Filtered RFQs
  const filteredRFQs = useMemo(() => {
    return buyerRequirements.filter(rfq => {
      const company = (rfq.buyerCompany || '').toLowerCase();
      const item = (rfq.item || '').toLowerCase();
      const artisan = (rfq.matchedArtisan || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || company.includes(query) || item.includes(query) || artisan.includes(query);
      const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [buyerRequirements, searchQuery, statusFilter]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const buyer = (inq.buyerName || '').toLowerCase();
      const prod = (inq.productName || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      return !query || buyer.includes(query) || prod.includes(query);
    });
  }, [inquiries, searchQuery]);

  // Admin Actions for RFQs
  const updateRfqStatus = (rfqId, newStatus) => {
    const updated = buyerRequirements.map(r => {
      if (r.id === rfqId) {
        const item = { ...r, status: newStatus };
        storageService.saveBuyerRequirement(item);
        return item;
      }
      return r;
    });
    setBuyerRequirements(updated);
    showToast({
      type: 'success',
      title: 'Tender Status Updated',
      message: `RFQ status updated to "${newStatus}".`
    });
  };

  const reassignArtisanCluster = (rfqId) => {
    const newCluster = window.prompt("Enter new artisan cluster / SHG name for this requirement:");
    if (newCluster && newCluster.trim()) {
      const updated = buyerRequirements.map(r => {
        if (r.id === rfqId) {
          const item = { ...r, matchedArtisan: newCluster.trim(), matchScore: Math.floor(Math.random() * 10) + 90 };
          storageService.saveBuyerRequirement(item);
          return item;
        }
        return r;
      });
      setBuyerRequirements(updated);
      showToast({
        type: 'success',
        title: 'Artisan Reassigned',
        message: `Requirement matched with "${newCluster.trim()}".`
      });
    }
  };

  const exportRfqReport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      pipelineMetrics: metrics,
      activeRequirements: buyerRequirements,
      directInquiries: inquiries
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `karigar_b2b_rfq_pipeline_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();

    showToast({
      type: 'success',
      title: 'Pipeline Exported',
      message: 'B2B RFQ pipeline data downloaded.'
    });
  };

  return (
    <div className="admin-rfq-page" style={{ padding: '32px 24px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.06em', color: '#2563EB', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Building2 size={16} />
            <span>B2B WHOLESALE & PROCUREMENT OVERSIGHT</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif, "Cinzel", serif)', fontSize: '2rem', color: '#1B2A4A', margin: 0, fontWeight: 700 }}>
            Enterprise B2B RFQ Oversight & Tender Pipeline
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '6px 0 0 0' }}>
            Audit bulk buyer purchase orders, verify artisan cluster match accuracy, and oversee direct buyer-to-artisan transactions across India.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={exportRfqReport}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: '600' }}
          >
            <Download size={16} />
            <span>Export RFQ Manifest</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>Total Pipeline Value</span>
            <IndianRupee size={18} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E40AF', marginTop: '8px' }}>
            {metrics.totalPipeline}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '4px', fontWeight: '600' }}>
            ● Active wholesale & bulk tender demand
          </div>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>Active Enterprise RFQs</span>
            <Building2 size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#065F46', marginTop: '8px' }}>
            {metrics.activeTenders} Tenders
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
            Verified institutional buyers
          </div>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>Cluster Match Accuracy</span>
            <CheckCircle2 size={18} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#92400E', marginTop: '8px' }}>
            {metrics.avgMatchScore}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#D97706', marginTop: '4px', fontWeight: '600' }}>
            AI craft & capacity match score
          </div>
        </div>

        <div className="admin-kpi-card glass-panel" style={{ padding: '20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(169, 84, 58, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.84rem', fontWeight: '600' }}>
            <span>Direct Inquiries Log</span>
            <MessageSquare size={18} color="#A9543A" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1B2A4A', marginTop: '8px' }}>
            {metrics.directInquiries} Inquiries
          </div>
          <div style={{ fontSize: '0.78rem', color: '#A9543A', marginTop: '4px', fontWeight: '600' }}>
            Artisan direct communications
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #E2E8F0', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('rfqs')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            fontWeight: '700',
            fontSize: '0.92rem',
            cursor: 'pointer',
            color: activeTab === 'rfqs' ? '#2563EB' : '#64748B',
            borderBottom: activeTab === 'rfqs' ? '3px solid #2563EB' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} />
          <span>Active B2B Bulk Tenders ({buyerRequirements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'transparent',
            fontWeight: '700',
            fontSize: '0.92rem',
            cursor: 'pointer',
            color: activeTab === 'inquiries' ? '#2563EB' : '#64748B',
            borderBottom: activeTab === 'inquiries' ? '3px solid #2563EB' : '3px solid transparent',
            marginBottom: '-2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <MessageSquare size={16} />
          <span>Buyer Direct Inquiries Log ({inquiries.length})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.98)', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text" 
            placeholder={activeTab === 'rfqs' ? "Search by buyer company, item, or artisan cluster..." : "Search inquiries by buyer or product..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 42px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none' }}
          />
        </div>

        {activeTab === 'rfqs' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '0.85rem', color: '#1B2A4A', outline: 'none' }}
            >
              <option value="all">All Tender Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Negotiation">Under Negotiation</option>
              <option value="Contract Closed">Contract Closed</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: B2B Bulk Tenders Table */}
      {activeTab === 'rfqs' && (
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 18px' }}>Buyer Company</th>
                  <th style={{ padding: '14px 18px' }}>Craft Item & Quantity</th>
                  <th style={{ padding: '14px 18px' }}>Budget / Total Value</th>
                  <th style={{ padding: '14px 18px' }}>Matched Artisan SHG</th>
                  <th style={{ padding: '14px 18px' }}>Match Score</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRFQs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 12px auto', display: 'block', color: '#64748B' }} />
                      <p style={{ fontWeight: '600', color: '#1B2A4A' }}>No B2B RFQs match your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredRFQs.map((rfq) => {
                    const totalVal = (rfq.quantity || 1) * (rfq.budgetPerUnit || 0);
                    const status = rfq.status || 'Open';

                    return (
                      <tr key={rfq.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        {/* Company */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: '700', color: '#1B2A4A' }}>{rfq.buyerCompany}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} />
                            <span>{rfq.location || 'India'}</span>
                          </div>
                        </td>

                        {/* Item & Units */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {rfq.image && (
                              <img 
                                src={rfq.image} 
                                alt={rfq.item} 
                                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }} 
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: '600', color: '#334155' }}>{rfq.item}</div>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                                {rfq.quantity?.toLocaleString('en-IN')} units
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Budget & Total */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: '800', color: '#0F172A' }}>₹{totalVal.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>₹{rfq.budgetPerUnit}/unit target</div>
                        </td>

                        {/* Matched Artisan Cluster */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: '600', color: '#1B2A4A' }}>{rfq.matchedArtisan || 'Auto-Matching'}</div>
                          <button 
                            onClick={() => reassignArtisanCluster(rfq.id)}
                            style={{ border: 'none', background: 'transparent', color: '#2563EB', fontSize: '0.74rem', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Reassign Cluster
                          </button>
                        </td>

                        {/* Match Score */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700' }}>
                            <CheckCircle2 size={13} />
                            <span>{rfq.matchScore || 90}% Match</span>
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td style={{ padding: '14px 18px' }}>
                          <select 
                            value={status} 
                            onChange={(e) => updateRfqStatus(rfq.id, e.target.value)}
                            style={{ 
                              padding: '5px 10px', 
                              borderRadius: '6px', 
                              fontSize: '0.76rem', 
                              fontWeight: '700',
                              border: '1px solid #CBD5E1',
                              background: status === 'Contract Closed' ? '#DCFCE7' : '#FFF',
                              color: status === 'Contract Closed' ? '#166534' : '#1B2A4A',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Open">Open</option>
                            <option value="Matching SHG">Matching SHG</option>
                            <option value="Under Negotiation">Under Negotiation</option>
                            <option value="Contract Closed">Contract Closed</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              showToast({
                                type: 'info',
                                title: 'Tender Docket Opened',
                                message: `Audit file for ${rfq.buyerCompany} loaded.`
                              });
                            }}
                            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', color: '#1B2A4A', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Audit File
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Direct Buyer Inquiries Log */}
      {activeTab === 'inquiries' && (
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 18px' }}>Buyer Name & Location</th>
                  <th style={{ padding: '14px 18px' }}>Requested Craft Piece</th>
                  <th style={{ padding: '14px 18px' }}>Order Size & Estimated Value</th>
                  <th style={{ padding: '14px 18px' }}>Timeline</th>
                  <th style={{ padding: '14px 18px' }}>Message Preview</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                      <MessageSquare size={32} style={{ margin: '0 auto 12px auto', display: 'block', color: '#94A3B8' }} />
                      <p style={{ fontWeight: '600', color: '#1B2A4A' }}>No buyer inquiries logged</p>
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr key={inq.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '700', color: '#1B2A4A' }}>{inq.buyerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{inq.buyerLocation || 'India'}</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '600', color: '#334155' }}>{inq.productName}</div>
                        <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>Direct Order RFQ</span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '800', color: '#0F172A' }}>
                          ₹{(inq.totalValue || (inq.quantity * inq.targetPrice) || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{inq.quantity} units requested</div>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#475569' }}>
                          <Clock size={12} />
                          <span>{inq.timeline || '30 Days'}</span>
                        </span>
                      </td>

                      <td style={{ padding: '14px 18px' }}>
                        <p style={{ margin: 0, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748B', fontSize: '0.82rem' }}>
                          {inq.message || 'Direct order placed by institutional buyer.'}
                        </p>
                      </td>

                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedInquiryDetail(inq)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', color: '#2563EB', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                          View Inquiry
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiryDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFF', borderRadius: '18px', maxWidth: '560px', width: '100%', padding: '28px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <button 
              onClick={() => setSelectedInquiryDetail(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase' }}>
              DIRECT BUYER INQUIRY DOCKET
            </span>
            <h3 style={{ margin: '6px 0 16px 0', fontSize: '1.25rem', color: '#1B2A4A' }}>
              {selectedInquiryDetail.productName}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '0.84rem' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Buyer Name</span>
                <strong>{selectedInquiryDetail.buyerName}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Buyer Location</span>
                <strong>{selectedInquiryDetail.buyerLocation || 'India'}</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Quantity</span>
                <strong>{selectedInquiryDetail.quantity} Units</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Estimated Value</span>
                <strong style={{ color: '#059669' }}>₹{(selectedInquiryDetail.totalValue || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Buyer Message / Specifications</label>
              <p style={{ fontSize: '0.86rem', color: '#334155', background: '#F8FAFC', padding: '14px', borderRadius: '8px', lineHeight: 1.5, margin: 0 }}>
                {selectedInquiryDetail.message || 'Direct procurement order submitted.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setSelectedInquiryDetail(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', borderRadius: '8px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
