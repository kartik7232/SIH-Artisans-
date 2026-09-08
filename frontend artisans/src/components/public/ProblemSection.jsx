import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Camera, FileText, IndianRupee, Sparkles, ArrowRight } from 'lucide-react';

export default function ProblemSection() {
  const { t } = useLanguage();
  const { navigate } = useApp();

  const cards = [
    {
      icon: Camera,
      title: t('problemCard1Title'),
      desc: t('problemCard1Desc'),
      badge: "Vision AI Solution",
      stat: "2.3× More Buyer Trust"
    },
    {
      icon: FileText,
      title: t('problemCard2Title'),
      desc: t('problemCard2Desc'),
      badge: "Voice & NLP Solution",
      stat: "Zero Typing Required"
    },
    {
      icon: IndianRupee,
      title: t('problemCard3Title'),
      desc: t('problemCard3Desc'),
      badge: "Benchmark Engine",
      stat: "100% Fair Wage Guaranteed"
    }
  ];

  return (
    <section className="problem-section">
      <div className="container">
        <div className="section-header-center">
          <span className="section-eyebrow">{t('problemEyebrow')}</span>
          <h2 className="section-title">{t('problemHeading')}</h2>
          <p className="section-desc">
            {t('problemSubheading')}
          </p>
        </div>

        <div className="problem-cards-grid">
          {cards.map((card, idx) => (
            <div key={idx} className="problem-card">
              <div className="problem-card-icon-wrap">
                <card.icon size={28} className="problem-icon" />
              </div>
              <span className="problem-badge">{card.badge}</span>
              <h3 className="problem-card-title">{card.title}</h3>
              <p className="problem-card-desc">{card.desc}</p>
              <div className="problem-card-stat">
                <span className="stat-pill">{card.stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* The Core KarigarAI Manifesto Banner */}
        <div className="problem-solution-banner">
          <div className="banner-content">
            <div className="banner-icon-circle">
              <Sparkles size={24} />
            </div>
            <div className="banner-text">
              <h4>The KarigarAI Difference</h4>
              <p>
                Traditional SaaS requires typing in English, complex dashboards, and computer literacy. KarigarAI empowers the artisan using only <strong>their spoken mother tongue</strong> and a <strong>single smartphone camera tap</strong>.
              </p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('studio')}
          >
            <span>Try AI Studio Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .problem-section {
          padding: 96px 0;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
        }
        .section-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 56px;
        }
        .problem-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 960px) {
          .problem-cards-grid {
            grid-template-columns: 1fr;
          }
        }
        .problem-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .problem-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(169, 84, 58, 0.25);
        }
        .problem-card-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
        }
        .problem-icon {
          color: var(--primary);
        }
        .problem-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .problem-card-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.25;
        }
        .problem-card-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }
        .problem-card-stat {
          margin-top: auto;
        }
        .stat-pill {
          display: inline-block;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--secondary);
        }
        .problem-solution-banner {
          margin-top: 48px;
          background: linear-gradient(135deg, #FAF6EE 0%, #F5EDE0 100%);
          border: 1px solid rgba(169, 84, 58, 0.2);
          border-radius: var(--radius-lg);
          padding: 28px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .banner-content {
          display: flex;
          align-items: center;
          gap: 20px;
          max-width: 800px;
        }
        .banner-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .banner-text h4 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .banner-text p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
      `}</style>
    </section>
  );
}
