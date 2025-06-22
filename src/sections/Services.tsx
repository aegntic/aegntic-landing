'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ServiceCard = ({ title, description, icon, delay }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="border-none bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-900/70 transition-all duration-300 group h-full">
        <CardHeader>
          <div className="text-cyan-400 mb-3 text-3xl group-hover:text-cyan-300 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-2xl text-white group-hover:text-cyan-100 transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white/70 text-base group-hover:text-white/90 transition-colors">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-zinc-950 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
            Our Services
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white/80">
            We deliver cutting-edge AI solutions tailored to your business needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            title="AI Consulting"
            description="Our expert team analyzes your business needs and builds a strategic roadmap for AI implementation, ensuring maximal ROI and competitive advantage."
            delay={0.1}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                <path d="M9 20h6" />
                <path d="M10 12v8" />
                <path d="M14 12v8" />
                <path d="M2 9h20" />
              </svg>
            }
          />
          <ServiceCard
            title="Machine Learning Development"
            description="From custom models to advanced neural networks, we build sophisticated ML solutions that learn from your data and deliver precise insights and predictions."
            delay={0.3}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                <path d="M11 18H8a2 2 0 0 1-2-2V9" />
              </svg>
            }
          />
          <ServiceCard
            title="Data Analysis"
            description="Transform raw data into actionable intelligence with our comprehensive analytics services, discovering patterns and opportunities hidden in your information."
            delay={0.5}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 9l-6-6" />
                <path d="M18 3v6h-6" />
                <circle cx="9" cy="9" r="2" />
                <path d="M6 20.5V13l6-3l6 3v7.5" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
