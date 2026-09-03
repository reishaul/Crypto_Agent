import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingPreferences } from '../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  // לצורך הדוגמה נניח שהאימייל נשמר ב-localStorage או מועבר, נציג שדה אימייל לבדיקה
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
      navigate('/dashboard'); // מעבר לדאשבורד לאחר הצלחה
    } catch (err: any) {
      setError(err.error || 'Failed to save onboarding preferences. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Onboarding Form - AI Crypto Advisor</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label>Your Email (for account verification):</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Which crypto assets are you interested in?</label><br />
          {['Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)'].map(crypto => (
            <label key={crypto} style={{ display: 'block', marginTop: '5px' }}>
              <input 
                type="checkbox" 
                checked={cryptoAssets.includes(crypto)} 
                onChange={() => handleCryptoToggle(crypto)}
              /> {crypto}
            </label>
          ))}
        </div>

        <div>
          <label>What is your investment profile?</label><br />
          <select 
            value={investorType} 
            onChange={(e) => setInvestorType(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Choose a profile...</option>
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button 
          type="submit" 
          style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          Submit and Go to Dashboard
        </button>
      </form>
    </div>
  );
}