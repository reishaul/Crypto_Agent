import { useEffect, useState } from 'react';
import { getUserProfile} from '../services/api';
import { getAiAdvice } from '../services/aiApi';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  
  const userEmail = localStorage.getItem('userEmail') || 'test@example.com';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile(userEmail);
        setUser(data);
      } catch (err: any) {
        setError(err.error || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  useEffect(() => {
    if (user?.preferences) {
      getAiAdvice(user.preferences.investorType, user.preferences.cryptoAssets)
        .then((res: { advice: string }) => setAiAdvice(res.advice))
        .catch((err: unknown) => console.error(err));
    }
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#102a43' }}>Loading data...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: '#ff6b6b' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(16, 42, 67, 0.08)' }}>
      <div style={{ borderBottom: '2px solid #f0f4f8', paddingBottom: '20px', marginBottom: '25px' }}>
        <h1 style={{ color: '#102a43', margin: '0 0 8px 0' }}>Welcome back, {user?.name || 'Valued User'}! 🚀</h1>
        <p style={{ color: '#627d98', margin: 0 }}>Email: {user?.email}</p>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ padding: '20px', background: '#f4f7f6', borderRadius: '8px', borderLeft: '4px solid #ff6b6b' }}>
          <h3 style={{ color: '#102a43', marginTop: 0 }}>Your Personal Preferences</h3>
          <p><strong>Investor Profile:</strong> {user?.preferences?.investorType || 'Not defined yet'}</p>
          <div>
            <strong>Tracked Assets:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              {user?.preferences?.cryptoAssets?.length > 0 ? (
                user.preferences.cryptoAssets.map((crypto: string) => (
                  <li key={crypto} style={{ color: '#334e68', marginBottom: '4px' }}>{crypto}</li>
                ))
              ) : (
                <li>No assets selected yet</li>
              )}
            </ul>
          </div>
        </div>

        <div style={{ padding: '20px', background: '#102a43', color: '#ffffff', borderRadius: '8px' }}>
          <h3 style={{ color: '#ff6b6b', marginTop: 0 }}>🤖 Personal AI Analysis & Advice</h3>
          <p style={{ lineHeight: '1.6', margin: 0 }}>{aiAdvice || 'Loading AI recommendations...'}</p>
        </div>
      </div>
    </div>
  );
}