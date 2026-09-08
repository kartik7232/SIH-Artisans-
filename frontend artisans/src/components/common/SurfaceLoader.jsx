import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SurfaceLoader() {
  return (
    <div 
      className="surface-loader-container" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        gap: '20px',
        padding: '32px'
      }}
    >
      <style>{`
        @keyframes karigarSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes karigarPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
      <div 
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '3px solid rgba(169, 84, 58, 0.18)',
          borderTopColor: '#A9543A',
          borderRightColor: '#D4AF37',
          animation: 'karigarSpin 0.9s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite'
        }}
      />
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.92rem',
          fontWeight: '600',
          color: '#1B2A4A',
          animation: 'karigarPulse 2s ease-in-out infinite'
        }}
      >
        <Sparkles size={16} color="#D4AF37" />
        <span>Loading Karigar Craft Experience...</span>
      </div>
    </div>
  );
}
