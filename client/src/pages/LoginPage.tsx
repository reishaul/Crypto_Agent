import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await loginUser(email, password);
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      } else {
        await registerUser(name, email, password);
        localStorage.setItem('userEmail', email);
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0b192c 0%, #102a43 50%, #1e3e62 100%)',
      padding: '20px',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', margin: '0 0 8px 0', color: '#ffffff', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Welcome to AI Crypto Advisor
        </h1>
        <p style={{ fontSize: '15px', color: '#ff6b6b', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600' }}>
          Your private advisor
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        background: 'rgba(16, 42, 67, 0.75)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ color: '#ffffff', marginBottom: '24px', textAlign: 'center', fontSize: '22px', fontWeight: '500' }}>
          {isLoginMode ? 'Sign In to Your Account' : 'Create Your Account'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLoginMode && (
            <div>
              <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px' }}>Full Name:</label><br />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required={!isLoginMode}
                style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          )}
          <div>
            <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px' }}>Email:</label><br />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px' }}>Password:</label><br />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
          
          {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '14px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'opacity 0.2s', marginTop: '10px' }}
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Register & Continue')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button 
              type="button" 
              onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
            >
              {isLoginMode ? "Don't have an account? Register here" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}