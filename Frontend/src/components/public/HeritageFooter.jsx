import React from 'react';
import { cultureAssets } from '../../config/cultureAssets';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ShoppingBag, Globe, ShieldCheck, Heart } from 'lucide-react';

export default function HeritageFooter() {
  const { navigate } = useApp();
  const { t, lang } = useLanguage();

  return (
    <footer className="heritage-footer">
      {/* Heritage Quote Banner */}
      <div 
        className="footer-heritage-banner"
        style={{
          backgroundImage: `url(${cultureAssets.footer.artwork})`,
        }}
      >
        <div className="footer-heritage-overlay" />
        
        <div className="footer-heritage-content">
          <span className="footer-eyebrow">
            <Sparkles size={14} />
            TRADITION MEETS ARTIFICIAL INTELLIGENCE
          </span>
          <h2 className="footer-quote">
            "{cultureAssets.footer.quote}"
          </h2>
          <p className="footer-subquote">
            {cultureAssets.footer.subquote}
          </p>

          <div className="footer-banner-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('studio')}
            >
              <Sparkles size={18} />
              <span>Launch AI Product Studio</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('marketplace')}
            >
              <ShoppingBag size={18} />
              <span>Explore Artisan Marketplace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-bottom-grid">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-col-brand">
              <div className="footer-brand-logo">
                <span className="brand-om">{lang === 'hi' ? 'क' : 'K'}</span>
                <span className="footer-brand-title">KARIGAR<span className="accent">AI</span></span>
              </div>
              <p className="footer-brand-desc">
                India's voice-first AI business ecosystem for rural weavers, potters, sculptors, and GI craft clusters. Empowering grassroots master craftspeople with direct digital market access.
              </p>
              <div className="footer-made-with">
                <span>Handcrafted with <Heart size={14} color="#E53935" fill="#E53935" style={{ display: 'inline' }} /> for Indian Artisans</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Platform Surfaces</h4>
              <ul>
                <li><button onClick={() => navigate('public')}>Public Home</button></li>
                <li><button onClick={() => navigate('studio')}>AI Product Studio</button></li>
                <li><button onClick={() => navigate('artisan')}>Artisan Hub</button></li>
                <li><button onClick={() => navigate('inventory')}>Inventory & Stock</button></li>
                <li><button onClick={() => navigate('marketplace')}>Artisan-Only Marketplace</button></li>
                <li><button onClick={() => navigate('buyer')}>B2B Buyer Hub</button></li>
                <li><button onClick={() => navigate('admin')}>Admin Operations</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Craft Clusters</h4>
              <ul>
                <li><button onClick={() => navigate('marketplace', { filterCraft: 'Chanderi Handloom' })}>Chanderi Silk (MP)</button></li>
                <li><button onClick={() => navigate('marketplace', { filterCraft: 'Banarasi Handloom' })}>Banarasi Brocade (UP)</button></li>
                <li><button onClick={() => navigate('marketplace', { filterCraft: 'Ajrakh Block Printing' })}>Ajrakh Printing (Gujarat)</button></li>
                <li><button onClick={() => navigate('marketplace', { filterCraft: 'Blue Pottery' })}>Jaipur Blue Pottery (Rajasthan)</button></li>
                <li><button onClick={() => navigate('marketplace', { filterCraft: 'Bidriware' })}>Bidriware Silver Inlay (Karnataka)</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Intelligent Commerce</h4>
              <ul>
                <li><span>✓ AI Image Studio & Backgrounds</span></li>
                <li><span>✓ Multilingual Voice Cataloguing</span></li>
                <li><span>✓ NLP Craft Attribute Extraction</span></li>
                <li><span>✓ Dynamic Fair Wage Pricing</span></li>
                <li><span>✓ 8 Indian Regional Languages</span></li>
                <li><span>✓ Direct B2B 6-Factor Matching</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-legal-bar">
            <div>
              © 2026 KarigarSeetu • Dedicated to the Millions of Hands that Weave, Mold, and Paint India's Soul.
            </div>
            <div className="footer-tags">
              <span>#VocalForLocal</span>
              <span>#MakeInIndia</span>
              <span>#DigitalIndia</span>
              <span>#AtmanirbharBharat</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .heritage-footer {
          background: #121927;
          color: #E2E8F0;
        }
        .footer-heritage-banner {
          position: relative;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: cover;
          background-position: center;
          overflow: hidden;
          padding: 80px 24px;
        }
        .footer-heritage-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(27, 42, 74, 0.90) 0%,
            rgba(15, 23, 42, 0.96) 100%
          );
        }
        .footer-heritage-content {
          position: relative;
          z-index: 2;
          max-width: 820px;
          text-align: center;
        }
        .footer-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
          font-weight: 700;
          margin-bottom: 24px;
          text-transform: uppercase;
        }
        .footer-quote {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          line-height: 1.2;
          color: #FFFFFF;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .footer-subquote {
          font-size: 1.1rem;
          color: #CBD5E1;
          max-width: 620px;
          margin: 0 auto 36px;
        }
        .footer-banner-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-bottom-grid {
          padding: 72px 0 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-columns {
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr 1.2fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        @media (max-width: 960px) {
          .footer-columns {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-columns {
            grid-template-columns: 1fr;
          }
        }
        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .footer-brand-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .footer-brand-title .accent {
          color: #E28469;
        }
        .footer-brand-desc {
          font-size: 0.9rem;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .footer-made-with {
          font-size: 0.85rem;
          color: #CBD5E1;
        }
        .footer-col h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-col button, .footer-col span {
          color: #94A3B8;
          font-size: 0.9rem;
          transition: color 0.15s ease;
          text-align: left;
        }
        .footer-col button:hover {
          color: #FFFFFF;
        }
        .footer-legal-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.82rem;
          color: #64748B;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-tags {
          display: flex;
          gap: 14px;
        }
      `}</style>
    </footer>
  );
}
