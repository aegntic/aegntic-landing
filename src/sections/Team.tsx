'use client';

import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Alex Morgan',
    role: 'Chief AI Officer',
    bio: 'PhD in Machine Learning from MIT with 15+ years of industry experience. Previously led AI research at Google and founded two successful AI startups.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Head of Data Science',
    bio: 'Former lead data scientist at Amazon with expertise in predictive modeling and big data analytics. Published author of "Practical Machine Learning at Scale".',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
  },
  {
    id: 3,
    name: 'Raj Patel',
    role: 'AI Product Lead',
    bio: 'Experienced product manager with a background in computer vision and neural networks. Led development of AI products used by millions of users worldwide.',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
  },
];

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

const TeamCard = ({ member, index }: TeamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative group"
    >
      <div className="overflow-hidden rounded-lg">
        <div
          className="aspect-w-3 aspect-h-4 w-full h-80 bg-cover bg-center filter group-hover:grayscale-0 grayscale transition-all duration-500"
          style={{ backgroundImage: `url(${member.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90" />

        <div className="absolute bottom-0 w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
          <p className="text-cyan-400 mb-2">{member.role}</p>

          <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-300">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              viewport={{ once: true }}
              className="text-white/80 text-sm pt-3"
            >
              {member.bio}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Team = () => {
  return (
    <section id="team" className="py-20 bg-zinc-950 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
            Our Team
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white/80">
            Meet the experts behind our cutting-edge AI innovations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
