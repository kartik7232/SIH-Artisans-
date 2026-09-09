import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Mic, 
  Check, 
  ArrowRight, 
  Volume2, 
  Layers, 
  Heart,
  Palette,
  Scissors
} from 'lucide-react';
import cultureAssets from '../../config/cultureAssets';

export default function ArtisanOnboarding() {
  const { lang, setLang, t, supportedLanguages, speak, isSpeaking } = useLanguage();
  const { navigate } = useApp();

  const [step, setStep] = useState(1);
  const [selectedCraft, setSelectedCraft] = useState('Textiles');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedStory, setRecordedStory] = useState('');

  const craftsList = [
    { id: 'Textiles', icon: '🧵', image: cultureAssets.imagery.batikWomenWeavers, label: t('craftTextiles'), sub: 'Sarees, Dupattas, Shawls' },
    { id: 'Pottery', icon: '🏺', image: cultureAssets.crafts.jaipurBluePotteryArtisan, label: t('craftPottery'), sub: 'Terracotta, Blue Pottery, Planters' },
    { id: 'Bamboo', icon: '🧺', image: cultureAssets.crafts.bambooBasketWeaving, label: t('craftBamboo'), sub: 'Baskets, Furniture, Lamps' },
    { id: 'Wood', icon: '🪵', image: cultureAssets.imagery.masterArtisanCraftsman, label: t('craftWood'), sub: 'Carving, Toys, Woodblocks' },
    { id: 'Jewellery', icon: '💍', image: cultureAssets.crafts.enameledCopperPottery, label: t('craftJewellery'), sub: 'Silver Filigree, Meenakari' },
    { id: 'Painting', icon: '🎨', image: cultureAssets.crafts.tribalTerracottaLamp, label: t('craftPainting'), sub: 'Madhubani, Pattachitra, Warli' },
    { id: 'Embroidery', icon: '🧶', image: cultureAssets.crafts.kashmiriAariEmbroidery, label: t('craftEmbroidery'), sub: 'Zardozi, Chikankari, Kantha' },
    { id: 'Metal', icon: '✨', image: cultureAssets.crafts.enameledCopperPottery, label: t('craftMetal'), sub: 'Dhokra, Brass, Bidriware' }
  ];

  const handleLanguageSelect = (code, nativeName) => {
    setLang(code);
    if (code === 'hi') {
      speak('नमस्ते! चलिए आपकी डिजिटल दुकान बनाते हैं।', 'hi');
    } else if (code === 'ta') {
      speak('வணக்கம்! உங்கள் டிஜிட்டல் கடையை உருவாக்குவோம்.', 'ta');
    } else {
      speak("Namaste! Let's build your digital shop.", 'en');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    const timer = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 6) {
          clearInterval(timer);
          setIsRecording(false);
          setRecordedStory(
            lang === 'hi' 
              ? "मैं मध्य प्रदेश के चंदेरी में पिछले 15 वर्षों से पारंपरिक खड्डी लूम पर शुद्ध रेशम की साड़ियाँ बुनती हूँ।"
              : "I have been weaving pure silk sarees on traditional pit looms in Chanderi, Madhya Pradesh for over 15 years."
          );
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleFinish = () => {
    navigate('artisan');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        {/* Stepper Dots */}
        <div className="onboarding-stepper">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* Step 1: Language Selection */}
        {step === 1 && (
          <div className="step-content">
            <div className="step-header">
              <span className="step-badge">{lang === 'hi' ? 'चरण १ (३ में से)' : 'STEP 1 OF 3'}</span>
              <h2>🙏 {t('onboardingStep1Title')}</h2>
              <p>{t('onboardingStep1Desc')}</p>
            </div>

            <div className="lang-grid-onboarding">
              {supportedLanguages.map(item => {
                const isSelected = lang === item.code;
                return (
                  <button
                    key={item.code}
                    className={`lang-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleLanguageSelect(item.code, item.nativeName)}
                  >
                    <span className="card-flag">{item.flag}</span>
                    <span className="card-native">{item.nativeName}</span>
                    <span className="card-sub">{item.name}</span>
                    {isSelected && <span className="check-badge"><Check size={14} /></span>}
                  </button>
                );
              })}
            </div>

            <div className="onboarding-footer">
              <button 
                className="btn btn-primary"
                onClick={() => setStep(2)}
              >
                <span>{lang === 'hi' ? 'आगे बढ़ें' : 'Continue'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: What do you make? */}
        {step === 2 && (
          <div className="step-content">
            <div className="step-header">
              <span className="step-badge">{lang === 'hi' ? 'चरण २ (३ में से)' : 'STEP 2 OF 3'}</span>
              <h2>{t('onboardingStep2Title')}</h2>
              <p>{t('onboardingStep2Desc')}</p>
            </div>

            <div className="craft-grid-onboarding">
              {craftsList.map(item => {
                const isSelected = selectedCraft === item.id;
                return (
                  <div
                    key={item.id}
                    className={`craft-card-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedCraft(item.id)}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.label} className="craft-chip-img" />
                    ) : (
                      <span className="craft-chip-emoji">{item.icon}</span>
                    )}
                    <div className="craft-chip-text">
                      <h4>{item.label}</h4>
                      <p>{item.sub}</p>
                    </div>
                    {isSelected && <div className="chip-check"><Check size={16} /></div>}
                  </div>
                );
              })}
            </div>

            <div className="onboarding-footer between">
              <button 
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                {lang === 'hi' ? 'पीछे' : 'Back'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setStep(3)}
              >
                <span>{lang === 'hi' ? 'आगे: कहानी बताएं' : 'Next: Tell Story'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Tell craft story via Voice */}
        {step === 3 && (
          <div className="step-content">
            <div className="step-header">
              <span className="step-badge">{lang === 'hi' ? 'चरण ३ (३ में से)' : 'STEP 3 OF 3'}</span>
              <h2>{t('onboardingStep3Title')}</h2>
              <p>{t('onboardingStep3Desc')}</p>
            </div>

            <div className="voice-story-interaction">
              <div className={`voice-mic-circle ${isRecording ? 'recording' : ''}`} onClick={startVoiceRecording}>
                <Mic size={48} className="mic-icon" />
              </div>

              <div className="voice-instruction">
                {isRecording ? (
                  <div className="recording-status">
                    <span className="rec-dot">●</span>
                    <span>Recording voice... 00:0{recordingSeconds}</span>
                  </div>
                ) : (
                  <button className="btn btn-voice" onClick={startVoiceRecording}>
                    <Mic size={18} />
                    <span>{t('holdToSpeak')}</span>
                  </button>
                )}
              </div>

              {recordedStory && (
                <div className="voice-transcription-box">
                  <div className="transcription-badge">
                    <span>✓ {t('audioTranscribed')}</span>
                    <button 
                      className="audio-listen-btn"
                      onClick={() => speak(recordedStory)}
                    >
                      <Volume2 size={16} />
                      <span>{t('listenAudio')}</span>
                    </button>
                  </div>
                  <p className="story-transcript-text">"{recordedStory}"</p>
                </div>
              )}
            </div>

            <div className="onboarding-footer between">
              <button 
                className="btn btn-secondary"
                onClick={() => setStep(2)}
              >
                {lang === 'hi' ? 'पीछे' : 'Back'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleFinish}
              >
                <span>{lang === 'hi' ? 'दुकान में प्रवेश करें' : 'Enter Artisan Hub'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .onboarding-page {
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--bg-main);
        }
        .onboarding-card {
          background: #FFFFFF;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          max-width: 720px;
          width: 100%;
          padding: 44px;
          box-shadow: var(--shadow-lg);
        }
        @media (max-width: 600px) {
          .onboarding-card {
            padding: 24px 16px;
          }
        }
        .onboarding-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 36px;
        }
        .step-dot {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bg-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }
        .step-dot.active {
          background: var(--primary);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(169, 84, 58, 0.3);
        }
        .step-line {
          height: 3px;
          width: 60px;
          background: var(--bg-subtle);
          transition: all 0.25s ease;
        }
        .step-line.active {
          background: var(--primary);
        }
        .step-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .step-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }
        .step-header h2 {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .step-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .lang-grid-onboarding {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 36px;
        }
        @media (max-width: 600px) {
          .lang-grid-onboarding {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .lang-card {
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 16px 12px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          transition: all 0.2s ease;
          text-align: center;
        }
        .lang-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .lang-card.selected {
          border-color: var(--primary);
          background: var(--primary-light);
          box-shadow: 0 4px 14px rgba(169, 84, 58, 0.2);
        }
        .card-flag {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }
        .card-native {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
        }
        .card-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .check-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: var(--primary);
          color: #FFFFFF;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .craft-grid-onboarding {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 36px;
        }
        @media (max-width: 600px) {
          .craft-grid-onboarding {
            grid-template-columns: 1fr;
          }
        }
        .craft-card-chip {
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #FFFFFF;
          position: relative;
        }
        .craft-card-chip:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        .craft-card-chip.selected {
          border-color: var(--primary);
          background: var(--primary-light);
          box-shadow: 0 4px 14px rgba(169, 84, 58, 0.15);
        }
        .craft-chip-emoji {
          font-size: 1.8rem;
        }
        .craft-chip-img {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }
        .craft-chip-text h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .craft-chip-text p {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .chip-check {
          position: absolute;
          right: 14px;
          color: var(--primary);
        }
        .voice-story-interaction {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 0 36px;
        }
        .voice-mic-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(169, 84, 58, 0.2);
        }
        .voice-mic-circle.recording {
          background: #E53935;
          color: #FFFFFF;
          animation: recPulse 1.2s infinite;
        }
        @keyframes recPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.5); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 16px rgba(229, 57, 53, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
        }
        .recording-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #E53935;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .rec-dot {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .voice-transcription-box {
          margin-top: 24px;
          background: var(--bg-subtle);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 18px;
          width: 100%;
        }
        .transcription-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-green);
          margin-bottom: 8px;
        }
        .audio-listen-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .story-transcript-text {
          font-size: 0.95rem;
          font-style: italic;
          color: var(--text-primary);
          line-height: 1.5;
        }
        .onboarding-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid var(--border-light);
        }
        .onboarding-footer.between {
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
