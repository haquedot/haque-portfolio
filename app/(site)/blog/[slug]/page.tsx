import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPostModel from "@/models/BlogPost";
import BlogPostClient from "./blog-post-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  await connectToDatabase();
  const post = await BlogPostModel.findOne({ slug, published: true }).lean();
  return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
      ...(post.image && { images: [{ url: post.image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.image && { images: [post.image] }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Serialize for client component (lean() returns plain objects but dates need converting)
  const serializedPost = {
    _id: (post._id as any).toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    authorBio: post.authorBio,
    authorImage: post.authorImage,
    date: new Date(post.date).toISOString(),
    image: post.image,
    tags: post.tags,
    readTime: post.readTime,
    views: post.views,
    series: post.series,
    featured: post.featured,
  };

  return <BlogPostClient post={serializedPost} />;
}
