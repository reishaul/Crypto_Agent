import React, { useEffect, useState } from 'react';
import { getAiAdvice } from '../services/aiApi';

interface AIInsightProps {
  investorType: string;
  cryptoAssets: string[];
}

export default function AIInsight({ investorType, cryptoAssets }: AIInsightProps) {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdvice = async () => {
      if (!investorType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAiAdvice(investorType, cryptoAssets || []);
        setAdvice(data.advice);
      } catch (err: any) {
        setError(err.error || 'Failed to fetch AI insights');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [investorType, cryptoAssets]);

  return (
    <div style={{ 
      padding: '24px', 
      background: '#102a43', 
      color: '#ffffff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 20px rgba(16, 42, 67, 0.15)',
      marginTop: '20px'
    }}>
      <h3 style={{ color: '#ff6b6b', marginTop: '0', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🤖 Personal AI Analysis & Advice
      </h3>
      
      {loading && <p style={{ color: '#cbd5e1' }}>Generating personalized recommendations...</p>}
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      {!loading && !error && (
        <p style={{ lineHeight: '1.6', margin: 0, color: '#f1f5f9' }}>
          {advice || 'No profile data available to generate insights yet.'}
        </p>
      )}
    </div>
  );
}