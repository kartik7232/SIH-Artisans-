import React, { useState } from 'react';
import { cultureAssets } from '../../config/cultureAssets';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Eye, 
  Users, 
  MapPin, 
  Award, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function ArtisanHeritageGallery() {
  const { navigate, openAssistant } = useApp();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('masters'); // 'masters' | 'hands' | 'lineage' | 'provenance'

  return (
    <section className="artisan-heritage-gallery-section">
      {/* Background Ambient Transparent Circular Hands Watermark */}
      <div 
        className="hands-circle-watermark gallery-ambient-halo"
        style={{ backgroundImage: `url(${cultureAssets.imagery.artisanHandsCircle})` }}
      />

      <div className="container relative-z">
        {/* Section Title */}
        {/* Section Title - Catchy, Classy, Prestigious */}
        <div className="section-header-center">
          <span className="section-eyebrow">
            <Sparkles size={14} />
            CURATED ATELIERS • 100% DIRECT FROM SOURCE
          </span>
          <h2 className="section-title">The Art of the Extraordinary</h2>
          <p className="section-desc">
            Breathtaking handcrafts sculpted by generational master studios across India. Unmatched organic textures, hand-chiseled hardwoods, and palace-grade heirlooms — delivered direct with zero middlemen mark-ups.
          </p>
        </div>

        {/* 3 Interactive Luxury Atelier Showcase Cards */}
        <div className="gallery-showcase-grid">
          {/* Card 1: Woven Cane & Sustainable Atelier */}
          <div className="heritage-visual-card luxury-craft-card">
            <div className="card-image-lens-wrap">
              <img 
                src={cultureAssets.curations.wovenCaneBazaar} 
                alt="Woven Cane & Straw Atelier" 
                className="lens-image"
              />
              <div className="lens-overlay-badge nature">
                <Sparkles size={13} />
                <span>Wild Forest Cane & Wicker</span>
              </div>
            </div>

            <div className="card-story-body">
              <span className="story-eyebrow">THE ORGANIC ATELIER</span>
              <h3>Woven Sunlight. Earthborn Luxury.</h3>
              <p>
                Sun-drenched river cane and wild forest bamboo hand-plaited into sculptural bohemian totes, nesting storage, and warm organic textures. Pure slow living crafted to bring serene, tactile elegance into modern spaces.
              </p>
              
              <div className="card-quote-pill">
                "Pure sunlight, river reed, and patient human hands — slow living in its purest form."
              </div>

              <div className="card-tags-strip">
                <span className="curation-chip">🌿 Zero Plastic</span>
                <span className="curation-chip">⏳ 24h Hand-Plaiting</span>
                <span className="curation-chip">🏷️ Direct ₹1,450+</span>
              </div>

              <button 
                className="card-explore-btn"
                onClick={() => navigate('marketplace', { filterCraft: 'Bamboo' })}
              >
                <span>Shop Woven Cane & Straw</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Hand-Carved Walnut & Teak Keepsakes */}
          <div className="heritage-visual-card luxury-craft-card">
            <div className="card-image-lens-wrap">
              <img 
                src={cultureAssets.curations.carvedWoodHeirlooms} 
                alt="Hand-Carved Walnut & Teak Woodcraft" 
                className="lens-image"
              />
              <div className="lens-overlay-badge walnut">
                <Award size={13} />
                <span>Kashmir Walnut • Hand-Chiseled</span>
              </div>
            </div>

            <div className="card-story-body">
              <span className="story-eyebrow">HEIRLOOM WOODCRAFT</span>
              <h3>Carved in Solitude. Cherished Forever.</h3>
              <p>
                Deep-grained seasoned walnut contoured into sculpted leaf dishes, heirloom jewelry chests, and rich botanical relief boxes. Hand-carved stroke by stroke with heirloom bevels, these tactile centerpieces anchor any room with timeless warmth.
              </p>

              <div className="card-quote-pill">
                "The wood yields to the carver's quiet rhythm, blooming into floral relief that never withers."
              </div>

              <div className="card-tags-strip">
                <span className="curation-chip">🪵 Solid Heartwood</span>
                <span className="curation-chip">⚜️ Master Chiseled</span>
                <span className="curation-chip">🏷️ Direct ₹2,800+</span>
              </div>

              <button 
                className="card-explore-btn"
                onClick={() => navigate('marketplace', { filterCraft: 'Wood' })}
              >
                <span>Discover Master Woodcraft</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 3: Royal Brass Inlay & Monumental Emporium */}
          <div className="heritage-visual-card luxury-craft-card">
            <div className="card-image-lens-wrap">
              <img 
                src={cultureAssets.curations.royalCraftEmporium} 
                alt="Palace Woodcraft and Royal Brass Emporium" 
                className="lens-image"
              />
              <div className="lens-overlay-badge royal">
                <ShieldCheck size={13} />
                <span>Monumental Brass Inlay & Sculptures</span>
              </div>
            </div>

            <div className="card-story-body">
              <span className="story-eyebrow">THE ROYAL BAZAAR</span>
              <h3>Palace Grandeur. Curated for Your Home.</h3>
              <p>
                From monumental brass-inlaid fluted urns and hand-carved royal caparisoned elephants to vintage gears clocks. Experience the opulent grandeur of royal Indian havelis — brought directly from master artisan guilds with zero middleman markups.
              </p>

              <div className="card-quote-pill">
                "Why settle for synthetic factory replicas when your sanctuary can host living history?"
              </div>

              <div className="card-tags-strip">
                <span className="curation-chip">👑 Tarkashi Brass</span>
                <span className="curation-chip">🐘 Guild Certified</span>
                <span className="curation-chip">🏷️ 100% Direct to Maker</span>
              </div>

              <button 
                className="card-explore-btn"
                onClick={() => navigate('marketplace', { filterCraft: 'Metalcraft' })}
              >
                <span>Explore Royal Emporium</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CRAFTS IN MOTION: 5 FEATURED TRADITIONS SHOWCASE             */}
        {/* ============================================================ */}
        <div className="crafts-in-motion-banner">
          <div className="in-motion-header">
            <div>
              <span className="section-eyebrow">AUTHENTIC CRAFT RECORDINGS</span>
              <h3 className="serif-title">Heritage In Every Hand Movement</h3>
            </div>
            <p className="motion-sub">Captured directly from artisan workshops across Rajasthan, Kashmir, Assam, and Maharashtra.</p>
          </div>

          <div className="crafts-motion-grid">
            {/* 1. Blue Pottery */}
            <div className="motion-card" onClick={() => navigate('marketplace', { filterCraft: 'Blue Pottery' })}>
              <div className="motion-thumb-wrap">
                <img src={cultureAssets.crafts.jaipurBluePotteryArtisan} alt="Jaipur Blue Pottery Artisan" />
                <span className="motion-badge">Jaipur, Rajasthan</span>
              </div>
              <div className="motion-content">
                <span className="craft-tag">Blue Pottery</span>
                <h4>Freehand Cobalt Vase Painting</h4>
                <p>Fatima Begum brush-painting Persian floral motifs on wheel-thrown quartz dough.</p>
              </div>
            </div>

            {/* 2. Enameled Copper */}
            <div className="motion-card" onClick={() => navigate('marketplace', { filterCraft: 'Metalcraft' })}>
              <div className="motion-thumb-wrap">
                <img src={cultureAssets.crafts.enameledCopperPottery} alt="Meenakari Enameled Copper" />
                <span className="motion-badge">Moradabad, UP</span>
              </div>
              <div className="motion-content">
                <span className="craft-tag">Copper Repoussé</span>
                <h4>Kiln-Fired Meenakari Enameling</h4>
                <p>Pure copper vessels hand-chiseled and fired with turquoise and ruby mineral glass.</p>
              </div>
            </div>

            {/* 3. Aari Needlework */}
            <div className="motion-card" onClick={() => navigate('marketplace', { filterCraft: 'Embroidery' })}>
              <div className="motion-thumb-wrap">
                <img src={cultureAssets.crafts.kashmiriAariEmbroidery} alt="Kashmiri Aari Lotus Embroidery" />
                <span className="motion-badge">Srinagar, Kashmir</span>
              </div>
              <div className="motion-content">
                <span className="craft-tag">Aari Needlework</span>
                <h4>Tambour Hook Lotus Embroidery</h4>
                <p>Intricate woolen resham chain-stitch needlework on pure flax linen canvas.</p>
              </div>
            </div>

            {/* 4. Terracotta Bell Lamp */}
            <div className="motion-card" onClick={() => navigate('marketplace', { filterCraft: 'Terracotta' })}>
              <div className="motion-thumb-wrap">
                <img src={cultureAssets.crafts.tribalTerracottaLamp} alt="Warli Terracotta Bedside Bell Lamp" />
                <span className="motion-badge">Dahanu, Maharashtra</span>
              </div>
              <div className="motion-content">
                <span className="craft-tag">Warli Terracotta</span>
                <h4>Hand-Braided Jute & Bell Lamp</h4>
                <p>Wheel-turned red clay lamp base with brass temple bells and rice-paste harvest art.</p>
              </div>
            </div>

            {/* 5. Bamboo Wicker Weaving */}
            <div className="motion-card" onClick={() => navigate('marketplace', { filterCraft: 'Bamboo' })}>
              <div className="motion-thumb-wrap">
                <img src={cultureAssets.crafts.bambooBasketWeaving} alt="Handwoven Natural Bamboo Basket" />
                <span className="motion-badge">Barpeta, Assam</span>
              </div>
              <div className="motion-content">
                <span className="craft-tag">Bamboo & Cane</span>
                <h4>Hand-Split Bamboo Fiber Plaiting</h4>
                <p>Zero-plastic utility basket woven with wild forest bamboo and river cane slivers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Split Banner: Circular Hands of Creation + GI Provenance Card */}
        <div className="gallery-bottom-split">
          {/* Left: The Hands of Creation (artisan-hands-circle.png) */}
          <div className="hands-creation-feature heritage-glass-card">
            <div className="hands-illustration-side">
              <img 
                src={cultureAssets.imagery.artisanHandsCircle} 
                alt="Circle of Artisan Hands and Tools" 
                className="hands-art-img"
              />
            </div>
            <div className="hands-content-side">
              <span className="feature-pill">THE ELEVEN TOOLS OF CREATION</span>
              <h3>From Physical Touch to Digital Catalogue</h3>
              <p>
                The potter’s wheel, the carver’s chisel, the tailor’s needle, and the weaver’s shuttle. KarigarSeetu is designed around tactile physical tools so low-digital-literacy artisans never have to struggle with keyboard typing.
              </p>
              <ul className="craft-tools-bullets">
                <li><CheckCircle2 size={15} color="var(--primary)" /> 1-Tap Camera Viewfinder with Automatic Framing</li>
                <li><CheckCircle2 size={15} color="var(--primary)" /> Voice-First Dialect Transcription across 8 Languages</li>
                <li><CheckCircle2 size={15} color="var(--primary)" /> 100% Transparent Fair Price Formula</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('studio')}
              >
                <span>Launch AI Product Studio</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Mangalgiri Heritage & GI Story Card (mangalgiri-heritage-story.jpg) */}
          <div className="heritage-story-card-wrap heritage-glass-card">
            <div className="provenance-img-frame">
              <img 
                src={cultureAssets.imagery.mangalgiriHeritageStory} 
                alt="Mangalgiri Weaves 200 Years Heritage" 
                className="story-poster-img"
              />
            </div>
            <div className="provenance-caption">
              <div className="caption-header">
                <Compass size={16} color="var(--primary)" />
                <h4>GI Cluster Provenance</h4>
              </div>
              <p>
                Every craft on KarigarSeetu is geo-tagged to its historical birthplace. Consumers and B2B buyers can trace each textile back to its loom, its weavers, and its 200+ year historical legacy.
              </p>
              <button 
                className="btn btn-secondary full-width"
                onClick={() => navigate('marketplace')}
              >
                <span>Explore Verified GI Clusters</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .artisan-heritage-gallery-section {
          position: relative;
          padding: 104px 0;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAF6EE 50%, #FFFFFF 100%);
          overflow: hidden;
          border-bottom: 1px solid var(--border-light);
        }
        .gallery-ambient-halo {
          top: 10%;
          left: -150px;
          opacity: 0.05;
        }
        .relative-z {
          position: relative;
          z-index: 2;
        }
        .section-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 64px;
        }
        .gallery-showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
          margin-bottom: 56px;
        }
        @media (max-width: 1060px) {
          .gallery-showcase-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }
        }
        .heritage-visual-card {
          background: #FFFFFF;
          border: 1px solid rgba(220, 208, 192, 0.7);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(45, 30, 20, 0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease;
        }
        .heritage-visual-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 36px -10px rgba(184, 80, 66, 0.16);
          border-color: var(--primary);
        }
        .card-image-lens-wrap {
          position: relative;
          width: 100%;
          height: 310px;
          background: #1A1816;
          overflow: hidden;
        }
        .lens-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .heritage-visual-card:hover .lens-image {
          transform: scale(1.06);
        }
        .lens-overlay-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(18, 14, 11, 0.78);
          color: #FFFFFF;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 6px 13px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .lens-overlay-badge.nature {
          background: rgba(28, 64, 46, 0.88);
          border-color: rgba(120, 200, 160, 0.35);
        }
        .lens-overlay-badge.walnut {
          background: rgba(72, 38, 20, 0.88);
          border-color: rgba(220, 170, 130, 0.35);
        }
        .lens-overlay-badge.royal {
          background: rgba(138, 86, 18, 0.9);
          border-color: rgba(255, 215, 120, 0.4);
        }
        .card-story-body {
          padding: 26px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .story-eyebrow {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .card-story-body h3 {
          font-family: var(--font-serif);
          font-size: 1.48rem;
          color: var(--text-primary);
          line-height: 1.25;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .card-story-body p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 18px;
          flex: 1;
        }
        .card-quote-pill {
          background: rgba(184, 80, 66, 0.05);
          color: var(--primary);
          font-size: 0.82rem;
          font-style: italic;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 8px;
          border-left: 3px solid var(--primary);
          margin-bottom: 18px;
          line-height: 1.45;
        }
        .card-tags-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .curation-chip {
          background: #F6F1EA;
          border: 1px solid rgba(220, 210, 195, 0.7);
          color: var(--text-primary);
          font-size: 0.74rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .card-explore-btn {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 11px 16px;
          background: #FAF6EE;
          border: 1px solid var(--border-medium);
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .card-explore-btn:hover {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(184, 80, 66, 0.25);
        }
        .gallery-bottom-split {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 32px;
        }
        @media (max-width: 960px) {
          .gallery-bottom-split {
            grid-template-columns: 1fr;
          }
        }
        .hands-creation-feature {
          padding: 40px;
          display: flex;
          gap: 36px;
          align-items: center;
        }
        @media (max-width: 700px) {
          .hands-creation-feature {
            flex-direction: column;
            padding: 24px;
          }
        }
        .hands-illustration-side {
          width: 220px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hands-art-img {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 20px rgba(169, 84, 58, 0.15));
          animation: floatSlow 6s ease-in-out infinite;
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .hands-content-side {
          flex: 1;
        }
        .feature-pill {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--secondary);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }
        .hands-content-side h3 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--text-primary);
          line-height: 1.25;
          margin-bottom: 12px;
        }
        .hands-content-side p {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .craft-tools-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 26px;
          font-size: 0.88rem;
          color: var(--text-primary);
          font-weight: 600;
        }
        .craft-tools-bullets li {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .heritage-story-card-wrap {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .provenance-img-frame {
          width: 100%;
          height: 240px;
          border-radius: 12px;
          overflow: hidden;
          background: #F4EFE4;
        }
        .story-poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .provenance-caption {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .caption-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .caption-header h4 {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--text-primary);
        }
        .provenance-caption p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }

        /* Crafts in Motion 5-Tradition Showcase Banner */
        .crafts-in-motion-banner {
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(220, 205, 185, 0.55);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 36px;
          box-shadow: 0 10px 30px -10px rgba(45, 30, 20, 0.06);
        }
        .in-motion-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .serif-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-top: 4px;
          font-weight: 700;
        }
        .motion-sub {
          max-width: 480px;
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .crafts-motion-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 18px;
        }
        .motion-card {
          cursor: pointer;
          background: #FFFFFF;
          border: 1px solid rgba(225, 215, 200, 0.8);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .motion-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 28px -6px rgba(184, 80, 66, 0.18);
          border-color: var(--terracotta);
        }
        .motion-thumb-wrap {
          position: relative;
          height: 165px;
          overflow: hidden;
          background: #F5EFEB;
        }
        .motion-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .motion-card:hover .motion-thumb-wrap img {
          transform: scale(1.06);
        }
        .motion-badge {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(18, 14, 11, 0.72);
          backdrop-filter: blur(4px);
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .motion-content {
          padding: 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .craft-tag {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--terracotta);
          margin-bottom: 4px;
        }
        .motion-content h4 {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
          margin-bottom: 6px;
        }
        .motion-content p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.45;
          flex: 1;
          margin: 0;
        }
      `}</style>
    </section>
  );
}
