'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const Stat = ({ value, label, icon, delay }: StatProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      const increment = value / totalFrames;

      let currentFrame = 0;
      const counter = setInterval(() => {
        currentFrame++;
        const newCount = Math.min(Math.ceil(increment * currentFrame), value);
        setCount(newCount);

        if (currentFrame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-lg bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all duration-300"
    >
      <div className="text-cyan-400 mb-3 text-3xl">{icon}</div>
      <h3 className="text-4xl font-bold mb-2 text-white">{count}+</h3>
      <p className="text-white/70">{label}</p>
    </motion.div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-20 bg-black relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
            About Us
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white/80">
            aegntic.ai is a leader in AI solutions, delivering cutting-edge technology to transform businesses.
            Our innovative approach combines expertise and technology to solve complex challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Stat
            value={100}
            label="Clients"
            delay={0.1}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <Stat
            value={50}
            label="Projects"
            delay={0.3}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
          />
          <Stat
            value={10}
            label="Awards"
            delay={0.5}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5l9-5l-9-5l2 5z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default About;
