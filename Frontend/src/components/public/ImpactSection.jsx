import React from 'react';
import { Users, TrendingUp, Award, Globe, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function ImpactSection() {
  const stats = [
    {
      icon: Users,
      value: "12,480+",
      label: "Artisans & SHGs Onboarded",
      sub: "Across 22 Indian States"
    },
    {
      icon: TrendingUp,
      value: "₹4.62 Cr",
      label: "Direct Artisan Earnings",
      sub: "100% to verified artisan accounts"
    },
    {
      icon: Award,
      value: "35+",
      label: "GI-Certified Traditions",
      sub: "Authenticated craft heritage"
    },
    {
      icon: Globe,
      value: "8 Languages",
      label: "Voice & NLP Dialects",
      sub: "English, Hindi, Tamil, Telugu..."
    }
  ];

  return (
    <section className="impact-section">
      <div className="container">
        <div className="section-header-center">
          <span className="section-eyebrow">SOCIO-ECONOMIC IMPACT</span>
          <h2 className="section-title">Sustaining India's Creative Economy</h2>
          <p className="section-desc">
            Empowering craft communities to break free from predatory intermediaries through transparent AI technology and direct marketplace access.
          </p>
        </div>

        <div className="impact-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="impact-stat-card">
              <div className="impact-icon-wrap">
                <stat.icon size={26} />
              </div>
              <div className="impact-value">{stat.value}</div>
              <div className="impact-label">{stat.label}</div>
              <div className="impact-sub">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Ethical Guarantee Box */}
        <div className="ethical-guarantee-card">
          <div className="guarantee-icon">
            <ShieldCheck size={36} />
          </div>
          <div className="guarantee-text">
            <h3>The KarigarSeetu Fair Trade & Provenance Guarantee</h3>
            <p>
              Every product listed on KarigarSeetu features an unforgeable digital certificate of authenticity, transparent pricing breakdown, and direct linkage to the verified artisan or Self-Help Group.
            </p>
          </div>
          <div className="guarantee-badge">
            <span>✓ 100% Direct Fair Trade</span>
          </div>
        </div>
      </div>

      <style>{`
        .impact-section {
          padding: 96px 0;
          background: var(--bg-main);
          border-bottom: 1px solid var(--border-light);
        }
        .impact-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }
        @media (max-width: 960px) {
          .impact-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 520px) {
          .impact-stats-grid {
            grid-template-columns: 1fr;
          }
        }
        .impact-stat-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 32px 24px;
          text-align: center;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .impact-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .impact-value {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .impact-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 4px;
        }
        .impact-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .ethical-guarantee-card {
          background: #FFFFFF;
          border: 1px solid rgba(197, 154, 63, 0.3);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 4px 20px rgba(197, 154, 63, 0.08);
          flex-wrap: wrap;
        }
        .guarantee-icon {
          color: var(--accent-gold);
          flex-shrink: 0;
        }
        .guarantee-text {
          flex: 1;
          min-width: 280px;
        }
        .guarantee-text h3 {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .guarantee-text p {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .guarantee-badge span {
          display: inline-block;
          background: var(--accent-gold-light);
          color: #8B6514;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(197, 154, 63, 0.3);
        }
      `}</style>
    </section>
  );
}
