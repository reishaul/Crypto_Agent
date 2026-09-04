import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CoinPricesProps {
  cryptoAssets: string[];
}

export default function CoinPrices({ cryptoAssets }: CoinPricesProps) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

// מיפוי שמות המטבעות לסימולים של Binance
  const binanceSymbolMap: Record<string, string> = {
    'Bitcoin (BTC)': 'BTCUSDT',
    'Ethereum (ETH)': 'ETHUSDT',
    'Solana (SOL)': 'SOLUSDT',
    'Cardano (ADA)': 'ADAUSDT',
    'Ripple (XRP)': 'XRPUSDT',
  };

  const fetchPrices = async () => {
    if (!cryptoAssets || cryptoAssets.length === 0) {
      setLoading(false);
      return;
    }

    try {

    // שליפת כל המחירים מבינאנס בבקשה אחת ויחידה
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price');
      const allTickers = response.data; // מערך של כל המטבעות בשוק
      const newPrices: Record<string, number> = {};

    // מעבר על המטבעות שהמשתמש בחר ומציאת המחיר שלהם מתוך המערך הגדול
      cryptoAssets.forEach((asset) => {
        const symbol = binanceSymbolMap[asset];
        if (symbol) {
          const found = allTickers.find((item: any) => item.symbol === symbol);
          if (found) {
            newPrices[asset] = parseFloat(found.price);
          }
        }
      });

      setPrices(newPrices);
    } catch (error) {
      console.error('Failed to fetch live prices from Binance', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices(); // טעינה ראשונית מידית

    // הגדרת טיימר שרץ כל 10 שניות (10000 מילישניות)
    const interval = setInterval(() => {
      fetchPrices();
    }, 10000);

    // ניקוי הטיימר כשהקומפוננטה יורדת מהמסך
    return () => clearInterval(interval);
  }, [cryptoAssets]);

  return (
    <div style={{ 
      padding: '24px', 
      background: '#ffffff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 20px rgba(16, 42, 67, 0.08)',
      marginTop: '20px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#102a43', margin: 0 }}>
          📈 Live Coin Prices (Real-Time)
        </h3>
        <span style={{ fontSize: '12px', color: '#10b981', background: '#d1fae5', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
          ● Live Updates (10s)
        </span>
      </div>
      
      {loading && prices[cryptoAssets?.[0]] === undefined ? (
        <p style={{ color: '#627d98' }}>Loading live market data...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          {cryptoAssets && cryptoAssets.length > 0 ? (
            cryptoAssets.map((asset) => (
              <div key={asset} style={{ padding: '15px', background: '#f4f7f6', borderRadius: '8px', borderLeft: '4px solid #ff6b6b', transition: 'all 0.3s' }}>
                <span style={{ fontSize: '14px', color: '#627d98', display: 'block', marginBottom: '5px' }}>{asset}</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#102a43' }}>
                  {prices[asset] ? `$${prices[asset].toLocaleString()}` : '---'}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: '#627d98' }}>No assets selected for live tracking.</p>
          )}
        </div>
      )}
    </div>
  );
}