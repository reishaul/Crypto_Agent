import React, { useEffect, useState } from 'react';

interface MemeItem {
  id: number;
  title: string;
  imageUrl: string;
  postUrl: string;
  score: number;
  author: string;
  license: string;
}

export default function CryptoMeme() {
  const [memes, setMemes] = useState<MemeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://ai-crypto-agent-s5ba.onrender.com/api/memes');

        if (!response.ok) {
          throw new Error('Failed to load memes');
        }

        const data = await response.json();
        // אם השרת מחזיר את המערך בתוך אובייקט תחת המפתח memes
        if (data && Array.isArray(data.memes)) {
            setMemes(data.memes);
        } else if (Array.isArray(data)) {
            setMemes(data); // ליתר ביטחון אם השרת יחזיר ישר מערך
        } else {
            setError('Invalid memes response.');
        }

      } catch (err) {
        console.error('Failed to load memes:', err);
        setError('Failed to load crypto memes.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const nextMeme = () => {
    if (memes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % memes.length);
    }
  };

  if (loading) return <div style={{ color: '#94a3b8', padding: '20px', textAlign: 'center' }}>Loading crypto memes...</div>;
  if (error || memes.length === 0) return <div style={{ color: '#ff6b6b', padding: '20px', textAlign: 'center' }}>{error || 'No memes available'}</div>;

  const currentMeme = memes[currentIndex];
//   const imageSrc = currentMeme.imageUrl.startsWith('http')
//     ? currentMeme.imageUrl
//     : `${import.meta.env.BASE_URL}${currentMeme.imageUrl.replace(/^\//, '')}`;

  const imageSrc = currentMeme.imageUrl.startsWith('http')
    ? currentMeme.imageUrl
    : `https://ai-crypto-agent-s5ba.onrender.com${currentMeme.imageUrl.startsWith('/') ? '' : '/'}${currentMeme.imageUrl}`;

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #102a43 0%, #243b53 100%)', 
      color: '#ffffff',
      borderRadius: '16px', 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: '#ff6b6b', margin: 0, fontSize: '18px' }}>
          😂 Crypto Meme
        </h3>
        <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
          {currentMeme.license}
        </span>
      </div>
      
      {/* כותרת המימ */}
      <p style={{ fontSize: '15px', fontWeight: '600', margin: '10px 0', color: '#f1f5f9' }}>
        {currentMeme.title}
      </p>

      {/* הצגת התמונה עצמה מתוך ה-JSON */}
      <div style={{ margin: '15px 0', background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '10px', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={imageSrc} 
          alt={currentMeme.title} 
          style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: '6px' }}
        />
      </div>
      
      <div style={{ fontSize: '12px', marginBottom: '16px', color: '#94a3b8' }}>
        <span>👤 {currentMeme.author}</span>
      </div>

      <div>
        <button 
          type="button"
          onClick={nextMeme}
          style={{ padding: '8px 16px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
        >
          Next Meme 🔄
        </button>
      </div>
    </div>
  );
}