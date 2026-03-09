import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggleButton from '../components/ThemeToggleButton';

const LandingSkeleton = () => (
  <div className="flex flex-col justify-end p-6 h-full bg-[var(--bg-main)]">
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
      className="flex flex-col p-6 h-full bg-[var(--bg-main)] transition-colors duration-300"
    >
      <div className="flex justify-end pt-4">
        <ThemeToggleButton />
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="mb-8">
          <h1 className="text-[28px] font-medium text-[var(--text-main)] leading-tight mb-2">
            Welcome to PopX
          </h1>
          <p className="text-[18px] text-[var(--text-main)] opacity-60 leading-snug">
            Lorem ipsum dolor sit amet,<br />consectetur adipiscing elit,
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            to="/signup"
            className="w-full bg-[var(--primary)] text-white py-3.5 rounded-[6px] text-center text-[16px] font-medium hover:opacity-90 transition-opacity"
          >
            Create Account
          </Link>
          <Link 
            to="/login"
            className="w-full bg-[var(--secondary)] text-[var(--text-main)] py-3.5 rounded-[6px] text-center text-[16px] font-medium hover:opacity-90 transition-all"
          >
            Already Registered? Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default LandingPage;
