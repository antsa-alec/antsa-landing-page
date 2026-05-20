import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Admin from './pages/Admin.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import TermsAndConditions from './pages/TermsAndConditions.tsx';
import HelpCentre from './pages/HelpCentre.tsx';
import FreeTrial from './pages/FreeTrial.tsx';
import HelpChatWidget from './components/HelpChatWidget.tsx';
import { usePageTracking } from './hooks/usePageTracking.ts';
import './styles/global.css';

function Analytics() {
  usePageTracking();
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Analytics />
      <HelpChatWidget />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/help" element={<HelpCentre />} />
        <Route path="/free-trial" element={<FreeTrial />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
