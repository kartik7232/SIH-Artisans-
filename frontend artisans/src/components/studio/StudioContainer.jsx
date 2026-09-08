import React, { useState } from 'react';
import { cultureAssets } from '../../config/cultureAssets';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import aiService from '../../services/aiService';
import { 
  Camera, 
  Sparkles, 
  Mic, 
  FileText, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Volume2, 
  Sliders, 
  Crop, 
  Sun, 
  RotateCcw,
  Check, 
  Upload, 
  Layers, 
  Share2,
  ShoppingBag,
  Building2,
  FileCheck,
  Tag,
  Download
} from 'lucide-react';

export default function StudioContainer() {
  const { lang, t, speak, isSpeaking } = useLanguage();
  const { studioState, setStudioState, addPublishedProduct, navigate } = useApp();

  // Current stage: 1 (Capture), 2 (Enhance), 3 (Voice), 4 (Attributes/NLP), 5 (Catalog/SEO), 6 (Pricing), 7 (Publish/Readiness)
  const [stage, setStage] = useState(1);

  // Preset sample crafts for 1-click quick testing using authentic uploaded artisan craft photos
  const sampleCrafts = [
    {
      name: "Jaipur Cobalt Blue Pottery Vase",
      rawImg: cultureAssets.crafts.jaipurBluePotteryArtisan,
      enhancedImg: cultureAssets.crafts.jaipurBluePotteryArtisan,
      craft: "Jaipur Blue Pottery",
      material: "Quartz Stone, Fuller's Earth & Natural Cobalt",
      technique: "Hand-turned on wheel & brush painted",
      region: "Jaipur, Rajasthan",
      price: 1850,
      transcript: "This is a traditional Jaipur blue pottery vase hand-turned and painted with cobalt floral arabesques by women artisans in Sanganer."
    },
    {
      name: "Meenakari Enameled Copper Vessels",
      rawImg: cultureAssets.crafts.enameledCopperPottery,
      enhancedImg: cultureAssets.crafts.enameledCopperPottery,
      craft: "Copper Repoussé & Meenakari",
      material: "Pure Copper & Vitreous Enamel",
      technique: "Hand-hammered & kiln-enameled",
      region: "Moradabad & Kashmir",
      price: 2400,
      transcript: "Hand-beaten pure copper vases and platters decorated with intricate floral Meenakari enamel, fired at 800 degrees."
    },
    {
      name: "Kashmiri Lotus Aari Embroidery",
      rawImg: cultureAssets.crafts.kashmiriAariEmbroidery,
      enhancedImg: cultureAssets.crafts.kashmiriAariEmbroidery,
      craft: "Aari Crewel Needlework",
      material: "Natural Flax Linen & Woolen Floss",
      technique: "Fine chain-stitch hook embroidery",
      region: "Srinagar, Jammu & Kashmir",
      price: 1450,
      transcript: "Fine Kashmiri Aari needlework handcrafted on a wooden tambour hoop featuring traditional Chinar and lotus bloom motifs."
    },
    {
      name: "Warli Tribal Terracotta Bell Lamp",
      rawImg: cultureAssets.crafts.tribalTerracottaLamp,
      enhancedImg: cultureAssets.crafts.tribalTerracottaLamp,
      craft: "Terracotta & Tribal Folk Art",
      material: "River Clay, Natural Jute & Brass Ghungroos",
      technique: "Wheel-thrown base with hand-painted Warli ritual art",
      region: "Dahanu, Maharashtra",
      price: 1250,
      transcript: "Earthen terracotta bedside lamp stand hand-wrapped in natural braided jute with auspicious brass bells and Warli folk paintings."
    },
    {
      name: "Handwoven Bamboo Fiber Basket",
      rawImg: cultureAssets.crafts.bambooBasketWeaving,
      enhancedImg: cultureAssets.crafts.bambooBasketWeaving,
      craft: "Bamboo & Cane Weaving",
      material: "Wild Forest Bamboo & River Grass",
      technique: "Hand-split diagonal wicker weave",
      region: "Barpeta, Assam",
      price: 650,
      transcript: "Traditional hand-plaited bamboo basket woven using fine flexible bamboo slivers for eco-friendly zero-plastic storage."
    }
  ];

  // Stage 1: Selected photo
  const [photoUrl, setPhotoUrl] = useState(
    studioState.image || sampleCrafts[0].rawImg
  );
  const [enhancedUrl, setEnhancedUrl] = useState(
    studioState.enhancedImage || sampleCrafts[0].enhancedImg
  );
  const [bgMode, setBgMode] = useState('clean'); // 'clean' | 'white' | 'warm' | 'original'
  const [lightingAuto, setLightingAuto] = useState(true);
  const [aspectCrop, setAspectCrop] = useState('square');

  // Stage 3: Voice Simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [voiceDone, setVoiceDone] = useState(true);

  // Stage 5: Catalog Language Tab
  const [catalogTab, setCatalogTab] = useState('en'); // 'en' | 'hi'

  // Stage 6: Pricing slider and strategy
  const [sliderPrice, setSliderPrice] = useState(1650);
  const [strategy, setStrategy] = useState('balanced'); // 'quicksale' | 'balanced' | 'premium'

  // Stage 7: Published state
  const [publishSuccess, setPublishSuccess] = useState(false);

  const stagesList = [
    { num: 1, label: t('studioStage1'), icon: Camera },
    { num: 2, label: t('studioStage2'), icon: Sparkles },
    { num: 3, label: t('studioStage3'), icon: Mic },
    { num: 4, label: t('studioStage4'), icon: Layers },
    { num: 5, label: t('studioStage5'), icon: FileText },
    { num: 6, label: t('studioStage6'), icon: IndianRupee },
    { num: 7, label: t('studioStage7'), icon: CheckCircle2 }
  ];

  const handleSelectSample = (sample) => {
    setPhotoUrl(sample.rawImg);
    setEnhancedUrl(sample.enhancedImg);
    setSliderPrice(sample.price);
    if (sample.transcript) {
      setStudioState(prev => ({
        ...prev,
        transcript: sample.transcript,
        attributes: {
          ...prev.attributes,
          craft: sample.craft,
          material: sample.material,
          technique: sample.technique,
          region: sample.region
        },
        catalogData: {
          ...prev.catalogData,
          titleEn: sample.name,
          titleHi: sample.craft + " - हस्तनिर्मित पारंपरिक शिल्प",
          descEn: sample.transcript + " Handcrafted according to centuries-old artisanal traditions.",
          descHi: sample.transcript + " सदियों पुरानी हस्तशिल्प परंपरा के अनुसार निर्मित।"
        }
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoUrl(objectUrl);
      setEnhancedUrl(objectUrl);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTimer(0);
    const interval = setInterval(() => {
      setRecordingTimer(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsRecording(false);
          setVoiceDone(true);
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleSelectStrategy = (strat) => {
    setStrategy(strat);
    const calculated = aiService.calculateSmartPricing({
      rawMaterialCost: 700,
      daysOfWork: 14,
      dailyWageRate: 500,
      giCertified: true,
      strategy: strat
    });
    setSliderPrice(calculated.recommended);
  };

  const handlePublish = (target = 'marketplace') => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newProd = {
      id: `prod-${Date.now()}`,
      title: studioState.catalogData.titleEn,
      hindiTitle: studioState.catalogData.titleHi,
      price: sliderPrice,
      originalPrice: Math.round(sliderPrice * 1.25),
      image: enhancedUrl || photoUrl,
      craft: studioState.attributes.craft,
      material: studioState.attributes.material,
      region: studioState.attributes.region,
      technique: studioState.attributes.technique,
      artisanName: "Meena Devi",
      artisanId: "meena-devi",
      giCertified: true,
      aiVerified: true,
      inStock: 12,
      views: 1,
      inquiries: 0,
      description: studioState.catalogData.descEn,
      hindiDescription: studioState.catalogData.descHi
    };

    addPublishedProduct(newProd);
    setPublishSuccess(true);
  };

  return (
    <div className="studio-page-wrap studio-heritage-container">
      {/* Heritage Faded Backdrop (opacity: 0.07) */}
      <div 
        className="studio-heritage-backdrop"
        style={{ backgroundImage: `url(${cultureAssets.studio.backgroundArtwork})` }}
      />
      {/* Transparent Ambient Artisan Hands Halo */}
      <div 
        className="hands-circle-watermark"
        style={{ 
          backgroundImage: `url(${cultureAssets.imagery.artisanHandsCircle})`,
          top: '-80px',
          right: '-100px',
          opacity: 0.06
        }}
      />

      <div className="container relative-z">
        {/* Studio Stepper Bar */}
        <div className="studio-stepper-header">
          <div className="studio-title-group">
            <span className="section-eyebrow">
              <Sparkles size={14} />
              {t('studioHeading')}
            </span>
            <h2>{t('studioSubheading')}</h2>
          </div>

          <div className="studio-stepper-pills">
            {stagesList.map(st => {
              const isActive = stage === st.num;
              const isPast = stage > st.num;
              return (
                <button
                  key={st.num}
                  className={`stepper-pill ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => setStage(st.num)}
                >
                  <span className="pill-num">
                    {isPast ? <Check size={13} /> : st.num}
                  </span>
                  <span className="pill-label">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* STAGE 1: PRODUCT CAPTURE & CAMERA VIEW                       */}
        {/* ============================================================ */}
        {stage === 1 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 1 • CAMERA & UPLOAD</span>
                <h3>{t('capturePrompt')}</h3>
                <p>{t('captureInstruction')}</p>
              </div>
            </div>

            <div className="capture-layout-grid">
              {/* Camera Viewfinder Simulation */}
              <div className="camera-viewfinder-box">
                <div className="viewfinder-frame">
                  <img src={photoUrl} alt="Product Viewfinder" />
                  <div className="reticle-corner top-left" />
                  <div className="reticle-corner top-right" />
                  <div className="reticle-corner bottom-left" />
                  <div className="reticle-corner bottom-right" />

                  <div className="viewfinder-guidance-bar">
                    <span className="guide-check">✓ {t('goodLighting')}</span>
                    <span className="guide-check">✓ {t('productVisible')}</span>
                    <span className="guide-check">✓ {t('cleanFrame')}</span>
                  </div>
                </div>

                <div className="viewfinder-controls">
                  <label className="btn btn-secondary upload-btn">
                    <Upload size={16} />
                    <span>{t('uploadPhoto')}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                  <button 
                    className="btn btn-primary shutter-btn"
                    onClick={() => setStage(2)}
                  >
                    <Camera size={18} />
                    <span>{t('takePhoto')}</span>
                  </button>
                </div>
              </div>

              {/* Verified Artisan Craft Samples */}
              <div className="samples-side-box">
                <h4>{t('tryPresetSample')}</h4>
                <div className="samples-list">
                  {sampleCrafts.map((samp, idx) => (
                    <div 
                      key={idx}
                      className={`sample-craft-card ${photoUrl === samp.rawImg ? 'active' : ''}`}
                      onClick={() => handleSelectSample(samp)}
                    >
                      <img src={samp.rawImg} alt={samp.name} />
                      <div className="sample-card-text">
                        <h5>{samp.name}</h5>
                        <span>{samp.craft} • {samp.region}</span>
                      </div>
                      {photoUrl === samp.rawImg && <CheckCircle2 size={18} className="sample-checked" />}
                    </div>
                  ))}
                </div>

                <div className="stage-next-action">
                  <button className="btn btn-primary full-width" onClick={() => setStage(2)}>
                    <span>Proceed to AI Enhancement</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 2: AI IMAGE ENHANCEMENT                                */}
        {/* ============================================================ */}
        {stage === 2 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 2 • COMPUTER VISION ENHANCEMENT</span>
                <h3>{t('enhanceHeading')}</h3>
                <p>{t('enhanceSubheading')}</p>
              </div>
            </div>

            <div className="enhance-layout-grid">
              {/* Before & After Comparison */}
              <div className="before-after-view">
                <div className="comparison-side">
                  <div className="side-label">Original Artisan Workshop</div>
                  <div className="image-viewport raw">
                    <img src={photoUrl} alt="Original" />
                    <span className="viewport-badge">Raw Camera Capture</span>
                  </div>
                </div>

                <div className="comparison-arrow">→</div>

                <div className="comparison-side">
                  <div className="side-label">✨ AI Enhanced (E-commerce Ready)</div>
                  <div className={`image-viewport enhanced bg-${bgMode}`}>
                    <img src={enhancedUrl} alt="Enhanced" />
                    <span className="viewport-badge ai">98% Dye Clarity • Studio Background</span>
                  </div>
                </div>
              </div>

              {/* Enhancement Controls Bar */}
              <div className="enhancement-toolbar">
                <div className="control-group">
                  <label><Layers size={14} /> Background Style:</label>
                  <div className="toggle-btn-group">
                    <button 
                      className={`toggle-opt ${bgMode === 'clean' ? 'active' : ''}`}
                      onClick={() => setBgMode('clean')}
                    >
                      {t('bgClean')}
                    </button>
                    <button 
                      className={`toggle-opt ${bgMode === 'white' ? 'active' : ''}`}
                      onClick={() => setBgMode('white')}
                    >
                      {t('bgWhite')}
                    </button>
                    <button 
                      className={`toggle-opt ${bgMode === 'warm' ? 'active' : ''}`}
                      onClick={() => setBgMode('warm')}
                    >
                      {t('bgWarm')}
                    </button>
                    <button 
                      className={`toggle-opt ${bgMode === 'original' ? 'active' : ''}`}
                      onClick={() => setBgMode('original')}
                    >
                      {t('bgOriginal')}
                    </button>
                  </div>
                </div>

                <div className="control-group">
                  <label><Sun size={14} /> Lighting & Clarity:</label>
                  <button 
                    className={`btn ${lightingAuto ? 'btn-secondary active-border' : 'btn-secondary'}`}
                    onClick={() => setLightingAuto(!lightingAuto)}
                  >
                    ✓ {t('autoLightingBtn')}
                  </button>
                </div>

                <div className="control-group">
                  <label><Crop size={14} /> Crop Format:</label>
                  <div className="toggle-btn-group">
                    <button 
                      className={`toggle-opt ${aspectCrop === 'square' ? 'active' : ''}`}
                      onClick={() => setAspectCrop('square')}
                    >
                      {t('cropSquare')}
                    </button>
                    <button 
                      className={`toggle-opt ${aspectCrop === 'portrait' ? 'active' : ''}`}
                      onClick={() => setAspectCrop('portrait')}
                    >
                      {t('cropPortrait')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Micro-Inspection Quality Assurance */}
              <div className="micro-inspection-strip">
                <img src={cultureAssets.imagery.masterArtisanLoupe} alt="Master Loupe Calibration" className="mini-loupe-thumb" />
                <div className="micro-strip-text">
                  <strong>Master Craftsman Microscopic Standard</strong>
                  <p>AI vision model calibrated to the master jeweler's loupe — preserving authentic warp & weft micro-texture, natural mineral dyes, and gold zari luster.</p>
                </div>
                <span className="badge badge-gi">GI Grade 4K</span>
              </div>

              <div className="stage-footer-nav">
                <button className="btn btn-secondary" onClick={() => setStage(1)}>
                  <ArrowLeft size={16} />
                  <span>Back to Capture</span>
                </button>
                <button className="btn btn-primary" onClick={() => setStage(3)}>
                  <span>Looks Great, Record Voice Note</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 3: REGIONAL VOICE CATALOGUING                          */}
        {/* ============================================================ */}
        {stage === 3 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 3 • VOICE-FIRST RECOGNITION</span>
                <h3>{t('voiceHeading')}</h3>
                <p>{t('voiceSubheading')}</p>
              </div>
            </div>

            <div className="voice-stage-card">
              <div className="mic-interaction-center">
                <div 
                  className={`voice-mic-large ${isRecording ? 'pulse-anim' : ''}`}
                  onClick={startVoiceRecording}
                >
                  <Mic size={54} />
                </div>

                {isRecording ? (
                  <div className="live-waveform-wrap">
                    <div className="waveform-bars">
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                      <div className="waveform-bar" />
                    </div>
                    <span className="recording-timer-text">Recording... 00:0{recordingTimer}</span>
                  </div>
                ) : (
                  <button className="btn btn-voice" onClick={startVoiceRecording}>
                    <Mic size={18} />
                    <span>{t('holdToSpeak')}</span>
                  </button>
                )}
              </div>

              {/* Transcribed Audio & Detection Result */}
              {voiceDone && (
                <div className="voice-transcription-result">
                  <div className="transcription-status-bar">
                    <span className="detected-badge">{t('langDetectedTag')}</span>
                    <span className="nlp-badge">{t('nlpUnderstoodTag')}</span>
                    <button 
                      className="btn btn-secondary listen-btn"
                      onClick={() => speak(studioState.transcript)}
                    >
                      <Volume2 size={16} />
                      <span>{t('listenAudio')}</span>
                    </button>
                  </div>

                  <div className="transcript-speech-bubble">
                    <span className="quote-mark">“</span>
                    <p>{studioState.transcript}</p>
                    <span className="quote-mark end">”</span>
                  </div>
                </div>
              )}

              <div className="stage-footer-nav">
                <button className="btn btn-secondary" onClick={() => setStage(2)}>
                  <ArrowLeft size={16} />
                  <span>Back to Enhancement</span>
                </button>
                <button className="btn btn-primary" onClick={() => setStage(4)}>
                  <span>Analyze Attributes with AI</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 4: AI NLP UNDERSTANDING & ATTRIBUTE EXTRACTION         */}
        {/* ============================================================ */}
        {stage === 4 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 4 • NLP CRAFT ONTOLOGY</span>
                <h3>{t('nlpHeading')}</h3>
                <p>{t('nlpSubheading')}</p>
              </div>
            </div>

            <div className="attributes-extraction-grid">
              <div className="attribute-tile">
                <span className="attr-label">{t('attrCraft')}</span>
                <div className="attr-value-pill">{studioState.attributes.craft}</div>
                <span className="attr-confidence">✓ 99% GI Match</span>
              </div>

              <div className="attribute-tile">
                <span className="attr-label">{t('attrMaterial')}</span>
                <div className="attr-value-pill">{studioState.attributes.material}</div>
                <span className="attr-confidence">✓ Natural Fibres</span>
              </div>

              <div className="attribute-tile">
                <span className="attr-label">{t('attrTechnique')}</span>
                <div className="attr-value-pill">{studioState.attributes.technique}</div>
                <span className="attr-confidence">✓ Authentic Handloom</span>
              </div>

              <div className="attribute-tile">
                <span className="attr-label">{t('attrRegion')}</span>
                <div className="attr-value-pill">{studioState.attributes.region}</div>
                <span className="attr-confidence">✓ Verified Cluster</span>
              </div>

              <div className="attribute-tile">
                <span className="attr-label">{t('attrProductType')}</span>
                <div className="attr-value-pill">{studioState.attributes.productType}</div>
                <span className="attr-confidence">✓ E-commerce Categorized</span>
              </div>

              <div className="attribute-tile">
                <span className="attr-label">{t('attrLeadTime')}</span>
                <div className="attr-value-pill">{studioState.attributes.leadTime}</div>
                <span className="attr-confidence">✓ Skilled Artisan Labor</span>
              </div>
            </div>

            <div className="stage-footer-nav">
              <button className="btn btn-secondary" onClick={() => setStage(3)}>
                <ArrowLeft size={16} />
                <span>Back to Voice Note</span>
              </button>
              <button className="btn btn-primary" onClick={() => setStage(5)}>
                <span>{t('confirmAttributes')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 5: BILINGUAL AI CATALOG & SEO TAGS                     */}
        {/* ============================================================ */}
        {stage === 5 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 5 • MULTILINGUAL E-COMMERCE CATALOGUE</span>
                <h3>{t('catalogHeading')}</h3>
                <p>{t('catalogSubheading')}</p>
              </div>
            </div>

            <div className="catalog-content-layout">
              {/* Left: Product Media Preview */}
              <div className="catalog-image-box">
                <img src={enhancedUrl} alt="Product Catalogue" />
                <div className="catalog-stamp-gi">
                  <span>✓ GI Authenticated Craft</span>
                </div>
              </div>

              {/* Right: Bilingual Tabs & SEO Keywords */}
              <div className="catalog-details-box">
                {/* Language Switch Tabs */}
                <div className="catalog-language-tabs">
                  <button 
                    className={`cat-tab ${catalogTab === 'en' ? 'active' : ''}`}
                    onClick={() => setCatalogTab('en')}
                  >
                    🇬🇧 {t('tabEnglish')}
                  </button>
                  <button 
                    className={`cat-tab ${catalogTab === 'hi' ? 'active' : ''}`}
                    onClick={() => setCatalogTab('hi')}
                  >
                    🇮🇳 {t('tabRegional')}
                  </button>
                </div>

                {/* Generated Content Body */}
                <div className="catalog-body-preview">
                  {catalogTab === 'en' ? (
                    <div>
                      <h4 className="catalog-title-text">{studioState.catalogData.titleEn}</h4>
                      <div className="audio-listen-bar">
                        <button 
                          className="btn btn-secondary listen-btn"
                          onClick={() => speak(studioState.catalogData.descEn, 'en')}
                        >
                          <Volume2 size={16} />
                          <span>{t('listenDesc')} (English Audio)</span>
                        </button>
                      </div>
                      <p className="catalog-desc-text">{studioState.catalogData.descEn}</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="catalog-title-text hindi-font">{studioState.catalogData.titleHi}</h4>
                      <div className="audio-listen-bar">
                        <button 
                          className="btn btn-secondary listen-btn"
                          onClick={() => speak(studioState.catalogData.descHi, 'hi')}
                        >
                          <Volume2 size={16} />
                          <span>{lang === 'hi' ? `${t('listenDesc')} (हिन्दी में सुनें)` : t('listenDesc')}</span>
                        </button>
                      </div>
                      <p className="catalog-desc-text hindi-font">{studioState.catalogData.descHi}</p>
                    </div>
                  )}
                </div>

                {/* SEO Keywords Badges */}
                <div className="seo-section-box">
                  <div className="seo-header">
                    <Tag size={16} className="seo-icon" />
                    <h5>{t('seoKeywordsHeading')}</h5>
                  </div>
                  <div className="seo-tags-wrap">
                    {studioState.catalogData.seoKeywords.map((tag, idx) => (
                      <span key={idx} className="seo-pill">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="stage-footer-nav">
              <button className="btn btn-secondary" onClick={() => setStage(4)}>
                <ArrowLeft size={16} />
                <span>Back to Attributes</span>
              </button>
              <button className="btn btn-primary" onClick={() => setStage(6)}>
                <span>Calculate Smart Fair Price</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 6: DYNAMIC SMART PRICING ENGINE                        */}
        {/* ============================================================ */}
        {stage === 6 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 6 • DYNAMIC FAIR PRICING ENGINE</span>
                <h3>{t('pricingHeading')}</h3>
                <p>{t('pricingSubheading')}</p>
              </div>
            </div>

            <div className="pricing-engine-grid">
              {/* Interactive Price Slider Box */}
              <div className="pricing-slider-card">
                <span className="pricing-card-tag">{t('recommendedPriceLabel')}</span>
                <div className="price-big-display">
                  ₹{Number(sliderPrice || 0).toLocaleString()}
                </div>

                {/* Slider Component */}
                <div className="price-slider-wrap">
                  <input 
                    type="range" 
                    min="1400" 
                    max="1900" 
                    step="50"
                    value={sliderPrice}
                    onChange={e => setSliderPrice(Number(e.target.value))}
                    className="smart-price-slider"
                  />
                  <div className="slider-ticks">
                    <span>₹1,450 ({t('sliderMinLabel')})</span>
                    <span className="rec-tick">● ₹1,650 (Fair Wage)</span>
                    <span>₹1,850 ({t('sliderMaxLabel')})</span>
                  </div>
                </div>

                {/* Pricing Strategy Selector Cards */}
                <div className="pricing-strategy-cards">
                  <div 
                    className={`strategy-opt ${strategy === 'quicksale' ? 'selected' : ''}`}
                    onClick={() => handleSelectStrategy('quicksale')}
                  >
                    <div className="strat-header">
                      <span>⚡ Quick Sale</span>
                      <strong>₹1,450</strong>
                    </div>
                    <p>High velocity, festive clearance, direct fast cashflow.</p>
                  </div>

                  <div 
                    className={`strategy-opt ${strategy === 'balanced' ? 'selected' : ''}`}
                    onClick={() => handleSelectStrategy('balanced')}
                  >
                    <div className="strat-header">
                      <span>⭐ Balanced (Recommended)</span>
                      <strong>₹1,650</strong>
                    </div>
                    <p>Optimal artisan return & fair wage benchmarked against national handicraft indices.</p>
                  </div>

                  <div 
                    className={`strategy-opt ${strategy === 'premium' ? 'selected' : ''}`}
                    onClick={() => handleSelectStrategy('premium')}
                  >
                    <div className="strat-header">
                      <span>👑 Boutique Export</span>
                      <strong>₹1,850</strong>
                    </div>
                    <p>Targeted for metropolitan design boutiques & international ethical craft buyers.</p>
                  </div>
                </div>
              </div>

              {/* Transparent Cost Breakdown */}
              <div className="pricing-breakdown-card">
                <h4>{t('costBreakdownHeading')}</h4>
                <div className="breakdown-rows-list">
                  <div className="breakdown-row">
                    <span>{t('rawMaterialCost')}</span>
                    <strong>₹700</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>{t('artisanLabourCost')}</span>
                    <strong>₹500</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>{t('heritageCraftValue')}</span>
                    <strong>₹150</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>{t('marketBenchmarkMargin')}</span>
                    <strong>₹200</strong>
                  </div>
                  <div className="breakdown-row total">
                    <span>{t('totalFairPrice')}</span>
                    <strong>₹1,650</strong>
                  </div>
                </div>

                <div className="fair-wage-guarantee-note">
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                  <span>100% of the artisan labour and craft value is transferred directly to your bank account without broker deduction.</span>
                </div>
              </div>
            </div>

            <div className="stage-footer-nav">
              <button className="btn btn-secondary" onClick={() => setStage(5)}>
                <ArrowLeft size={16} />
                <span>Back to Catalogue</span>
              </button>
              <button className="btn btn-primary" onClick={() => setStage(7)}>
                <span>Review Marketplace Readiness</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STAGE 7: MARKETPLACE READINESS CHECKLIST & PUBLISH           */}
        {/* ============================================================ */}
        {stage === 7 && (
          <div className="studio-card-panel">
            <div className="stage-header-row">
              <div>
                <span className="stage-tag">STEP 7 • MARKETPLACE READINESS & MULTI-CHANNEL EXPORT</span>
                <h3>{t('readinessHeading')}</h3>
                <p>{t('readinessSubheading')}</p>
              </div>
            </div>

            <div className="readiness-complete-wrap">
              {/* 100% Progress Header */}
              <div className="progress-100-banner">
                <div className="prog-text">
                  <CheckCircle2 size={28} className="prog-icon" />
                  <div>
                    <h4>All 10 Quality & Export Verification Checks Passed</h4>
                    <p>Ready to distribute across national and international artisan marketplaces.</p>
                  </div>
                </div>
                <span className="badge badge-success">100% Verified</span>
              </div>

              {/* 10-Item Verified Checklist Grid */}
              <div className="readiness-items-grid">
                <div className="ready-chk-item">{t('checkImage')}</div>
                <div className="ready-chk-item">{t('checkTitle')}</div>
                <div className="ready-chk-item">{t('checkDescription')}</div>
                <div className="ready-chk-item">{t('checkTranslation')}</div>
                <div className="ready-chk-item">{t('checkAttributes')}</div>
                <div className="ready-chk-item">{t('checkSeo')}</div>
                <div className="ready-chk-item">{t('checkPrice')} (₹{sliderPrice})</div>
                <div className="ready-chk-item">{t('checkInventory')} (12 Units)</div>
                <div className="ready-chk-item">{t('checkArtisan')}</div>
                <div className="ready-chk-item">✓ B2B Wholesale Capability Ready</div>
              </div>

              {/* Multi-Channel Distribution Cards */}
              <div className="distribution-channels-grid">
                <div className="channel-box">
                  <div className="chan-icon">🛍️</div>
                  <h5>KarigarAI Direct Marketplace</h5>
                  <p>100% direct-to-consumer sales with zero commission.</p>
                  <button 
                    className="btn btn-primary full-width"
                    onClick={() => handlePublish('marketplace')}
                  >
                    {publishSuccess ? "✓ Published!" : t('publishToMarketplace')}
                  </button>
                </div>

                <div className="channel-box">
                  <div className="chan-icon">🏢</div>
                  <h5>B2B Wholesale Hub</h5>
                  <p>Matches institutional buyers & exporters for 500+ unit bulk orders.</p>
                  <button 
                    className="btn btn-accent full-width"
                    onClick={() => handlePublish('b2b')}
                  >
                    {t('publishToB2b')}
                  </button>
                </div>

                <div className="channel-box">
                  <div className="chan-icon">📄</div>
                  <h5>Government GeM / ONDC</h5>
                  <p>Pre-formatted JSON package compliant with Indian Public Procurement.</p>
                  <button 
                    className="btn btn-secondary full-width"
                    onClick={() => handlePublish('govt')}
                  >
                    <Download size={14} />
                    <span>{t('exportGovtPackage')}</span>
                  </button>
                </div>
              </div>

              {/* Success Notification Alert */}
              {publishSuccess && (
                <div className="publish-celebration-banner">
                  <Sparkles size={32} />
                  <div>
                    <h4>Congratulations Meena Ji! Your product is now LIVE in the Artisan Marketplace!</h4>
                    <p>Buyers across India can now view your catalog, place orders, or request bulk samples.</p>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('marketplace')}
                  >
                    <span>View in Artisan Marketplace</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .studio-page-wrap {
          padding: 40px 0 80px;
          min-height: calc(100vh - 72px);
          position: relative;
        }
        .relative-z {
          position: relative;
          z-index: 2;
        }
        .studio-stepper-header {
          margin-bottom: 32px;
        }
        .studio-title-group h2 {
          font-family: var(--font-serif);
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          color: var(--text-primary);
          margin-top: 4px;
        }
        .studio-stepper-pills {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .stepper-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .stepper-pill:hover {
          border-color: var(--primary);
        }
        .stepper-pill.active {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
          box-shadow: 0 4px 14px rgba(169, 84, 58, 0.3);
        }
        .stepper-pill.past {
          background: var(--primary-light);
          color: var(--primary);
          border-color: rgba(169, 84, 58, 0.3);
        }
        .pill-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .stepper-pill.active .pill-num {
          background: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
        }
        .studio-card-panel {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 36px;
          box-shadow: var(--shadow-lg);
        }
        @media (max-width: 768px) {
          .studio-card-panel {
            padding: 20px 16px;
          }
        }
        .stage-header-row {
          margin-bottom: 28px;
        }
        .stage-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 4px;
        }
        .stage-header-row h3 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .stage-header-row p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .capture-layout-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 32px;
        }
        @media (max-width: 900px) {
          .capture-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        .camera-viewfinder-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .viewfinder-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: #1E293B;
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .viewfinder-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .reticle-corner {
          position: absolute;
          width: 32px;
          height: 32px;
          border-color: rgba(255, 255, 255, 0.85);
          border-style: solid;
        }
        .reticle-corner.top-left { top: 20px; left: 20px; border-width: 3px 0 0 3px; }
        .reticle-corner.top-right { top: 20px; right: 20px; border-width: 3px 3px 0 0; }
        .reticle-corner.bottom-left { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; }
        .reticle-corner.bottom-right { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; }
        .viewfinder-guidance-bar {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          padding: 8px 14px;
          border-radius: 8px;
          display: flex;
          justify-content: space-around;
          font-size: 0.78rem;
          color: #E2E8F0;
        }
        .guide-check {
          color: #4ADE80;
          font-weight: 600;
        }
        .viewfinder-controls {
          display: flex;
          gap: 16px;
        }
        .shutter-btn {
          flex: 1;
        }
        .samples-side-box h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 14px;
        }
        .samples-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .sample-craft-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px;
          border: 1px solid var(--border-medium);
          border-radius: 10px;
          cursor: pointer;
          background: #FFFFFF;
          transition: all 0.2s ease;
        }
        .sample-craft-card:hover {
          border-color: var(--primary);
        }
        .sample-craft-card.active {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .sample-craft-card img {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
        }
        .sample-card-text h5 {
          font-size: 0.92rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .sample-card-text span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .sample-checked {
          margin-left: auto;
          color: var(--primary);
        }
        .enhance-layout-grid {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .before-after-view {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .before-after-view {
            flex-direction: column;
          }
        }
        .comparison-side {
          flex: 1;
          width: 100%;
        }
        .side-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .image-viewport {
          position: relative;
          aspect-ratio: 1/1;
          border-radius: 12px;
          overflow: hidden;
          background: #E2E8F0;
        }
        .image-viewport img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-viewport.bg-white { background: #FFFFFF; }
        .image-viewport.bg-clean { background: #F8FAFC; }
        .image-viewport.bg-warm { background: #FAF5EB; }
        .viewport-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(15, 23, 42, 0.75);
          color: #FFFFFF;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .viewport-badge.ai {
          background: rgba(27, 42, 74, 0.85);
          border: 1px solid rgba(197, 154, 63, 0.4);
          color: #F8FAFC;
        }
        .comparison-arrow {
          font-size: 2rem;
          color: var(--primary);
          font-weight: 700;
        }
        .enhancement-toolbar {
          background: var(--bg-subtle);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .control-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .toggle-btn-group {
          display: flex;
          gap: 6px;
        }
        .toggle-opt {
          padding: 6px 12px;
          border: 1px solid var(--border-medium);
          border-radius: 6px;
          background: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .toggle-opt.active {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
        }
        .stage-footer-nav {
          display: flex;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid var(--border-light);
          margin-top: 24px;
        }
        .voice-stage-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mic-interaction-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 32px 0;
        }
        .voice-mic-large {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(169, 84, 58, 0.25);
          margin-bottom: 24px;
          transition: all 0.25s ease;
        }
        .pulse-anim {
          background: #DC2626;
          color: #FFFFFF;
          animation: recPulse 1s infinite;
        }
        .recording-timer-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #DC2626;
        }
        .voice-transcription-result {
          width: 100%;
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .transcription-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .detected-badge {
          background: var(--accent-green-light);
          color: var(--accent-green);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .nlp-badge {
          background: var(--secondary-light);
          color: var(--secondary);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .transcript-speech-bubble {
          font-size: 1.15rem;
          font-style: italic;
          color: var(--text-primary);
          line-height: 1.6;
          background: #FFFFFF;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }
        .quote-mark {
          font-size: 1.8rem;
          color: var(--primary);
          font-family: var(--font-serif);
        }
        .attributes-extraction-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 24px 0 32px;
        }
        @media (max-width: 768px) {
          .attributes-extraction-grid {
            grid-template-columns: 1fr;
          }
        }
        .attribute-tile {
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .attr-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .attr-value-pill {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .attr-confidence {
          font-size: 0.78rem;
          color: var(--accent-green);
          font-weight: 600;
        }
        .catalog-content-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 32px;
          margin: 24px 0;
        }
        @media (max-width: 860px) {
          .catalog-content-layout {
            grid-template-columns: 1fr;
          }
        }
        .catalog-image-box {
          position: relative;
          aspect-ratio: 1/1;
          border-radius: 12px;
          overflow: hidden;
          background: #F1EFE9;
        }
        .catalog-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .catalog-stamp-gi {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #8B6514;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          border: 1px solid rgba(197, 154, 63, 0.3);
        }
        .catalog-language-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .cat-tab {
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid var(--border-medium);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: #FFFFFF;
        }
        .cat-tab.active {
          background: var(--primary);
          color: #FFFFFF;
          border-color: var(--primary);
        }
        .catalog-title-text {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .hindi-font {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .audio-listen-bar {
          margin-bottom: 14px;
        }
        .catalog-desc-text {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 24px;
        }
        .seo-section-box {
          background: var(--bg-subtle);
          border-radius: 10px;
          padding: 16px;
        }
        .seo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 10px;
        }
        .seo-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .seo-pill {
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          color: var(--primary);
          font-weight: 600;
        }
        .pricing-engine-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 32px;
          margin: 24px 0;
        }
        @media (max-width: 860px) {
          .pricing-engine-grid {
            grid-template-columns: 1fr;
          }
        }
        .pricing-card-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.12em;
        }
        .price-big-display {
          font-family: var(--font-serif);
          font-size: 3.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 8px 0 20px;
          line-height: 1;
        }
        .price-slider-wrap {
          margin-bottom: 28px;
        }
        .smart-price-slider {
          width: 100%;
          height: 8px;
          accent-color: var(--primary);
          cursor: pointer;
        }
        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 8px;
        }
        .rec-tick {
          color: var(--primary);
          font-weight: 700;
        }
        .pricing-strategy-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .strategy-opt {
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          padding: 14px;
          cursor: pointer;
          background: #FFFFFF;
          transition: all 0.2s ease;
        }
        .strategy-opt:hover {
          border-color: var(--primary);
        }
        .strategy-opt.selected {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .strat-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .strategy-opt p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .pricing-breakdown-card {
          background: var(--bg-subtle);
          border-radius: 12px;
          padding: 24px;
        }
        .pricing-breakdown-card h4 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .breakdown-rows-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }
        .breakdown-row.total {
          border-top: 2px solid var(--border-medium);
          padding-top: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
        }
        .fair-wage-guarantee-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #FFFFFF;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
        }
        .readiness-complete-wrap {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin: 20px 0;
        }
        .progress-100-banner {
          background: var(--accent-green-light);
          border: 1px solid rgba(46, 125, 50, 0.3);
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .prog-text {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .prog-icon {
          color: var(--accent-green);
        }
        .prog-text h4 {
          font-size: 1.1rem;
          color: #166534;
          margin-bottom: 2px;
        }
        .prog-text p {
          font-size: 0.85rem;
          color: #15803D;
        }
        .readiness-items-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (max-width: 640px) {
          .readiness-items-grid {
            grid-template-columns: 1fr;
          }
        }
        .ready-chk-item {
          background: var(--bg-subtle);
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.88rem;
          color: var(--text-primary);
          font-weight: 600;
        }
        .distribution-channels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 860px) {
          .distribution-channels-grid {
            grid-template-columns: 1fr;
          }
        }
        .channel-box {
          background: #FFFFFF;
          border: 1px solid var(--border-medium);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .chan-icon {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }
        .channel-box h5 {
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .channel-box p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          flex: 1;
        }
        .publish-celebration-banner {
          background: linear-gradient(135deg, #FAF4E6 0%, #F5EAE0 100%);
          border: 1px solid var(--primary);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          color: var(--primary);
        }
        .publish-celebration-banner h4 {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .publish-celebration-banner p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .micro-inspection-strip {
          background: #FFFFFF;
          border: 1px solid var(--border-gold, rgba(197, 154, 63, 0.4));
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 18px;
          box-shadow: 0 4px 16px rgba(197, 154, 63, 0.08);
        }
        .mini-loupe-thumb {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--border-medium);
        }
        .micro-strip-text {
          flex: 1;
        }
        .micro-strip-text strong {
          font-size: 0.92rem;
          color: var(--text-primary);
          display: block;
          margin-bottom: 2px;
        }
        .micro-strip-text p {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
