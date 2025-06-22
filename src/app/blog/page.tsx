'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogPostSummaries } from '@/lib/blog-data';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { BlogPostSummary } from '@/lib/blog-types';

export default function BlogPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all unique categories
  const categories = Array.from(new Set(blogPostSummaries.map(post => post.category)));

  // Filter posts based on category and search query
  const filteredPosts = blogPostSummaries.filter(post => {
    const matchesCategory = filter === null || post.category === filter;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar introCompleted={true} />

      <section className="pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
              AI Insights Blog
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-foreground/80">
              Explore the latest trends, technologies, and insights in artificial intelligence.
            </p>
          </motion.div>

          {/* Filter and search */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === null ? "default" : "outline"}
                onClick={() => setFilter(null)}
                className={filter === null ? "bg-primary text-primary-foreground" : ""}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  onClick={() => setFilter(category)}
                  className={filter === category ? "bg-primary text-primary-foreground" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pr-10 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Blog posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <h3 className="text-xl text-foreground mb-2">No articles found</h3>
                <p className="text-foreground/70">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

interface BlogCardProps {
  post: BlogPostSummary;
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full border-border hover:border-primary transition-colors duration-300 group">
          <div
            className="h-52 bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${post.image})` }}
          />
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-foreground/60">{post.date}</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-foreground/70 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60">By {post.author}</span>
              <span className="text-primary font-medium group-hover:underline">Read More</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
