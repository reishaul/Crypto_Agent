import React, { useEffect, useState } from 'react';
import axios from 'axios';

// This component fetches and displays the latest market news related to cryptocurrencies. It makes a request to the backend API to retrieve news
//  items and displays them in a styled container. The component handles loading states and error messages gracefully.

// Define the structure of a news item
interface NewsItem{
  title: string;
  source: {title: string };
  published_at: string;
  url: string;}

// The MarketNews component fetches and displays the latest market news related to cryptocurrencies.
export default function MarketNews(){
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  // Fetch the latest market news when the component mounts
  useEffect(() => {
    const fetchNews = async () => {
      try{
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/news');
        if (response.data && response.data.results) {
          setNews(response.data.results);
        }
      } 
      catch (err){
        setError('Failed to load market news.');
      } 
      finally{
        setLoading(false);}
    };

    fetchNews();
  }, []);

  return(
    <div style={{ 
      padding: '24px', 
      background: 'rgba(16, 42, 67, 0.8)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '16px', 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      color: '#ffffff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '18px' }}>
          📰 Latest Market News
        </h3>
        <span style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
          ● Live Feed
        </span>
      </div>

      {loading && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading news...</p>}
      {error && <p style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</p>}
      
      {!loading && !error && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {news.map((item, index) => (
            <div key={index} style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ textDecoration: 'none', color: '#ffffff', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '6px' }}
              >
                {item.title}
              </a>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                <span>{item.source?.title || 'Crypto Market'}</span>
                <span>{new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}