import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingPreferences } from '../services/api';
import CryptoRain from '../components/CryptoRain';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [cryptoAssets, setCryptoAssets] = useState<string[]>([]);
  const [investorType, setInvestorType] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleCryptoToggle = (crypto: string) => {
    setCryptoAssets(prev => 
      prev.includes(crypto) ? prev.filter(c => c !== crypto) : [...prev, crypto]
    );
  };

  const handleContentToggle = (contentType: string) => {
    setContentTypes(prev =>
      prev.includes(contentType)
        ? prev.filter(item => item !== contentType)
        : [...prev, contentType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveOnboardingPreferences(email, { cryptoAssets, investorType, contentTypes });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.error || 'Failed to save preferences');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b192c 0%, #102a43 50%, #1e3e62 100%)',
      padding: '20px',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      width: '100%',
      color: '#ffffff'
    }}>

    <CryptoRain />
      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px',
        background: 'rgba(16, 42, 67, 0.75)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '24px', textAlign: 'center', fontSize: '24px', fontWeight: '600' }}>
          Personalization Questionnaire
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px' }}>Your Email (for account verification):</label><br />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Which assets are you interested in?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)'].map(crypto => (
                <label key={crypto} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', cursor: 'pointer', fontSize: '14px' }}>
                  <input 
                    type="checkbox" 
                    checked={cryptoAssets.includes(crypto)} 
                    onChange={() => handleCryptoToggle(crypto)}
                    style={{ accentColor: '#ff6b6b', width: '16px', height: '16px', cursor: 'pointer' }}
                  /> {crypto}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px' }}>What is your investor profile?</label><br />
            <select 
              value={investorType} 
              onChange={(e) => setInvestorType(e.target.value)}
              style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
            >
              <option value="">Select profile...</option>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive / High Risk</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              What kind of content would you like to see?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Market news', 'Educational content', 'Memes', 'Technical analysis', 'Beginner guides'].map(contentType => (
                <label key={contentType} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={contentTypes.includes(contentType)}
                    onChange={() => handleContentToggle(contentType)}
                    style={{ accentColor: '#ff6b6b', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  {contentType}
                </label>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>}
          
          <button 
            type="submit" 
            style={{ padding: '14px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'opacity 0.2s', marginTop: '10px' }}
          >
            Finish & Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}