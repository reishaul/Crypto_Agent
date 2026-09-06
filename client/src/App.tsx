import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CryptoRain from './components/CryptoRain'; // ייבוא רכיב המטבעות הנופלים
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage'; // ייבוא עמוד הדאשבורד המלא


export default function App() {
  return (
    <Router>

      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', background: '#0b192c', overflowX: 'hidden' }}>
        <CryptoRain />

        {/* תוכן העמודים הדינמיים */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* הפניה אוטומטית לעמוד ההתחברות בברירת מחדל */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}