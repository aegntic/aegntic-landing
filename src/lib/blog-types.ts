export interface BlogPostSummary {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
  slug: string;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  readingTime: string;
  authorTitle: string;
  authorImage: string;
  tags: string[];
  relatedPosts: BlogPostSummary[];
}

export interface BlogSectionProps {
  posts: BlogPostSummary[];
}
