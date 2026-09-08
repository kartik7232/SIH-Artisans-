import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Award, ArrowRight, MapPin } from 'lucide-react';

export default function CraftShowcaseSection() {
  const { crafts, navigate } = useApp();
  const { t } = useLanguage();

  // Show top 6 diverse Indian GI crafts
  const featuredCrafts = crafts.slice(0, 6);

  return (
    <section className="crafts-showcase-section">
      <div className="container">
        <div className="section-header-split">
          <div>
            <span className="section-eyebrow">GI-CERTIFIED TRADITIONS</span>
            <h2 className="section-title">Explore Indian Handicraft Heritage</h2>
            <p className="section-desc">
              From the salt flats of Kutch to the pit looms of Varanasi, every craft represents centuries of cultural lineage and artisanal mastery.
            </p>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('marketplace')}
          >
            <span>View All Crafts in Marketplace</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="crafts-grid">
          {featuredCrafts.map(craft => (
            <div 
              key={craft.id} 
              className="craft-card"
              onClick={() => navigate('marketplace', { filterCraft: craft.name })}
            >
              <div className="craft-image-wrap">
                <img src={craft.heroImage} alt={craft.name} loading="lazy" />
                {craft.giCertified && (
                  <span className="craft-gi-pill">
                    <Award size={12} />
                    <span>GI Tag {craft.giYear || 'Certified'}</span>
                  </span>
                )}
                <div className="craft-overlay-tag">
                  <MapPin size={12} />
                  <span>{craft.region}</span>
                </div>
              </div>

              <div className="craft-body">
                <span className="craft-cat">{craft.category}</span>
                <h3 className="craft-name">{craft.name}</h3>
                <p className="craft-desc">{craft.description}</p>
                
                <div className="craft-meta-row">
                  <span className="craft-technique">{craft.materials?.slice(0, 2).join(', ')}</span>
                  <span className="craft-artisan-count">{craft.artisanCount}+ Artisans</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .crafts-showcase-section {
          padding: 96px 0;
          background: #FFFFFF;
          border-bottom: 1px solid var(--border-light);
        }
        .section-header-split {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .crafts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 960px) {
          .crafts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .crafts-grid {
            grid-template-columns: 1fr;
          }
        }
        .craft-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }
        .craft-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(169, 84, 58, 0.3);
        }
        .craft-image-wrap {
          position: relative;
          width: 100%;
          height: 220px;
          background: #EAE5DC;
          overflow: hidden;
        }
        .craft-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .craft-card:hover .craft-image-wrap img {
          transform: scale(1.06);
        }
        .craft-gi-pill {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255, 255, 255, 0.95);
          color: #8B6514;
          border: 1px solid rgba(197, 154, 63, 0.4);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 4px;
          backdrop-filter: blur(4px);
        }
        .craft-overlay-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.75);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          backdrop-filter: blur(4px);
        }
        .craft-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .craft-cat {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }
        .craft-name {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--text-primary);
          margin-bottom: 10px;
          line-height: 1.25;
        }
        .craft-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .craft-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-light);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .craft-artisan-count {
          font-weight: 700;
          color: var(--secondary);
        }
      `}</style>
    </section>
  );
}
