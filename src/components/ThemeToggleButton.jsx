import React from 'react';
import { Moon, Sun, Cloud, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '../context/ThemeContext';

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex h-8 w-16 cursor-pointer items-center rounded-full p-1.5 shadow-inner transition-colors duration-500 overflow-hidden
        ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#60a5fa]'} 
      `}
      aria-label="Toggle Theme"
    >
      {/* --- Scenery Background Elements --- */}

      {/* Stars (Dark Mode) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: isDarkMode ? 1 : 0, y: isDarkMode ? 0 : 10 }}
        transition={{ duration: 0.4 }}
      >
        <Star className="absolute top-2 left-8 h-1 w-1 text-white fill-white opacity-80" />
        <Star className="absolute bottom-2 left-10 h-0.5 w-0.5 text-white fill-white opacity-60" />
        <Star className="absolute top-3 left-12 h-1.5 w-1.5 text-white fill-white opacity-90" />
      </motion.div>

      {/* Clouds (Light Mode) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: isDarkMode ? 0 : 1, x: isDarkMode ? -10 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <Cloud className="absolute top-1.5 left-8 h-3 w-3 text-white fill-white opacity-80" />
        <Cloud className="absolute bottom-1.5 left-11 h-4 w-4 text-white fill-white opacity-90" />
        <Cloud className="absolute top-2 left-3 h-2 w-2 text-white fill-white opacity-60" />
      </motion.div>

      {/* --- Sliding Thumb --- */}
      <motion.div
        className="z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
        initial={false}
        animate={{
          x: isDarkMode ? 30 : 0,
          backgroundColor: isDarkMode ? "#f1f5f9" : "#fbbf24",
          boxShadow: isDarkMode
            ? "0 0 10px 2px rgba(255, 255, 255, 0.3)"
            : "0 0 10px 2px rgba(251, 191, 36, 0.5)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={14} className="text-slate-700 fill-slate-700" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={14} className="text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

export default ThemeToggleButton;
