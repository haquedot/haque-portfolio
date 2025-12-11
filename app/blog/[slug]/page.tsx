import { blogPosts } from '@/constants/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { BlogPostClient } from './blog-post-client';
interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}
export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) {
    return {
      title: 'Post not found',
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) {
    notFound();
  }
  return (
    <BlogPostClient post={post} />
  );
}