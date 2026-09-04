import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingPreferences } from '../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [cryptoAssets, setCryptoAssets] = useState<string[]>([]);
  const [investorType, setInvestorType] = useState('');
  const [contentTypes, setContentType] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleCryptoToggle = (crypto: string) => {
    setCryptoAssets(prev => 
      prev.includes(crypto) ? prev.filter(c => c !== crypto) : [...prev, crypto]
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
    <div style={{ maxWidth: '500px', margin: '60px auto', padding: '30px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(16, 42, 67, 0.08)' }}>
      <h2 style={{ color: '#102a43', marginBottom: '20px' }}>Personalization Questionnaire</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ color: '#334e68', fontWeight: '500' }}>Your Email (for account verification):</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ color: '#334e68', fontWeight: '500' }}>Which assets are you interested in?</label><br />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {['Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)'].map(crypto => (
              <label key={crypto} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334e68', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={cryptoAssets.includes(crypto)} 
                  onChange={() => handleCryptoToggle(crypto)}
                  style={{ accentColor: '#ff6b6b', width: '18px', height: '18px' }}
                /> {crypto}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ color: '#334e68', fontWeight: '500' }}>What is your investor profile?</label><br />
          <select 
            value={investorType} 
            onChange={(e) => setInvestorType(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#ffffff' }}
          >
            <option value="">Select profile...</option>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive / High Risk</option>
          </select>
        </div>

        {error && <p style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</p>}
        
        <button 
          type="submit" 
          style={{ padding: '12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '500', transition: 'opacity 0.2s' }}
        >
          Finish & Enter Dashboard
        </button>
      </form>
    </div>
  );
}