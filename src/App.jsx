import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      {/* Container to center the project layout screen */}
      <div className="min-h-screen w-full bg-[#E5E5E5] flex items-center justify-center p-4">
        
        {/* The Project Screen: Strictly 375px x 812px */}
        <div 
          style={{
            width: '375px',
            height: '812px',
            background: '#F7F8F9 0% 0% no-repeat padding-box',
            opacity: '1',
            position: 'relative',
            top: '0px',
            left: '0px',
          }}
          className="shadow-2xl overflow-hidden flex flex-col rounded-[15px]"
        >
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <AnimatedRoutes />
          </div>

          {/* Scrollbar reset within the 375x812 container */}
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          ` }} />
        </div>
      </div>
    </Router>
  );
}

export default App;
