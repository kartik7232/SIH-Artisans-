/**
 * KARIGARAI - Audio & Speech Synthesis Service
 * Provides native text-to-speech so low-literacy artisans
 * can tap any speaker icon to hear instructions and catalog copy in their preferred language.
 */

let currentUtterance = null;

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  kn: 'kn-IN'
};

export const speakText = (text, langCode = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) return;

  const targetLang = LANG_MAP[langCode] || 'en-IN';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  utterance.rate = 0.92; // Slightly measured rate for crystal clear audio
  utterance.pitch = 1.0;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(langCode) || 
      v.lang.toLowerCase().includes(langCode)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

export default {
  speakText,
  stopSpeaking,
  isSpeaking
};
