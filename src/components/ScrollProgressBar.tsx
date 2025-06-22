'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show progress bar after scrolling a bit
      if (window.scrollY > 300) {
        setShowProgressBar(true);
      } else {
        setShowProgressBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary/30 z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        opacity: showProgressBar ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
}
