'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogPosts } from '@/constants/blog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { hoverScale, tapScale } from '@/lib/animations';

const blogCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
}

export default function Blog() {
  // Show only first 2 posts on homepage
  const featuredPosts = blogPosts.slice(0, 2);

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Latest Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Insights on web development, React, Node.js, and modern JavaScript practices
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredPosts.map((post, idx) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Image */}
                    {post.image && (
                  <div className="h-40 bg-muted overflow-hidden">
                      <motion.div 
                        className="w-full h-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
                      </motion.div>
                  </div>
                    ) }

                  {/* Content */}
                  <div className="p-5 flex flex-col h-full">
                    {/* Date and Read Time */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground group cursor-pointer hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center justify-end gap-1 text-primary font-medium text-sm group">
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View All Blog Posts Link */}
        <div className="flex justify-center">
          <Link href="/blog">
            <motion.div {...hoverScale} {...tapScale}>
              <Button size="lg" variant="outline">
                View All Articles
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
