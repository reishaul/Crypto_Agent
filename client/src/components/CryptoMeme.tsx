import React, { useEffect, useState } from 'react';

//this part is for the CryptoMeme component that will be displayed on the dashboard page. It will make a request
// to the backend to get a random crypto meme and display it.

// Define the structure of a Meme item
interface MemeItem{
  id: number;
  title: string;
  imageUrl: string;
  postUrl: string;
  score: number;
  author: string;
  license: string;
}

// The CryptoMeme component fetches and displays a random crypto meme from the backend.
export default function CryptoMeme(){
  const [memes, setMemes] = useState<MemeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch memes from the backend when the component mounts
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('https://ai-crypto-agent-s5ba.onrender.com/api/memes');

        if (!response.ok) {
          throw new Error('Failed to load memes');
        }

        const data = await response.json();
        // if the server returns the array within an object under the 'memes' key
        if(data && Array.isArray(data.memes)) {
            setMemes(data.memes);
        } 
        else if(Array.isArray(data)) {
            setMemes(data); 
        } 
        else{
            setError('Invalid memes response.');
        }

      }catch (err) {
        console.error('Failed to load memes:', err);
        setError('Failed to load crypto memes.');
      } 
      finally{
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  // Function to go to the next meme in the list
  const nextMeme = () =>{
    if (memes.length > 0){
      setCurrentIndex((prevIndex) =>(prevIndex + 1) % memes.length);
    }
  };

  if(loading) return <div style={{ color: '#94a3b8', padding: '20px', textAlign: 'center' }}>Loading crypto memes...</div>;
  if(error || memes.length === 0) return <div style={{ color: '#ff6b6b', padding: '20px', textAlign: 'center' }}>{error || 'No memes available'}</div>;

  const currentMeme = memes[currentIndex];//strictly typed as MemeItem
//   const imageSrc = currentMeme.imageUrl.startsWith('http')
//     ? currentMeme.imageUrl
//     : `${import.meta.env.BASE_URL}${currentMeme.imageUrl.replace(/^\//, '')}`;

// Adjust the image URL to ensure it is absolute, using the backend's base URL if necessary
  const imageSrc = currentMeme.imageUrl.startsWith('http')
    ? currentMeme.imageUrl
    : `https://ai-crypto-agent-s5ba.onrender.com${currentMeme.imageUrl.startsWith('/') ? '' : '/'}${currentMeme.imageUrl}`;

    // Render the CryptoMeme component with a styled container and navigation button
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
      
      {/* the title of the meme */}
      <p style={{ fontSize: '15px', fontWeight: '600', margin: '10px 0', color: '#f1f5f9' }}>
        {currentMeme.title}
      </p>

      {/* the image of the meme */}
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