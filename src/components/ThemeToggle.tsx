'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`w-12 h-6 rounded-full p-1 flex justify-${
        isDark ? 'end' : 'start'
      } bg-primary/20 transition-colors relative`}
      initial={false}
      animate={{ backgroundColor: isDark ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 128, 166, 0.2)' }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="w-4 h-4 rounded-full bg-primary absolute"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
      />

      {/* Sun icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute left-1 top-1 text-primary transition-opacity duration-200 ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
        animate={{ opacity: isDark ? 0 : 1 }}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </motion.svg>

      {/* Moon icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`absolute right-1 top-1 text-primary transition-opacity duration-200 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
        animate={{ opacity: isDark ? 1 : 0 }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </motion.svg>
    </motion.button>
  );
}
