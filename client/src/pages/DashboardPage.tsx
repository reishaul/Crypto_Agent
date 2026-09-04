import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import Navbar from '../components/Navbar';
import AIInsight from '../components/AIInsight';
import CoinPrices from '../components/CoinPrices';
import MarketNews from '../components/MarketNews';
import CryptoMeme from '../components/CryptoMeme';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#ffffff', background: '#0b192c', minHeight: '100vh', fontSize: '18px' }}>Loading your crypto terminal...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '80px', color: '#ff6b6b', background: '#0b192c', minHeight: '100vh', fontSize: '18px' }}>{error}</div>;

return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0b192c 0%, #102a43 50%, #1e3e62 100%)', 
      padding: '30px 40px', // הגדלת הרווחים בצדדים במסך רחב
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {/* הרחבת רוחב המקסימום של הטרמינל כדי שיתפוס את רוב מסך המחשב */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <Navbar />
        
        {/* Hero Welcome Section */}
        <div style={{ 
          background: 'rgba(16, 42, 67, 0.8)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '30px', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          marginTop: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '28px' }}>
              Welcome back, {user?.name || 'Trader'}! 🚀
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Terminal ID: {user?.email}</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255, 107, 107, 0.15)', 
            border: '1px solid #ff6b6b', 
            padding: '10px 18px', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '12px', color: '#ff6b6b', fontWeight: 'bold', textTransform: 'uppercase' }}>Investor Profile</span>
            <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '600', textTransform: 'capitalize' }}>
              {user?.preferences?.investorType || 'Standard'}
            </span>
          </div>
        </div>

        {/* Main Grid Layout - פריסה רחבה המנצלת את כל רוחב המסך */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginTop: '25px' }}>
          
          {/* Left Column / Main Focus */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <CoinPrices cryptoAssets={user?.preferences?.cryptoAssets} />
            <AIInsight 
              investorType={user?.preferences?.investorType} 
              cryptoAssets={user?.preferences?.cryptoAssets} 
            />
            <MarketNews />
          </div>

          {/* Right Column / Side Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <CryptoMeme />
            
            {/* Quick Tracked Assets Card */}
            <div style={{ 
              padding: '24px', 
              background: 'rgba(16, 42, 67, 0.8)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
              color: '#ffffff'
            }}>
              <h3 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '15px', fontSize: '18px' }}>
                ⭐ Tracked Watchlist
              </h3>
              {user?.preferences?.cryptoAssets?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {user.preferences.cryptoAssets.map((crypto: string) => (
                    <div key={crypto} style={{ padding: '12px 14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '500' }}>{crypto}</span>
                      <span style={{ color: '#10b981', fontSize: '12px', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px' }}>Active</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No assets selected yet.</p>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}