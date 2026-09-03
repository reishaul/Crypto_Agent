import React, { useEffect, useState } from 'react';
import { getUserProfile, getAiAdvice } from '../services/api';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // לצורך הדוגמה נשלוף לפי אימייל ששמור ב-localStorage או ברירת מחדל
  // בהמשך נחבר זאת למערכת אימות מלאה (JWT/Session)
  const userEmail = localStorage.getItem('userEmail') || 'test@example.com';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile(userEmail);
        setUser(data);
      } catch (err: any) {
        setError(err.error || 'Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  const [aiAdvice, setAiAdvice] = useState('');

    // בתוך ה-useEffect או פונקציה נפרדת לאחר טעינת נתוני המשתמש:
    useEffect(() => {
    if (user?.preferences) {
        getAiAdvice(user.preferences.investorType, user.preferences.cryptoAssets)
        .then(res => setAiAdvice(res.advice))
        .catch(err => console.error(err));
    }
    }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error} ( Try to re-login)</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1> Welcome, {user?.name || 'Dear User'}! 🚀</h1>
      <p style={{ color: '#666' }}>Email: {user?.email}</p>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3> Your Onboarding Preferences (from the Onboarding Form):</h3>
        
        <p><strong> Investor Type:</strong> {user?.preferences?.investorType || 'undefined yet'}</p>
        
        <div>
          <strong> Crypto Assets:</strong>
          <ul>
            {user?.preferences?.cryptoAssets?.length > 0 ? (
              user.preferences.cryptoAssets.map((crypto: string) => (
                <li key={crypto}>{crypto}</li>
              ))
            ) : (
              <li>There are no crypto assets selected yet</li>
            )}
          </ul>
        </div>

        <div style={{ marginTop: '20px', padding: '20px', background: '#eef2f7', borderRadius: '8px' }}>
            <h3>🤖 AI Analysis and Personalized Recommendations:</h3>
            <p>{aiAdvice || 'Loading AI-powered recommendations...'}</p>
        </div>
      </div>
    </div>
  );
}