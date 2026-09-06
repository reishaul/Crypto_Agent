import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AIInsightProps {
  investorType?: string;
  cryptoAssets?: string[];
}

export default function AIInsight({ investorType, cryptoAssets }: AIInsightProps) {
  const [insight, setInsight] = useState('Analyzing market conditions...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/api/ai-insight', {
          investorType,
          cryptoAssets
        });
        if (response.data && response.data.insight) {
          setInsight(response.data.insight);
        }
      } catch (err) {
        setInsight('Maintain strict risk management protocols based on your portfolio.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [investorType, cryptoAssets]);

  return (
    <div style={{ 
      padding: '24px', 
      background: 'rgba(16, 42, 67, 0.8)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '16px', 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
      color: '#ffffff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '18px' }}>
          🤖 Personal AI Analysis & Advice
        </h3>
        <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
          Live LLM Model
        </span>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Generating live AI insight...</p>
      ) : (
        <p style={{ color: '#f1f5f9', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          {insight}
        </p>
      )}
    </div>
  );
}