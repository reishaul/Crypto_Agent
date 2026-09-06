import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';
import Navbar from '../components/Navbar';
import AIInsight from '../components/AIInsight';
import CoinPrices from '../components/CoinPrices';
import MarketNews from '../components/MarketNews';
import CryptoMeme from '../components/CryptoMeme';
import CryptoRain from '../components/CryptoRain';
import { saveFeedback } from '../services/api';

//this is the main dashboard page that will be displayed after the user logs in. It will display the user's profile information,
//  the AI insight of the day, the coin prices, and the market news. It will also allow the user to give feedback on each section.


// The DashboardPage component fetches and displays user profile information, AI insights, live coin prices, market news, and crypto memes. It 
// also allows users to provide feedback on each section.
export default function DashboardPage(){
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [voteStates, setVoteStates] = useState<Record<string, 'like' | 'dislike'>>({});
  
  const userEmail = localStorage.getItem('userEmail') || 'test@example.com';

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const data= await getUserProfile(userEmail);
        setUser(data);
      }
      catch (err: any){
        setError(err.error || 'Error loading data');
      }
      finally{
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  // Display loading or error messages if applicable
  if(loading) return <div style={{ textAlign: 'center',padding: '80px',color: '#ffffff', background: '#0b192c', minHeight: '100vh', fontSize: '18px' }}>Loading your crypto terminal...</div>;
  if(error) return <div style={{ textAlign: 'center',padding: '80px',color: '#ff6b6b', background: '#0b192c', minHeight: '100vh', fontSize: '18px' }}>{error}</div>;

  const handleVote = async (contentId: string, voteType: 'like' | 'dislike') => {
    try{
      await saveFeedback({ userId: user?.email || userEmail, contentId, contentType: contentId, vote: voteType });
      setVoteStates(prev => ({ ...prev, [contentId]: voteType }));
      setFeedbackMessage('Your feedback was saved.');
      setTimeout(() => setFeedbackMessage(''), 2000);
    } 
    catch (err){
      console.error('Failed to save vote', err);
      setFeedbackMessage('Failed to save feedback.');
      setTimeout(() => setFeedbackMessage(''), 2000);
    }
    };

  const getVoteButtonStyle = (contentId: string, voteType: 'like' | 'dislike') => {
    const isActive= voteStates[contentId] === voteType;

    return{
      background: isActive
        ? voteType === 'like'
          ? 'rgba(16, 185, 129, 0.28)'
          : 'rgba(239, 68, 68, 0.28)'
        : 'rgba(255,255,255,0.05)',
      border: isActive
        ? voteType === 'like'
          ? '1px solid #10b981'
          : '1px solid #ef4444'
        : '1px solid #334e68',
      color: isActive ? '#ffffff' : '#cbd5e1',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer',
      boxShadow: isActive ? '0 0 0 1px rgba(255,255,255,0.08) inset' : 'none'
    } as const;
  };

return(
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0b192c 0%, #102a43 50%, #1e3e62 100%)', 
      padding: '30px 40px', // reduced padding for a more compact layout
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      width: '100%',
      position: 'relative', // allows the falling coins to be positioned relative to the dashboard
      overflow: 'hidden' // prevents horizontal scrolling in case of falling coins
    }}>

    {/* Render the CryptoRain component for a dynamic background effect */}
    <CryptoRain />
    
    <div style={{ maxWidth: '1440px',margin: '0 auto', width: '100%',position: 'relative', zIndex: 1 }}>
        <Navbar />
        
        {/* Welcome Section */}
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

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginTop: '25px' }}>
          
          {/* Left Column/ Main Focus */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <section>
              <CoinPrices cryptoAssets={user?.preferences?.cryptoAssets} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Was this helpful?</span>
                <button onClick={() => handleVote('coin_prices', 'like')} style={getVoteButtonStyle('coin_prices', 'like')}>👍</button>
                <button onClick={() => handleVote('coin_prices', 'dislike')} style={getVoteButtonStyle('coin_prices', 'dislike')}>👎</button>
              </div>
            </section>

            <section>
              <AIInsight 
                investorType={user?.preferences?.investorType} 
                cryptoAssets={user?.preferences?.cryptoAssets} 
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Was this helpful?</span>
                <button onClick={() => handleVote('ai_insight_of_the_day', 'like')} style={getVoteButtonStyle('ai_insight_of_the_day', 'like')}>👍</button>
                <button onClick={() => handleVote('ai_insight_of_the_day', 'dislike')} style={getVoteButtonStyle('ai_insight_of_the_day', 'dislike')}>👎</button>
              </div>
            </section>

            <section>
              <MarketNews />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Was this helpful?</span>
                <button onClick={() => handleVote('market_news', 'like')} style={getVoteButtonStyle('market_news', 'like')}>👍</button>
                <button onClick={() => handleVote('market_news', 'dislike')} style={getVoteButtonStyle('market_news', 'dislike')}>👎</button>
              </div>
            </section>
          </div>

          {/* Right Column / Side Widgets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <section>
              <CryptoMeme />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Was this helpful?</span>
                <button onClick={() => handleVote('crypto_meme', 'like')} style={getVoteButtonStyle('crypto_meme', 'like')}>👍</button>
                <button onClick={() => handleVote('crypto_meme', 'dislike')} style={getVoteButtonStyle('crypto_meme', 'dislike')}>👎</button>
              </div>
            </section>
            
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

            {feedbackMessage && (
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{feedbackMessage}</p>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}