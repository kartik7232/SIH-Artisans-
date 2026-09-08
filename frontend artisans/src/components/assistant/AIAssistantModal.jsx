import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Mic, 
  Send, 
  Volume2, 
  HelpCircle, 
  IndianRupee, 
  Globe, 
  TrendingUp, 
  Camera 
} from 'lucide-react';

export default function AIAssistantModal() {
  const { lang, t, speak } = useLanguage();
  const { isAssistantOpen, closeAssistant, assistantInitialQuery } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: lang === 'hi' 
        ? "नमस्ते! मैं आपका कारीगर AI व्यावसायिक सहायक हूँ। आप मुझसे मूल्य निर्धारण, अनुवाद, फोटो सुधार या बाज़ार के रुझानों के बारे में कुछ भी पूछ सकते हैं।"
        : "Namaste! I am your KarigarAI business advisor. You can ask me in your language about fair pricing, photo improvement, English translations, or B2B buyer leads."
    }
  ]);

  useEffect(() => {
    if (assistantInitialQuery) {
      handleUserAsk(assistantInitialQuery);
    }
  }, [assistantInitialQuery]);

  const presetQuestions = [
    { text: "What price should I set for my silk saree?", icon: IndianRupee },
    { text: "Translate my craft story to English", icon: Globe },
    { text: "How do I improve lighting for my photos?", icon: Camera },
    { text: "Which craft is trending this festive season?", icon: TrendingUp }
  ];

  const handleUserAsk = (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent artisan response
    setTimeout(() => {
      let aiResponseText = "";
      const lower = queryText.toLowerCase();

      if (lower.includes('price') || lower.includes('दाम') || lower.includes('मूल्य')) {
        aiResponseText = lang === 'hi'
          ? "आपकी शुद्ध चंदेरी साड़ी के लिए कच्चे माल (₹700) और 36 घंटे के कुशल श्रम (₹500) के आधार पर ₹1,650 एक सर्वोत्तम उचित मूल्य है। इससे आपको 40% शुद्ध कारीगर मुनाफा मिलेगा।"
          : "Based on your raw materials (₹700) and 36 hours of master pit-loom labor (₹500), ₹1,650 is an optimal fair price. It aligns with metropolitan handloom benchmarks and delivers a fair artisan wage.";
      } else if (lower.includes('translate') || lower.includes('अनुवाद')) {
        aiResponseText = lang === 'hi'
          ? "अंग्रेजी अनुवाद: 'Handcrafted pure Chanderi silk saree woven with traditional gold zari booti motifs by master artisan Meena Devi in Ashoknagar, Madhya Pradesh.'"
          : "Translation: 'Handcrafted pure Chanderi silk saree woven with traditional gold zari booti motifs by master artisan Meena Devi in Ashoknagar, Madhya Pradesh.'";
      } else if (lower.includes('lighting') || lower.includes('photo') || lower.includes('फोटो')) {
        aiResponseText = lang === 'hi'
          ? "उत्पाद को सुबह की प्राकृतिक धूप या सफेद एलईडी के सामने रखें। बैकग्राउंड साफ रखें। या फिर AI प्रोडक्ट स्टूडियो के 'Clean Studio' फीचर का उपयोग करें!"
          : "Place your handicraft in soft morning daylight or under white diffuse LED lighting. Keep the background neutral, or use our AI Studio's 'Clean Studio' background filter to automatically eliminate shadows.";
      } else {
        aiResponseText = lang === 'hi'
          ? "त्योहारी मौसम में चंदेरी साड़ियाँ और टेराकोटा दीयों की मांग 2.3 गुना अधिक है। यदि आप B2B थोक खरीदारों को समय पर डिलीवरी का आश्वासन दें, तो आपको 500+ यूनिट के बड़े ऑर्डर मिल सकते हैं।"
          : "Currently, handwoven textiles and terracotta craft items are experiencing a 2.3× surge in buyer interest for festive corporate gifting. We recommend maintaining at least 15–20 units in stock.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
      speak(aiResponseText);
    }, 600);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleUserAsk("What price should I keep for my handwoven saree?");
    }, 2000);
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="assistant-drawer-overlay" onClick={closeAssistant}>
      <div className="assistant-drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <div className="sparkle-circle">
              <Sparkles size={18} />
            </div>
            <div>
              <h3>{t('assistantTitle')}</h3>
              <p>{t('assistantSubtitle')}</p>
            </div>
          </div>
          <button className="close-btn" onClick={closeAssistant}>
            <X size={20} />
          </button>
        </div>

        {/* Conversation Message List */}
        <div className="chat-messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-wrap ${msg.sender}`}>
              <div className="chat-bubble">
                <p>{msg.text}</p>
                {msg.sender === 'ai' && (
                  <button 
                    className="msg-listen-icon"
                    onClick={() => speak(msg.text)}
                    title="Listen aloud"
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isRecording && (
            <div className="chat-bubble-wrap user">
              <div className="chat-bubble recording">
                <span>🎙️ Listening to your voice...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="suggested-prompts-tray">
          <span className="tray-label">{lang === 'hi' ? 'त्वरित सुझाव:' : 'Quick Suggestions:'}</span>
          <div className="prompts-chips-row">
            {presetQuestions.map((q, idx) => (
              <button 
                key={idx}
                className="prompt-chip"
                onClick={() => handleUserAsk(q.text)}
              >
                <q.icon size={13} />
                <span>{q.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="drawer-input-bar">
          <button 
            className={`voice-record-btn ${isRecording ? 'active' : ''}`}
            onClick={handleSimulateVoice}
            title="Speak your question in any language"
          >
            <Mic size={20} />
          </button>

          <input 
            type="text"
            placeholder={t('assistantPlaceholder')}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUserAsk(inputQuery)}
          />

          <button 
            className="send-msg-btn"
            onClick={() => handleUserAsk(inputQuery)}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .assistant-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          z-index: 1050;
          display: flex;
          justify-content: flex-end;
        }
        .assistant-drawer-panel {
          width: 440px;
          max-width: 100%;
          height: 100%;
          background: #FFFFFF;
          box-shadow: -8px 0 32px rgba(15, 23, 42, 0.2);
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #1B2A4A 0%, #121D33 100%);
          color: #FFFFFF;
        }
        .drawer-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sparkle-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        .drawer-header h3 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: #FFFFFF;
          margin-bottom: 2px;
        }
        .drawer-header p {
          font-size: 0.75rem;
          color: #CBD5E1;
        }
        .drawer-header .close-btn {
          color: #CBD5E1;
        }
        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: var(--bg-main);
        }
        .chat-bubble-wrap {
          display: flex;
          width: 100%;
        }
        .chat-bubble-wrap.user {
          justify-content: flex-end;
        }
        .chat-bubble-wrap.ai {
          justify-content: flex-start;
        }
        .chat-bubble {
          max-width: 82%;
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.5;
          position: relative;
        }
        .chat-bubble-wrap.user .chat-bubble {
          background: var(--primary);
          color: #FFFFFF;
          border-bottom-right-radius: 4px;
        }
        .chat-bubble-wrap.ai .chat-bubble {
          background: #FFFFFF;
          color: var(--text-primary);
          border: 1px solid var(--border-light);
          border-bottom-left-radius: 4px;
          box-shadow: var(--shadow-sm);
        }
        .chat-bubble.recording {
          background: #DC2626;
          color: #FFFFFF;
          animation: recPulse 1s infinite;
        }
        .msg-listen-icon {
          display: inline-flex;
          align-items: center;
          margin-top: 8px;
          color: var(--primary);
          cursor: pointer;
        }
        .suggested-prompts-tray {
          padding: 12px 20px;
          background: #FFFFFF;
          border-top: 1px solid var(--border-light);
        }
        .tray-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          display: block;
          margin-bottom: 8px;
        }
        .prompts-chips-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .prompt-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border-medium);
          background: var(--bg-subtle);
          font-size: 0.78rem;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .prompt-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .drawer-input-bar {
          padding: 16px 20px;
          background: #FFFFFF;
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .voice-record-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .voice-record-btn.active {
          background: #DC2626;
          color: #FFFFFF;
          animation: recPulse 1s infinite;
        }
        .drawer-input-bar input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .send-msg-btn {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
