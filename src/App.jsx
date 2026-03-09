import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      {/* Outer container to center the mobile screen horizontally and vertically */}
      <div className="min-h-screen w-full bg-[#E5E5E5] flex items-center justify-center p-4 font-sans antialiased">
        
        {/* Mobile-Style Container matching precisely requested specs */}
        <div 
          style={{
            width: '375px',
            height: '812px',
            background: '#F7F8F9',
            position: 'relative',
          }}
          className="shadow-2xl overflow-hidden rounded-[20px] bg-[#F7F8F9] border border-gray-300"
        >
          {/* Main App Content with Routing */}
          <div className="h-full overflow-y-auto hide-scrollbar">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>

          {/* Simple scrollbar hiding style inside the component */}
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
