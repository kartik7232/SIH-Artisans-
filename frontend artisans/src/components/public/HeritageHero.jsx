import React from 'react';
import { cultureAssets } from '../../config/cultureAssets';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeritageHero() {
  const { navigate } = useApp();
  const { t } = useLanguage();

  return (
    <section
      className="heritage-hero"
      style={{
        backgroundImage: `url(${cultureAssets.hero.primaryArtwork})`,
      }}
    >
      <div className="heritage-hero__overlay" />

      <div className="heritage-hero__content">
        <span className="heritage-hero__eyebrow">
          <ShieldCheck size={14} />
          {t('heroEyebrow')}
        </span>

        <h1>
          {t('heroTitleLine1')}
          <br />
          <span className="accent">{t('heroTitleLine2')}</span>
        </h1>

        <p>
          {t('heroSubtitle')}
        </p>

        <div className="heritage-hero__actions">
          <button 
            className="heritage-btn heritage-btn--primary"
            onClick={() => navigate('marketplace')}
          >
            <ShoppingBag size={18} />
            <span>{t('heroCtaMarketplace')}</span>
          </button>

          <button 
            className="heritage-btn heritage-btn--secondary"
            onClick={() => navigate('studio')}
          >
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <span>{t('heroCtaStudio')}</span>
            <ArrowRight size={16} />
          </button>

          <button 
            className="heritage-btn heritage-btn--ghost"
            onClick={() => navigate('auth')}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF'
            }}
          >
            <span>Portal Login</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Pipeline Quick Strip */}
        <div className="hero-pipeline-strip">
          <div className="strip-item" onClick={() => navigate('studio')}>
            <span className="strip-icon">📷</span>
            <span className="strip-text">{t('step1Title')}</span>
          </div>
          <span className="strip-sep">→</span>
          <div className="strip-item" onClick={() => navigate('studio')}>
            <span className="strip-icon">✨</span>
            <span className="strip-text">{t('step2Title')}</span>
          </div>
          <span className="strip-sep">→</span>
          <div className="strip-item" onClick={() => navigate('studio')}>
            <span className="strip-icon">🎙️</span>
            <span className="strip-text">{t('step3Title')}</span>
          </div>
          <span className="strip-sep">→</span>
          <div className="strip-item" onClick={() => navigate('studio')}>
            <span className="strip-icon">🤖</span>
            <span className="strip-text">{t('step4Title')}</span>
          </div>
          <span className="strip-sep">→</span>
          <div className="strip-item" onClick={() => navigate('studio')}>
            <span className="strip-icon">💰</span>
            <span className="strip-text">{t('step5Title')}</span>
          </div>
          <span className="strip-sep">→</span>
          <div className="strip-item" onClick={() => navigate('marketplace')}>
            <span className="strip-icon">🛍️</span>
            <span className="strip-text">{t('step6Title')}</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-pipeline-strip {
          margin-top: 40px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          background: rgba(255, 253, 248, 0.90);
          border: 1px solid rgba(41, 39, 37, 0.15);
          border-radius: 9999px;
          backdrop-filter: blur(8px);
          box-shadow: 0 6px 24px rgba(41, 39, 37, 0.08);
          max-width: 100%;
          overflow-x: auto;
        }
        .strip-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s ease;
        }
        .strip-item:hover {
          transform: translateY(-1px);
          color: var(--primary);
        }
        .strip-icon {
          font-size: 1.1rem;
        }
        .strip-sep {
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .hero-pipeline-strip {
            gap: 8px;
            padding: 8px 14px;
          }
          .strip-text {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
