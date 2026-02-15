'use client';

import { blogPosts } from '@/constants/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Copy, Check, Twitter, Linkedin, MessageCircle, Facebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    // Determine dark mode only after hydration
    const darkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(darkMode);
  }, [theme]);

  const codeTheme = isDark ? atomDark : oneLight;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Don't render theme-dependent content until after hydration
  if (!mounted) {
    return (
      <div className="mb-6 rounded-lg overflow-hidden border bg-[#fafafa] border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f5f5f5] border-gray-200">
          <span className="text-sm font-mono uppercase tracking-wider text-gray-600">
            {language}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
            title="Copy code"
          >
            <Copy className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        <div className="overflow-x-auto bg-[#fafafa] p-4">
          <pre className="text-sm text-gray-600 font-mono whitespace-pre-wrap break-words">
            {code}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 rounded-lg overflow-hidden border ${
      isDark 
        ? 'bg-[#282c34] border-gray-700' 
        : 'bg-[#fafafa] border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDark
          ? 'bg-[#1e2227] border-gray-700'
          : 'bg-[#f5f5f5] border-gray-200'
      }`}>
        <span className={`text-sm font-mono uppercase tracking-wider ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {language}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className={`h-8 w-8 p-0 ${
            isDark
              ? 'hover:bg-[#3e4249]'
              : 'hover:bg-gray-200'
          }`}
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className={`h-4 w-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`} />
          )}
        </Button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={codeTheme}
          PreTag="div"
          wrapLongLines={true}
          customStyle={{
            backgroundColor: 'transparent',
            padding: '16px',
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0,
          }}
          useInlineStyles={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function BlogPostClient({ post }: { post: typeof blogPosts[0] }) {
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState<Array<{ level: number; text: string; id: string }>>([]);

  // Extract headings from content for table of contents
  useEffect(() => {
    const lines = post.content.split('\n');
    const extractedHeadings: Array<{ level: number; text: string; id: string }> = [];
    
    lines.forEach((line) => {
      if (line.startsWith('# ') || line.startsWith('## ')) {
        const level = line.startsWith('# ') ? 1 : 2;
        const text = line.substring(level + 2);
        const id = text.toLowerCase().replace(/\s+/g, '-');
        extractedHeadings.push({ level, text, id });
      }
    });
    
    setHeadings(extractedHeadings);
  }, [post.content]);

  // Intersection observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            // Heading tracking implementation
          }
        });
      },
      { rootMargin: '-50px 0px -60% 0px' }
    );

    headings.forEach(h => {
      const element = document.getElementById(h.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'copy' | 'whatsapp' | 'facebook' | 'email') => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`;
    const text = `Read "${post.title}" by ${post.author}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        '_blank',
        'width=550,height=420'
      );
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        '_blank',
        'width=550,height=420'
      );
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        '_blank',
        'width=550,height=420'
      );
    } else if (platform === 'whatsapp') {
      window.open(
        `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        '_blank'
      );
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`;
    }
  };

  // Get related posts
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return (
    <article className="min-h-screen py-6 lg:py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 -ml-3">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col gap-6 text-muted-foreground mb-6 pb-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Share this post:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  title="Copy link to clipboard"
                  className="w-max flex items-center justify-center"
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline text-xs">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter"
                  className="w-max flex items-center justify-center"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline text-xs">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                  className="w-max flex items-center justify-center"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline text-xs">LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                  className="w-max flex items-center justify-center"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline text-xs">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('whatsapp')}
                  title="Share on WhatsApp"
                  className="w-max flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline text-xs">WhatsApp</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-16">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => {
                const text = props.children?.toString() || '';
                const id = text.toLowerCase().replace(/\s+/g, '-');
                return (
                  <h1
                    id={id}
                    className="text-4xl font-bold text-foreground mt-8 mb-4 scroll-mt-20"
                    {...props}
                  />
                );
              },
              h2: ({ node, ...props }) => {
                const text = props.children?.toString() || '';
                const id = text.toLowerCase().replace(/\s+/g, '-');
                return (
                  <h2
                    id={id}
                    className="text-2xl font-bold text-foreground mt-6 mb-3 scroll-mt-20"
                    {...props}
                  />
                );
              },
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-bold text-foreground mt-4 mb-2" {...props} />
              ),
              p: ({ node, children, ...props }) => {
                // Check if children contains code blocks or other block elements
                // If so, render as div instead of p to avoid nesting issues
                const hasBlockElement = node?.children?.some((child: any) => 
                  child.type === 'element' && (child.tagName === 'pre' || child.tagName === 'div')
                );
                
                if (hasBlockElement) {
                  return <div className="text-muted-foreground leading-relaxed mb-4" {...props}>{children}</div>;
                }
                
                return <p className="text-muted-foreground leading-relaxed mb-4" {...props}>{children}</p>;
              },
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-outside ml-6 text-muted-foreground mb-4 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-outside ml-6 text-muted-foreground mb-4 space-y-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-muted-foreground leading-relaxed" {...props} />
              ),
              pre: ({ node, children, ...props }: any) => {
                // Extract the code element from pre
                const codeElement = children?.props;
                if (codeElement && codeElement.className) {
                  const match = /language-(\w+)/.exec(codeElement.className || '');
                  const language = match ? match[1] : 'text';
                  const codeString = String(codeElement.children).replace(/\n$/, '');
                  return <CodeBlock language={language} code={codeString} />;
                }
                // Fallback for pre without code
                return <pre className="bg-muted p-4 rounded overflow-x-auto" {...props}>{children}</pre>;
              },
              code: ({ node, inline, className, children, ...props }: any) => {
                // Only handle inline code here, block code is handled by pre
                if (inline) {
                  return (
                    <code
                      className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary border border-primary/30"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                // For non-inline code without pre wrapper (shouldn't happen normally)
                return (
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary" {...props}>
                    {children}
                  </code>
                );
              },
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-foreground" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-foreground" {...props} />
              ),
              a: ({ node, href, ...props }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              img: ({ node, src, alt, ...props }) => (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg my-4"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse border border-muted" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-muted bg-muted p-2 text-left font-semibold" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-muted p-2" {...props} />
              ),
              hr: ({ node, ...props }) => (
                <hr className="my-8 border-muted" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Author */}
        <div className="mb-16 p-6 bg-muted rounded-lg border">
          <p className="text-sm text-muted-foreground mb-2">Written by</p>
          <p className="text-xl font-semibold text-foreground">{post.author}</p>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="group cursor-pointer h-full">
                    {relatedPost.image && (
                      <div className="h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
