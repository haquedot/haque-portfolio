'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Loader2, Eye } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { BlogSearch } from '@/components/blog-search';
import { type SearchResult } from '@/lib/blog-search';
import { motion } from 'framer-motion';

interface BlogPostData {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  tags: string[];
  readTime: number;
  views?: number;
  likes?: number;
  featured?: boolean;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogs?limit=100', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        if (!isMounted) return;

        const normalizedPosts: BlogPostData[] = (data.posts ?? []).map((post: any) => ({
          ...post,
          id: post._id || post.id || post.slug,
          date: post.date || new Date().toISOString(),
          views: typeof post.views === 'number' ? post.views : 0,
          likes: typeof post.likes === 'number' ? post.likes : 0,
        }));

        setBlogPosts(normalizedPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        if (isMounted) {
          setPostsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  // Filter posts based on selected tag
  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags.includes(selectedTag))
    : blogPosts;

  // Use useCallback to prevent infinite renders
  const handleSearchChange = useCallback((results: SearchResult[]) => {
    setSearchResults(results);
  }, []);

  // Determine which posts to display
  const postsToDisplay = searchResults.length > 0 ? searchResults : filteredPosts;
  const isSearching = searchResults.length > 0;

  if (postsLoading) {
    return (
      <section className="min-h-screen py-6 lg:py-10 bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section id="blog" className="min-h-screen py-6 lg:py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Blog & Articles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on web development, React, Node.js, and modern JavaScript practices
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-12">
          <BlogSearch posts={blogPosts} onSearchChange={handleSearchChange} />
        </div>

        {/* Tag Filter (only show when not searching) */}
        {!isSearching && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedTag(null)}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10"
              >
                {selectedTag === null && (
                  <motion.div
                    layoutId="activeTag"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 ${
                  selectedTag === null
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                }`}>
                  All Posts
                </span>
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-muted/50 z-10"
                >
                  {selectedTag === tag && (
                    <motion.div
                      layoutId="activeTag"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={`relative z-10 ${
                    selectedTag === tag
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}>
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {postsToDisplay.map((post) => (
            <Link key={post.id || post.slug} href={`/blog/${post.slug}`}>
              <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    {/* Image */}
                    {post.image && (
                      <div className="h-48 bg-muted overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )}

                    {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                      {/* Date and Read Time */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min read
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views ?? 0}
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Read More Link */}
                      <div className="mt-auto flex items-center justify-end gap-2 text-sm font-medium text-primary group">
                        Read Article
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Posts Message */}
        {postsToDisplay.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No posts found for the selected tag. Try a different filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
