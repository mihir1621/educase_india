import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingSkeleton = () => (
  <div className="flex flex-col justify-end p-6 h-full bg-[#F7F8F9]">
    <div className="mb-8 flex flex-col gap-2">
      <div className="h-8 w-48 skeleton rounded"></div>
      <div className="h-4 w-56 skeleton rounded"></div>
      <div className="h-4 w-40 skeleton rounded"></div>
    </div>
    <div className="flex flex-col gap-3">
      <div className="h-12 w-full skeleton rounded-[6px]"></div>
      <div className="h-12 w-full skeleton rounded-[6px]"></div>
    </div>
  </div>
);

function LandingPage() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Artificial delay to show skeleton
    const timer = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return <LandingSkeleton />;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-end p-6 h-full bg-[#F7F8F9]"
    >
      <div className="mb-8">
        <h1 className="text-[28px] font-medium text-[#1D2226] leading-tight mb-2">
          Welcome to PopX
        </h1>
        <p className="text-[18px] text-[#1D2226] opacity-60 leading-snug">
          Lorem ipsum dolor sit amet,<br />consectetur adipiscing elit,
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link 
          to="/signup"
          className="w-full bg-[#6C25FF] text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium hover:opacity-90 transition-opacity"
        >
          Create Account
        </Link>
        <Link 
          to="/login"
          className="w-full bg-[#CEBAFB] text-[#1D2226] py-3.5 rounded-[6px] text-center text-[16px] font-medium hover:opacity-90 transition-opacity"
        >
          Already Registered? Login
        </Link>
      </div>
    </motion.div>
  );
}

export default LandingPage;
