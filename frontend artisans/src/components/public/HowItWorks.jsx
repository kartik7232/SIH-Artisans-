import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Camera, Sparkles, Mic, FileCheck, IndianRupee, ShoppingBag, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useLanguage();
  const { navigate } = useApp();

  const steps = [
    {
      num: "01",
      icon: Camera,
      title: "Physical Craft Capture",
      desc: "Artisan takes a single photo with simple alignment reticle and automatic lighting check.",
      tech: "Computer Vision & Edge Capture"
    },
    {
      num: "02",
      icon: Sparkles,
      title: "AI Studio Enhancement",
      desc: "Instantly removes cluttered workshop backdrops, restores true natural dye luster, and formats for e-commerce.",
      tech: "Diffusion Image Inpainting"
    },
    {
      num: "03",
      icon: Mic,
      title: "Voice-First Storytelling",
      desc: "Artisan speaks in their mother tongue (Hindi, Tamil, Bengali, Telugu, etc.) describing the craft, loom, and lineage.",
      tech: "Bhashini & Multilingual ASR"
    },
    {
      num: "04",
      icon: FileCheck,
      title: "NLP Metadata & Translation",
      desc: "Our craft taxonomy extracts material, technique, and GI region, generating bilingual English & regional listings with SEO tags.",
      tech: "Domain NLP & Translation"
    },
    {
      num: "05",
      icon: IndianRupee,
      title: "Dynamic Smart Pricing",
      desc: "Calculates transparent fair wage using raw material bills, pit-loom hours, and real-time metropolitan market benchmarks.",
      tech: "Pricing & Fair-Wage Algorithms"
    },
    {
      num: "06",
      icon: ShoppingBag,
      title: "Direct Marketplace & B2B Linkage",
      desc: "Published instantly to KarigarAI verified artisan marketplace, B2B wholesale matching hub, and GeM/ONDC export packages.",
      tech: "Multi-Channel Marketplace Engine"
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="section-header-center">
          <span className="section-eyebrow">THE HERO PIPELINE</span>
          <h2 className="section-title">From Physical Craft to Global Market</h2>
          <p className="section-desc">
            A seamless journey designed for zero digital literacy. The artisan holds their craft, speaks in their mother tongue, and KarigarAI powers the rest.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-header">
                <span className="step-number">{step.num}</span>
                <div className="step-icon-wrap">
                  <step.icon size={22} />
                </div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              <div className="step-tech-tag">
                <span className="tech-badge">⚡ {step.tech}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="how-cta-center">
          <button 
            className="btn btn-voice"
            onClick={() => navigate('studio')}
          >
            <span>Experience AI Product Studio</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .how-it-works-section {
          padding: 96px 0;
          background: var(--bg-main);
        }
        .section-header-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 56px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 960px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
        .step-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 30px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
          transition: all 0.25s ease;
        }
        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(169, 84, 58, 0.3);
        }
        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .step-number {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
        }
        .step-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .step-desc {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }
        .tech-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--secondary);
          background: var(--secondary-light);
          padding: 4px 10px;
          border-radius: 6px;
        }
        .how-cta-center {
          margin-top: 56px;
          text-align: center;
        }
      `}</style>
    </section>
  );
}
