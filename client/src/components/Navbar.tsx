import React from 'react';
import { useNavigate } from 'react-router-dom';

// The Navbar component provides a navigation bar with a title and a logout button. It allows users to log out of the application, clearing
// their session and redirecting them to the login page.

// The Navbar component provides a navigation bar with a title and a logout button.
export default function Navbar(){
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('userEmail');
    navigate('/login');};

    // The handleLogout function clears the user's session by removing their email from localStorage and sessionStorage, then navigates to the login page.
  return(
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#102a43', color: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
      <h3 style={{ margin: 0, color: '#ff6b6b' }}>AI Crypto Advisor</h3>
      <button 
        onClick={handleLogout}
        style={{ padding: '8px 16px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
      >
        Logout
      </button>
    </nav>
  );
}