import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CryptoRain from './components/CryptoRain'; // import the CryptoRain component for the falling crypto coins effect
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage'; // import DashboardPage 

// The App component sets up the routing for the application, including the login, onboarding, and dashboard pages. 
// It also includes a background effect of falling crypto coins using the CryptoRain component.

// The component uses React Router to manage navigation between different pages and ensures that users are redirected to the login page by 
// default if they try to access an undefined route.
export default function App(){
  return(
    <Router>

      <div style={{ position: 'relative',minHeight: '100vh', width: '100%',background: '#0b192c', overflowX: 'hidden' }}>
        <CryptoRain />

        {/* page content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* redirect to login if no route matches */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}