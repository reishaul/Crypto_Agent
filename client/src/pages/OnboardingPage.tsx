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
      setError(err.error || 'שגיאה בשמירת ההעדפות');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>שאלון התאמה אישית - AI Crypto Advisor</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label>אימייל שלך (לאימות החשבון):</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>אילו מטבעות מעניינים אותך?</label><br />
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
          <label>מה פרופיל המשקיע שלך?</label><br />
          <select 
            value={investorType} 
            onChange={(e) => setInvestorType(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">בחר פרופיל...</option>
            <option value="conservative">שמרן (Conservative)</option>
            <option value="moderate">מתון (Moderate)</option>
            <option value="aggressive">אגרסיבי / סיכון גבוה (Aggressive)</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button 
          type="submit" 
          style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          סיים והכנס לדאשבורד
        </button>
      </form>
    </div>
  );
}