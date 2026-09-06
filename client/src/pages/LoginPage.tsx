import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';
import CryptoRain from '../components/CryptoRain';

// The LoginPage component handles both user login and registration. It provides a form for users to enter their credentials, 
// and it manages the state for form inputs, error messages, and loading status. Depending on the mode (login or register), 
// it will call the appropriate API function and navigate the user to the dashboard or onboarding page upon success.

// The component also includes a "Remember me" feature that saves the user's email in localStorage or sessionStorage based on their preference.
export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if the user is already logged in and redirect to dashboard if so
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if(savedEmail){
      navigate('/dashboard');
    }
  }, [navigate]);

  // Password validation checks
  const hasMinLength = password.length >= 7;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate registration
    if(!isLoginMode) {
      if(!hasMinLength|| !hasLetter || !hasNumber|| !hasSpecial) {
        setError('Please meet all password requirements.');
        return;
      }
      if(password !== confirmPassword){
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try{
      if (isLoginMode){
        await loginUser(email, password);
      } 
      else{
        await registerUser(name, email, password);
      }

      // Save the user's email based on the "Remember me" preference
      if(rememberMe) {
        localStorage.setItem('userEmail', email);
      } 
      else{
        sessionStorage.setItem('userEmail', email);
      }

      // Navigate to the appropriate page based on the mode
      if(isLoginMode){
        navigate('/dashboard');
      } 
      else{
        navigate('/onboarding');
      }
    } 
    catch (err: any){
      setError(err.error || 'Operation failed');
    } 
    finally{
      setLoading(false);
    }
  };

  return(
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
      width: '100%',
      position: 'relative', // allows the falling coins to be positioned relative to the login page
      overflow: 'hidden' // prevents horizontal scrolling in case of falling coins
    }}>


    <CryptoRain />
    <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px'}}>
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
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {/* Show password requirements only during registration */}
          {!isLoginMode && (
            <div style={{ fontSize: '12px', background: 'rgba(11, 25, 44, 0.5)', padding: '10px', borderRadius: '6px', border: '1px solid #334e68' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 6px 0', fontWeight: '600' }}>Password requirements:</p>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li style={{ color: hasMinLength ? '#4ade80' : '#cbd5e1' }}>At least 7 characters</li>
                <li style={{ color: hasLetter ? '#4ade80' : '#cbd5e1' }}>English letters</li>
                <li style={{ color: hasNumber ? '#4ade80' : '#cbd5e1' }}>At least one number</li>
                <li style={{ color: hasSpecial ? '#4ade80' : '#cbd5e1' }}>At least one special character (!, @, #, $, etc.)</li>
              </ul>
            </div>
          )}

          {!isLoginMode && (
            <div>
              <label style={{ color: '#cbd5e1', fontWeight: '500', fontSize: '14px' }}>Retype Password:</label><br />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required={!isLoginMode}
                autoComplete="new-password"
                style={{ width: '100%', padding: '12px', marginTop: '6px', borderRadius: '8px', border: '1px solid #334e68', background: '#0b192c', color: '#fff', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#ff6b6b', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="rememberMe" style={{ color: '#cbd5e1', fontSize: '14px', cursor: 'pointer' }}>
              Remember me
            </label>
          </div>
          
          {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '14px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', transition: 'opacity 0.2s', marginTop: '6px' }}
          >
            {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Register & Continue')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
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
    </div>
  );
}