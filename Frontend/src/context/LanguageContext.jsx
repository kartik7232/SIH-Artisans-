import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/i18n';
import { speakText, stopSpeaking, isSpeaking as checkSpeaking } from '../services/audioSpeech';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default is 'en' (English) as explicitly requested
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('karigar_lang');
      return saved || 'en';
    } catch {
      return 'en';
    }
  });

  const [speaking, setSpeaking] = useState(false);

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('karigar_lang', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key) => {
    return getTranslation(key, lang);
  };

  const speak = (text, overrideLang = null) => {
    const targetLang = overrideLang || lang;
    speakText(text, targetLang);
    setSpeaking(true);
    // Auto-check speaking status
    const interval = setInterval(() => {
      if (!checkSpeaking()) {
        setSpeaking(false);
        clearInterval(interval);
      }
    }, 250);
  };

  const stop = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t,
      speak,
      stopSpeaking: stop,
      isSpeaking: speaking,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageInfo
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
