import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage'; // ייבוא עמוד הדאשבורד המלא

export default function App() {
  return (
    <Router>
      <Routes>
        {/* עמוד התחברות / הרשמה */}
        <Route path="/" element={<LoginPage />} />
        
        {/* עמוד שאלון אונבורדינג */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        {/* עמוד דאשבורד ראשי */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* הפניה אוטומטית לכתובת הבסיס אם הנתיב לא קיים */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}