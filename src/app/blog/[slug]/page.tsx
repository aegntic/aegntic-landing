'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPostBySlug } from '@/lib/blog-data';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { BlogPostSummary } from '@/lib/blog-types';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState<string>('');

  // Get the post data
  const post = getPostBySlug(params.slug);

  // Redirect to blog index if post not found
  useEffect(() => {
    if (!post) {
      router.push('/blog');
    }
  }, [post, router]);

  // Parse markdown content to HTML
  useEffect(() => {
    if (post) {
      const parseMarkdown = async () => {
        const result = await unified()
          .use(remarkParse) // Parse markdown
          .use(remarkGfm) // Support GFM (tables, strikethrough, etc.)
          .use(remarkRehype) // Convert to HTML AST
          .use(rehypeStringify) // Convert to HTML string
          .process(post.content);

        setHtmlContent(result.toString());
      };

      parseMarkdown();
    }
  }, [post]);

  if (!post) {
    return <div className="h-screen flex items-center justify-center text-foreground">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar introCompleted={true} />

      {/* Hero section with post image */}
      <section
        className="relative pt-32 pb-16 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${post.image})`,
          height: '60vh'
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-4">
              <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-white/80 text-sm mb-6 space-x-4">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-white/70 text-sm">{post.authorTitle}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="mt-12 border-t border-border pt-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-secondary/50 text-foreground/80 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related posts */}
          {post.relatedPosts.length > 0 && (
            <div className="mt-20 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {post.relatedPosts.map((relatedPost, index) => (
                  <RelatedPostCard key={relatedPost.id} post={relatedPost} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-16 text-center">
            <Link href="/blog">
              <Button variant="outline" className="border-primary text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

interface RelatedPostCardProps {
  post: BlogPostSummary;
  index: number;
}

function RelatedPostCard({ post, index }: RelatedPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden h-full border-border hover:border-primary transition-colors duration-300 group">
          <div
            className="h-40 bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.image})` }}
          />
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-primary">{post.category}</span>
              <span className="text-xs text-foreground/60">{post.date}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-foreground/70 text-sm line-clamp-2">{post.excerpt}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
