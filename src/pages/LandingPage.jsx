import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col justify-end p-6 h-full"
      style={{ background: '#F7F8F9' }}
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
