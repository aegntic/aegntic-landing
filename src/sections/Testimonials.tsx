'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "aegntic.ai's solutions transformed how we process customer data. Their AI models not only improved our operational efficiency by 45% but also uncovered insights that led to three new product lines.",
    name: "Michael Johnson",
    title: "CTO",
    company: "TechNovate Inc.",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
  },
  {
    id: 2,
    quote: "The predictive analytics system built by aegntic.ai helped us reduce waste by 30% and optimize our supply chain in ways we never thought possible. Their team's expertise is truly exceptional.",
    name: "Lisa Wong",
    title: "VP of Operations",
    company: "Global Logistics Partners",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  },
  {
    id: 3,
    quote: "Working with aegntic.ai has been a game-changer for our healthcare practice. Their diagnostic AI assistant has improved our accuracy rates and allows our doctors to focus more on patient care.",
    name: "Dr. James Rivera",
    title: "Medical Director",
    company: "Advanced Medical Center",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d",
  },
];

const TestimonialCard = ({ testimonial, active }: { testimonial: Testimonial; active: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: active ? 0 : 100 }}
      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 100 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className={`absolute top-0 left-0 w-full ${active ? 'z-10' : 'z-0'}`}
    >
      <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-lg border border-zinc-800">
        <div className="mb-6">
          <svg
            className="text-cyan-400 w-12 h-12 mb-4 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>

          <p className="text-white/80 text-lg mb-6">"{testimonial.quote}"</p>

          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white font-semibold">{testimonial.name}</h4>
              <p className="text-white/60 text-sm">
                {testimonial.title}, {testimonial.company}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-black relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
            What Our Clients Say
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white/80">
            Discover how our AI solutions have transformed businesses across industries.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative h-80">
          <div className="relative h-full">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                active={index === activeIndex}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-cyan-400 w-6' : 'bg-zinc-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
