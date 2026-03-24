"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, User, Eye, Heart } from "lucide-react";

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
  likes?: number;
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

  const [views, setViews] = useState<number>(post.views ?? 0);
  const [likes, setLikes] = useState<number>(post.likes ?? 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionKey = `viewed-blog-${post.slug}`;
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
    sessionStorage.setItem(sessionKey, Date.now().toString());

    let cancelled = false;

    const recordView = async () => {
      try {
        const response = await fetch(`/api/blogs/${post.slug}/views`, {
          method: "POST",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to record view");
        }

        const data = await response.json();
        if (!cancelled && typeof data.views === "number") {
          setViews(data.views);
        }
      } catch (error) {
        sessionStorage.removeItem(sessionKey);
        console.error("Unable to record blog view:", error);
      }
    };

    recordView();

    return () => {
      cancelled = true;
    };
  }, [post.slug]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = localStorage.getItem("portfolio-liked-posts");
      const likedSlugs: string[] = raw ? JSON.parse(raw) : [];
      setHasLiked(Array.isArray(likedSlugs) && likedSlugs.includes(post.slug));
    } catch (error) {
      console.error("Unable to read liked posts from storage:", error);
    }
  }, [post.slug]);

  const syncLikedPosts = (liked: boolean) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storageKey = "portfolio-liked-posts";
      const raw = localStorage.getItem(storageKey);
      const likedSlugs: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(likedSlugs);

      if (liked) {
        set.add(post.slug);
      } else {
        set.delete(post.slug);
      }

      localStorage.setItem(storageKey, JSON.stringify(Array.from(set)));
    } catch (error) {
      console.error("Unable to update liked posts in storage:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (isLiking) {
      return;
    }

    setIsLiking(true);

    try {
      const response = await fetch(`/api/blogs/${post.slug}/likes`, {
        method: hasLiked ? "DELETE" : "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to update likes");
      }

      const data = await response.json();
      if (typeof data.likes === "number") {
        setLikes(data.likes);
        setHasLiked(!hasLiked);
        syncLikedPosts(!hasLiked);
      }
    } catch (error) {
      console.error("Unable to update likes:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const contentWithoutH1 = post.content.replace(/^\s*#\s.*(\r?\n)?/, "");

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
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
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {typeof views === "number" ? views : 0} views
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

          <div className="mt-6">
            <button
              type="button"
              onClick={handleLikeToggle}
              disabled={isLiking}
              aria-pressed={hasLiked}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                hasLiked
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-muted"
              } ${isLiking ? "opacity-70" : ""}`}
            >
              <Heart
                className="h-4 w-4"
                aria-hidden="true"
                fill={hasLiked ? "currentColor" : "none"}
              />
              {hasLiked ? "Liked" : "Like"}
              <span className="text-muted-foreground">• {likes}</span>
            </button>
          </div>
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
            {contentWithoutH1}
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
