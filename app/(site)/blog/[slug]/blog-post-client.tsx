"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  date: string;
  image?: string;
  tags: string[];
  readTime: number;
  views?: number;
  series?: string;
  featured?: boolean;
}

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Hero image */}
        {post.image && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {post.series && (
            <p className="text-sm text-primary font-medium mb-2 uppercase tracking-wide">
              {post.series}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <hr className="mb-8 border-border" />

        {/* Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:text-primary">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match;
                return !isInline ? (
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg !mt-0 !mb-6"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre({ children }) {
                // Let the code component handle the styling
                return <>{children}</>;
              },
              img({ src, alt }) {
                if (!src || typeof src !== "string") return null;
                return (
                  <span className="block my-6">
                    <Image
                      src={src}
                      alt={alt || ""}
                      width={800}
                      height={400}
                      className="rounded-lg w-full object-cover"
                    />
                  </span>
                );
              },
              a({ href, children }) {
                const isExternal =
                  href?.startsWith("http://") || href?.startsWith("https://");
                if (isExternal) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      {children}
                    </a>
                  );
                }
                return (
                  <Link href={href || "#"} className="text-primary underline underline-offset-4">
                    {children}
                  </Link>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        <hr className="my-8 border-border" />

        {/* Author bio */}
        {post.authorBio && (
          <div className="flex items-start gap-4 p-6 rounded-xl bg-muted/50 mb-8">
            {post.authorImage && (
              <Image
                src={post.authorImage}
                alt={post.author}
                width={56}
                height={56}
                className="rounded-full object-cover shrink-0"
              />
            )}
            <div>
              <p className="font-semibold mb-1">{post.author}</p>
              <p className="text-sm text-muted-foreground">{post.authorBio}</p>
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </main>
  );
}
