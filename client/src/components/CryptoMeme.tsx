import React, { useState } from 'react';

export default function CryptoMeme() {
  const memes = [
    { quote: "HODL strong, the moon is just a pit stop! 🚀", mood: "Bullish 🟢" },
    { quote: "When the market dips, but you bought the top. 📉😂", mood: "Panic Buy 😅" },
    { quote: "I'm not checking charts every 5 minutes, I swear. 🖥️👀", mood: "Denial 🟡" },
    { quote: "Coffee is great, but green candles keep me awake. 🕯️🔥", mood: "Energized 🚀" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMeme = () => {
    setCurrentIndex((prev) => (prev + 1) % memes.length);
  };

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #102a43 0%, #243b53 100%)', 
      color: '#ffffff',
      borderRadius: '12px', 
      boxShadow: '0 4px 20px rgba(16, 42, 67, 0.15)',
      marginTop: '20px',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#ff6b6b', marginTop: '0', marginBottom: '12px' }}>
        🎭 Crypto Daily Vibe & Fun
      </h3>
      
      <p style={{ fontSize: '18px', fontStyle: 'italic', margin: '20px 0', color: '#f1f5f9' }}>
        "{memes[currentIndex].quote}"
      </p>
      
      <span style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px', color: '#38bdf8' }}>
        Mood: {memes[currentIndex].mood}
      </span>

      <div>
        <button 
          onClick={nextMeme}
          style={{ padding: '8px 16px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
        >
          Next Vibe 🔄
        </button>
      </div>
    </div>
  );
}