'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  client: string;
  date: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Smart City AI Infrastructure',
    description: 'Developed an AI-powered infrastructure management system for a major metropolitan area. The solution uses computer vision and predictive analytics to optimize traffic flow, reduce energy consumption, and enhance public safety.',
    image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34',
    tags: ['Computer Vision', 'Predictive Analytics', 'Smart Infrastructure'],
    client: 'Metropolitan Authority',
    date: 'January 2023',
  },
  {
    id: 2,
    title: 'ML-Based Financial Forecasting',
    description: 'Created a sophisticated machine learning model for a leading financial institution that predicts market trends with 87% accuracy. This system analyzes thousands of data points in real-time to provide actionable investment insights.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
    tags: ['Financial AI', 'Predictive Modeling', 'Data Analytics'],
    client: 'Global Investment Firm',
    date: 'August 2022',
  },
  {
    id: 3,
    title: 'Healthcare Diagnostic AI',
    description: 'Built an AI diagnostic assistant that helps medical professionals identify early signs of critical conditions. The system integrates with existing medical imaging equipment and has improved early detection rates by 45%.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
    tags: ['Medical AI', 'Diagnostic Systems', 'Image Analysis'],
    client: 'National Healthcare Group',
    date: 'March 2023',
  },
];

const ProjectModal = ({
  project,
  isOpen,
  onClose
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>

              <div
                className="w-full h-64 md:h-80 bg-center bg-cover rounded-t-lg"
                style={{ backgroundImage: `url(${project.image})` }}
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <span key={index} className="bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-white/70">
                <div>
                  <strong className="block text-white">Client:</strong>
                  {project.client}
                </div>
                <div>
                  <strong className="block text-white">Date:</strong>
                  {project.date}
                </div>
              </div>

              <p className="text-white/80 mb-6">{project.description}</p>

              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-black"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="py-20 bg-black relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
            Our Projects
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white/80">
            Explore our portfolio of innovative AI solutions delivered for industry leaders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -10 }}
              className="cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <Card className="overflow-hidden border-none bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 h-full">
                <div
                  className="w-full h-48 bg-center bg-cover transition-transform duration-500 hover:scale-110"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-white/70 line-clamp-3">{project.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Portfolio;
