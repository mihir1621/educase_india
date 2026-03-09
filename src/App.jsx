import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';

// Logic: Code-splitting to solve "Large Chunks" build warning
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Shimmer loading fallback for code splitting
const PageFallback = () => (
  <div className="w-full h-full bg-[var(--bg-main)] flex items-center justify-center">
    <div className="w-32 h-32 skeleton rounded-full" />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <React.Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </React.Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen w-full bg-gray-200 dark:bg-black flex items-center justify-center p-4 transition-colors duration-300">
          
          <div 
            style={{
              width: '375px',
              height: '812px',
              position: 'relative',
              top: '0px',
              left: '0px',
            }}
            className="shadow-2xl overflow-hidden flex flex-col rounded-[20px] bg-[var(--bg-main)] transition-colors duration-300 border border-gray-300 dark:border-gray-800"
          >
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <AnimatedRoutes />
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
