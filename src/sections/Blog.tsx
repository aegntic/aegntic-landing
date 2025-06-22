'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogPostSummaries } from '@/lib/blog-data';
import Link from 'next/link';

interface BlogCardProps {
  post: typeof blogPostSummaries[0];
  index: number;
}

const BlogCard = ({ post, index }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -10 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden border-none bg-zinc-900/50 backdrop-blur-sm h-full">
          <div
            className="h-48 bg-center bg-cover"
            style={{ backgroundImage: `url(${post.image})` }}
          />
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <span className="text-xs text-primary mr-4">{post.category}</span>
              <span className="text-xs text-foreground/60">{post.date}</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-foreground/70 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">By {post.author}</span>
              <Button variant="link" className="text-primary p-0 hover:text-primary/80">
                Read More
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-zinc-950 section-light relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
            Latest Articles
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-foreground/80">
            Insights and expertise from our team of AI professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPostSummaries.slice(0, 3).map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button
              className="bg-secondary hover:bg-secondary/80 text-foreground border border-border"
            >
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;
