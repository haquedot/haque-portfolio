export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  date: string;
  updatedAt?: string;
  image?: string;
  tags: string[];
  readTime: number;
  views?: number;
  likes?: number;
  series?: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "6",
    title: "Next.js Project Structure Explained (app folder, public, components)",
    slug: "nextjs-project-structure-explained-app-folder-public-components",
    excerpt:
      "A comprehensive guide to understanding Next.js project structure, including the app folder with App Router, public directory for static assets, and best practices for organizing components in modern Next.js applications.",
    content: `
# Next.js Project Structure Explained (app folder, public, components)

Understanding the project structure is fundamental to building maintainable and scalable Next.js applications. With Next.js 13+ introducing the App Router and new conventions, it's more important than ever to understand how to organize your code effectively. This comprehensive guide will walk you through every aspect of Next.js project structure in 2026.

## Why Project Structure Matters

A well-organized project structure provides:

- **Maintainability** - Easy to find and update code
- **Scalability** - Structure that grows with your application
- **Team Collaboration** - Clear conventions for multiple developers
- **Performance** - Proper code splitting and optimization
- **Developer Experience** - Faster development and debugging

Poor structure leads to technical debt, difficult refactoring, and decreased productivity. Let's ensure your Next.js project starts on the right foundation.

## Complete Next.js Project Overview

When you create a new Next.js 15 project (latest in 2026), you'll see this structure:

\`\`\`
my-nextjs-app/
├── app/                    # App Router directory (Next.js 13+)
├── public/                 # Static assets
├── components/             # Reusable components (custom)
├── lib/                    # Utility functions (custom)
├── types/                  # TypeScript type definitions (custom)
├── hooks/                  # Custom React hooks (custom)
├── styles/                 # Global stylesheets (optional)
├── config/                 # Configuration files (custom)
├── constants/              # Constants and enums (custom)
├── node_modules/           # Dependencies (auto-generated)
├── .next/                  # Build output (auto-generated)
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS config (if using Tailwind)
└── postcss.config.js      # PostCSS config (if using Tailwind)
\`\`\`

## The App Folder (App Router) - In-Depth

The \`app\` directory is the heart of your Next.js application when using the App Router (default since Next.js 13).

### Basic Structure

\`\`\`
app/
├── layout.tsx             # Root layout (required)
├── page.tsx               # Home page (/)
├── loading.tsx            # Loading UI
├── error.tsx              # Error UI
├── not-found.tsx          # 404 page
├── globals.css            # Global styles
├── favicon.ico            # Favicon
└── sitemap.ts             # Sitemap generation
\`\`\`

### 1. layout.tsx - Root Layout

The root layout wraps your entire application and is **required**.

\`\`\`tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Built with Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* You can add global components here */}
        <header>Global Header</header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  );
}
\`\`\`

**Key Points:**
- Must return \`<html>\` and \`<body>\` tags
- Applies to all routes
- Can include global providers (theme, authentication)
- Persists across navigation

### 2. page.tsx - Routes

The \`page.tsx\` file creates a publicly accessible route.

\`\`\`tsx
// app/page.tsx → /
export default function HomePage() {
  return <h1>Home Page</h1>;
}

// app/about/page.tsx → /about
export default function AboutPage() {
  return <h1>About Page</h1>;
}

// app/blog/[slug]/page.tsx → /blog/:slug
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Blog Post: {params.slug}</h1>;
}
\`\`\`

### 3. Nested Layouts

Create layouts for specific route segments:

\`\`\`
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
└── dashboard/
    ├── layout.tsx          # Dashboard layout
    ├── page.tsx            # /dashboard
    ├── settings/
    │   └── page.tsx        # /dashboard/settings
    └── profile/
        └── page.tsx        # /dashboard/profile
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64">
        <nav>{/* Dashboard sidebar */}</nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
\`\`\`

**Layout nesting** - Layouts nest inside each other, creating a component hierarchy.

### 4. Special Files in App Router

| File | Purpose | Usage |
|------|---------|-------|
| \`layout.tsx\` | Shared UI for route segment | Wraps pages and nested layouts |
| \`page.tsx\` | Unique page content | Creates a route |
| \`loading.tsx\` | Loading UI with Suspense | Automatic loading states |
| \`error.tsx\` | Error handling UI | Error boundaries |
| \`not-found.tsx\` | 404 page | When notFound() is called |
| \`template.tsx\` | Similar to layout but re-renders | When you need fresh state |
| \`default.tsx\` | Fallback for parallel routes | Advanced routing |

### 5. loading.tsx - Loading States

\`\`\`tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="h-64 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
\`\`\`

This automatically wraps your page in \`<Suspense>\` and shows while data loads.

### 6. error.tsx - Error Boundaries

\`\`\`tsx
// app/dashboard/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
\`\`\`

### 7. Route Groups

Organize routes without affecting URL structure using parentheses:

\`\`\`
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx       # /about
│   └── contact/
│       └── page.tsx       # /contact
├── (shop)/
│   ├── products/
│   │   └── page.tsx       # /products
│   └── cart/
│       └── page.tsx       # /cart
└── (auth)/
    ├── login/
    │   └── page.tsx       # /login
    └── register/
        └── page.tsx       # /register
\`\`\`

Each group can have its own layout:

\`\`\`tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <div>
      <nav>{/* Marketing nav */}</nav>
      {children}
    </div>
  );
}

// app/(shop)/layout.tsx
export default function ShopLayout({ children }) {
  return (
    <div>
      <nav>{/* Shop nav with cart */}</nav>
      {children}
    </div>
  );
}
\`\`\`

### 8. Dynamic Routes

Create dynamic routes with square brackets:

\`\`\`
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx          # /blog/:slug
│   └── [category]/
│       └── [id]/
│           └── page.tsx      # /blog/:category/:id
└── products/
    └── [...slug]/
        └── page.tsx          # /products/* (catch-all)
\`\`\`

\`\`\`tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
\`\`\`

### 9. API Routes

Create API endpoints in the App Router:

\`\`\`
app/
└── api/
    ├── posts/
    │   └── route.ts          # /api/posts
    ├── posts/
    │   └── [id]/
    │       └── route.ts      # /api/posts/:id
    └── upload/
        └── route.ts          # /api/upload
\`\`\`

\`\`\`tsx
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await fetchPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
\`\`\`

\`\`\`tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await getPost(params.id);
  return NextResponse.json(post);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deletePost(params.id);
  return new NextResponse(null, { status: 204 });
}
\`\`\`

### 10. Metadata and SEO

Define metadata for better SEO:

\`\`\`tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPost({ params }) {
  // Component code
}
\`\`\`

### 11. Server vs Client Components

**Server Components (default):**
\`\`\`tsx
// app/dashboard/page.tsx - Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // SSR
  });
  return res.json();
}

export default async function Dashboard() {
  const data = await getData();
  return <div>{JSON.stringify(data)}</div>;
}
\`\`\`

**Client Components:**
\`\`\`tsx
// app/components/Counter.tsx - Client Component
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

**When to use Client Components:**
- Event handlers (onClick, onChange, etc.)
- State and lifecycle hooks (useState, useEffect)
- Browser-only APIs (localStorage, window)
- Custom hooks that depend on state/effects
- React class components

## The Public Folder

The \`public\` folder stores **static assets** that are served directly without processing.

### Structure

\`\`\`
public/
├── images/
│   ├── logo.svg
│   ├── hero-bg.jpg
│   └── avatars/
│       └── default.png
├── fonts/
│   └── custom-font.woff2
├── documents/
│   └── terms.pdf
├── favicon.ico
├── robots.txt
└── sitemap.xml
\`\`\`

### Usage

Files in \`public\` are accessible from the root URL:

\`\`\`tsx
import Image from 'next/image';

export default function Logo() {
  // public/images/logo.svg → /images/logo.svg
  return (
    <Image
      src="/images/logo.svg"
      alt="Logo"
      width={200}
      height={50}
    />
  );
}
\`\`\`

### Best Practices for Public Folder

1. **Use Next.js Image Component** - For automatic optimization:
   \`\`\`tsx
   import Image from 'next/image';
   
   <Image src="/images/hero.jpg" alt="Hero" width={1200} height={600} />
   \`\`\`

2. **Organize by Type** - Create subfolders (images, documents, fonts)

3. **Optimize Before Upload** - Compress images before adding to public

4. **Use Descriptive Names** - \`hero-background.jpg\` instead of \`img1.jpg\`

5. **robots.txt and sitemap.xml** - Always include for SEO:
   \`\`\`txt
   # public/robots.txt
   User-agent: *
   Allow: /
   Sitemap: https://yoursite.com/sitemap.xml
   \`\`\`

6. **Favicon** - Include multiple sizes:
   \`\`\`
   public/
   ├── favicon.ico
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   └── android-chrome-192x192.png
   \`\`\`

### What NOT to Put in Public

- ❌ Source code or configuration files
- ❌ Sensitive data or API keys
- ❌ Files that need processing (TypeScript, SCSS)
- ❌ Files with variable content
- ❌ Private user uploads

### Images: Public vs Import

**Public folder (large, static images):**
\`\`\`tsx
<Image src="/images/hero.jpg" alt="Hero" width={1200} height={600} />
\`\`\`

**Import (small assets bundled with code):**
\`\`\`tsx
import logoImage from './logo.png';
<Image src={logoImage} alt="Logo" />
\`\`\`

## Components Organization

Components are the building blocks of your React application. Proper organization is crucial.

### Recommended Structure

\`\`\`
components/
├── ui/                     # Base UI components (shadcn/ui style)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── dropdown.tsx
├── layout/                 # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Navigation.tsx
├── features/               # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthProvider.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogList.tsx
│   │   └── BlogSearch.tsx
│   └── dashboard/
│       ├── StatsCard.tsx
│       └── ActivityFeed.tsx
├── shared/                 # Shared across features
│   ├── Loading.tsx
│   ├── ErrorBoundary.tsx
│   └── EmptyState.tsx
└── providers/              # Context providers
    ├── ThemeProvider.tsx
    ├── AuthProvider.tsx
    └── ModalProvider.tsx
\`\`\`

### Component Types

#### 1. UI Components (Base Components)

Reusable, generic components following a design system:

\`\`\`tsx
// components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
\`\`\`

#### 2. Layout Components

\`\`\`tsx
// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Logo
        </Link>
        <div className="flex gap-6">
          <Link
            href="/about"
            className={pathname === '/about' ? 'font-bold' : ''}
          >
            About
          </Link>
          <Link
            href="/blog"
            className={pathname.startsWith('/blog') ? 'font-bold' : ''}
          >
            Blog
          </Link>
        </div>
        <Button>Get Started</Button>
      </nav>
    </header>
  );
}
\`\`\`

#### 3. Feature Components

\`\`\`tsx
// components/features/blog/BlogCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    image?: string;
    tags: string[];
    date: string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={\`/blog/\${post.slug}\`}>
      <Card className="hover:shadow-lg transition-shadow">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={400}
            height={200}
            className="rounded-t-lg"
          />
        )}
        <CardHeader>
          <div className="flex gap-2 mb-2">
            {post.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.excerpt}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">{post.date}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}
\`\`\`

### Component Naming Conventions

1. **PascalCase** - All component files: \`BlogCard.tsx\`, \`UserProfile.tsx\`
2. **Descriptive Names** - \`LoginForm.tsx\` not \`Form.tsx\`
3. **Feature Prefix** - \`BlogCard.tsx\`, \`BlogList.tsx\`, \`BlogSearch.tsx\`
4. **Avoid Generic Names** - Be specific about what the component does

### Component File Organization

For complex components, use a folder:

\`\`\`
components/
└── features/
    └── blog/
        └── BlogEditor/
            ├── index.tsx           # Main component
            ├── BlogEditor.tsx      # Implementation
            ├── BlogEditorToolbar.tsx
            ├── BlogEditorPreview.tsx
            └── BlogEditor.test.tsx
\`\`\`

### Barrel Exports

Use index files to simplify imports:

\`\`\`tsx
// components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card, CardHeader, CardTitle } from './card';

// Usage
import { Button, Input, Card } from '@/components/ui';
\`\`\`

## Other Important Folders

### lib/ - Utility Functions

\`\`\`
lib/
├── utils.ts                # General utilities
├── api.ts                  # API client
├── db.ts                   # Database configuration
├── auth.ts                 # Authentication utilities
└── validations.ts          # Validation schemas
\`\`\`

\`\`\`tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
\`\`\`

### hooks/ - Custom Hooks

\`\`\`
hooks/
├── use-toast.ts
├── use-media-query.ts
├── use-local-storage.ts
└── use-debounce.ts
\`\`\`

\`\`\`tsx
// hooks/use-media-query.ts
'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
\`\`\`

### types/ - TypeScript Types

\`\`\`
types/
├── index.ts                # Export all types
├── blog.ts                 # Blog-related types
├── user.ts                 # User types
└── api.ts                  # API response types
\`\`\`

\`\`\`tsx
// types/blog.ts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: Author;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}
\`\`\`

### constants/ - Constants and Configuration

\`\`\`
constants/
├── routes.ts               # Route paths
├── config.ts               # App configuration
└── navigation.ts           # Navigation items
\`\`\`

\`\`\`tsx
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => \`/blog/\${slug}\`,
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
} as const;

// constants/config.ts
export const APP_CONFIG = {
  name: 'My Next.js App',
  description: 'Built with Next.js 15',
  url: 'https://myapp.com',
  author: {
    name: 'Your Name',
    url: 'https://yoursite.com',
  },
  social: {
    twitter: '@yourhandle',
    github: 'yourusername',
  },
} as const;
\`\`\`

## Configuration Files

### next.config.js

\`\`\`js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable Turbopack (Next.js 15)
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
\`\`\`

### tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`

## Best Practices

### 1. Folder Naming Conventions

- **lowercase with hyphens** - For route folders: \`blog-posts/\`, \`user-profile/\`
- **PascalCase** - For component folders: \`BlogCard/\`, \`UserProfile/\`
- **Use route groups** - For organization: \`(marketing)/\`, \`(dashboard)/\`

### 2. Import Aliases

Configure path aliases in \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  }
}
\`\`\`

Usage:
\`\`\`tsx
// Instead of
import { Button } from '../../../components/ui/button';

// Use
import { Button } from '@/components/ui/button';
\`\`\`

### 3. Co-location

Keep related files close together:

\`\`\`
app/
└── blog/
    ├── components/          # Blog-specific components
    │   ├── BlogCard.tsx
    │   └── BlogHeader.tsx
    ├── lib/                 # Blog utilities
    │   └── blog-utils.ts
    ├── page.tsx
    └── [slug]/
        └── page.tsx
\`\`\`

### 4. Separation of Concerns

\`\`\`tsx
// ❌ Bad - Everything in one component
export default function BlogPost() {
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    fetch('/api/posts/1').then(r => r.json()).then(setPost);
  }, []);
  
  return <div>{/* Complex JSX */}</div>;
}

// ✅ Good - Separated concerns
// lib/api/posts.ts
export async function getPost(id: string) {
  const res = await fetch(\`/api/posts/\${id}\`);
  return res.json();
}

// components/BlogPost.tsx
export function BlogPost({ post }) {
  return <article>{/* JSX */}</article>;
}

// app/blog/[slug]/page.tsx
export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  return <BlogPost post={post} />;
}
\`\`\`

### 5. Private Folders

Prefix folders with \`_\` to keep them out of routing:

\`\`\`
app/
├── _components/         # Private, not routable
│   └── AdminPanel.tsx
├── _utils/             # Private utilities
│   └── helpers.ts
└── dashboard/
    └── page.tsx
\`\`\`

### 6. Environment Variables

\`\`\`bash
# .env.local
DATABASE_URL=postgresql://...
API_KEY=secret_key

# Public variables (accessible in browser)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_NAME=My App
\`\`\`

**Never commit \`.env.local\` to version control!**

### 7. Static vs Dynamic

Understand when to use static vs dynamic rendering:

\`\`\`tsx
// Static - Build time
export default async function StaticPage() {
  const data = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // or no cache option (default)
  });
  return <div>{/* Render data */}</div>;
}

// Dynamic - Request time
export default async function DynamicPage() {
  const data = await fetch('https://api.example.com/user', {
    cache: 'no-store' // Disable caching
  });
  return <div>{/* Render data */}</div>;
}

// Revalidate - Regenerate at interval
export const revalidate = 3600; // Revalidate every hour

export default async function RevalidatedPage() {
  const data = await fetch('https://api.example.com/posts');
  return <div>{/* Render data */}</div>;
}
\`\`\`

## Common Patterns for 2026

### 1. Server Actions

\`\`\`tsx
// app/actions/posts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  await db.posts.create({ title, content });
  revalidatePath('/blog');
  
  return { success: true };
}

// app/blog/new/page.tsx
import { createPost } from '@/app/actions/posts';

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
\`\`\`

### 2. Parallel Routes

\`\`\`
app/
└── dashboard/
    ├── @stats/
    │   └── page.tsx
    ├── @activity/
    │   └── page.tsx
    ├── layout.tsx
    └── page.tsx
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  stats,
  activity,
}: {
  children: React.ReactNode;
  stats: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        {stats}
        {activity}
      </div>
    </div>
  );
}
\`\`\`

### 3. Intercepting Routes

\`\`\`
app/
├── photos/
│   ├── [id]/
│   │   └── page.tsx          # /photos/123
│   └── (..)photos/
│       └── [id]/
│           └── page.tsx      # Intercepts /photos/123 when soft navigating
\`\`\`

### 4. Middleware

\`\`\`tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Authentication check
  const token = request.cookies.get('auth')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
\`\`\`

## Example: Complete E-commerce Structure

Here's a real-world example of a complete Next.js e-commerce structure:

\`\`\`
ecommerce-app/
├── app/
│   ├── (shop)/                    # Shop routes
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home/Products listing
│   │   ├── products/
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx       # Product detail
│   │   │   │   └── loading.tsx
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   └── orders/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── (auth)/                    # Auth routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/                 # Admin dashboard
│   │   ├── @stats/
│   │   ├── @orders/
│   │   ├── layout.tsx
│   │   ├── products/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── cart/
│   │   │   └── route.ts
│   │   └── orders/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # Base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── features/
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductSearch.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartDrawer.tsx
│   │   └── checkout/
│   │       ├── CheckoutForm.tsx
│   │       ├── ShippingForm.tsx
│   │       └── PaymentForm.tsx
│   └── providers/
│       ├── CartProvider.tsx
│       └── ThemeProvider.tsx
├── lib/
│   ├── api/
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   ├── db.ts
│   ├── utils.ts
│   └── validations.ts
├── hooks/
│   ├── use-cart.ts
│   ├── use-products.ts
│   └── use-toast.ts
├── types/
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   └── user.ts
├── constants/
│   ├── routes.ts
│   ├── config.ts
│   └── categories.ts
├── public/
│   ├── images/
│   │   ├── products/
│   │   └── banners/
│   ├── favicon.ico
│   └── robots.txt
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
\`\`\`

## Debugging and Development Tips

### 1. VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Quick component generation
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind
- **Error Lens** - Inline error display
- **Auto Import** - Automatic import statements

### 2. Useful npm Scripts

\`\`\`json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "analyze": "ANALYZE=true next build"
  }
}
\`\`\`

### 3. Environment-Specific Configs

\`\`\`
.env                # Defaults
.env.local          # Local overrides (gitignored)
.env.development    # Development
.env.production     # Production
\`\`\`

## Conclusion

Understanding Next.js project structure is fundamental to building maintainable applications. Here's a quick recap:

**App Folder:**
- ✅ Uses file-system routing
- ✅ Supports server and client components
- ✅ Provides special files (layout, page, loading, error)
- ✅ Enables nested layouts and route groups

**Public Folder:**
- ✅ Stores static assets served from root
- ✅ Accessible via \`/filename\`
- ✅ No processing or optimization (use Image component)

**Components:**
- ✅ Organized by type (ui, layout, features)
- ✅ Use barrel exports for cleaner imports
- ✅ Co-locate when possible
- ✅ Follow naming conventions

**Other Folders:**
- ✅ \`lib/\` - Utilities and helpers
- ✅ \`hooks/\` - Custom React hooks
- ✅ \`types/\` - TypeScript definitions
- ✅ \`constants/\` - Configuration and constants

As your application grows, this structure will scale with you. Start simple, and add complexity only when needed. The key is consistency—once you establish patterns, stick to them across your project.

**Pro Tip:** Don't over-engineer from the start. Begin with a simple structure and refactor as patterns emerge in your codebase.

Happy coding with Next.js! 🚀
    `,
    author: "Merajul Haque",
    date: "2026-02-16",
    tags: ["Next.js", "Project Structure", "App Router", "Best Practices", "Tutorial"],
    readTime: 25,
    featured: true,
  },
  {
    id: "5",
    title: "Installing Next.js + create-next-app Setup (Beginner Guide)",
    slug: "installing-nextjs-create-next-app-setup-beginner-guide",
    excerpt:
      "A complete step-by-step guide for beginners to install Next.js using create-next-app, understand the project structure, and start building modern web applications with confidence.",
    content: `
# Installing Next.js + create-next-app Setup (Beginner Guide)

Welcome to the world of Next.js! If you're new to web development or transitioning from React, this comprehensive guide will walk you through everything you need to know about installing and setting up Next.js using create-next-app. By the end of this tutorial, you'll have a fully functional Next.js application running on your machine.

## What is Next.js?

Before we dive into installation, let's briefly understand what Next.js is. Next.js is a powerful React framework that enables you to build full-stack web applications with features like server-side rendering, static site generation, API routes, and much more—all out of the box.

## Prerequisites

Before installing Next.js, ensure you have the following installed on your system:

### 1. Node.js (Required)

Next.js requires **Node.js 18.17 or later**. To check if you have Node.js installed:

\`\`\`bash
node --version
\`\`\`

If you don't have Node.js or need to update it, download it from [nodejs.org](https://nodejs.org/). We recommend downloading the **LTS (Long Term Support)** version.

### 2. Package Manager (Choose One)

You'll need one of these package managers:
- **npm** (comes with Node.js)
- **yarn** (optional, install via: \`npm install -g yarn\`)
- **pnpm** (optional, install via: \`npm install -g pnpm\`)
- **bun** (optional, fastest option in 2026)

### 3. Code Editor

We recommend **Visual Studio Code** (VS Code) with these extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

## Installation Methods

### Method 1: Automatic Installation with create-next-app (Recommended)

The easiest and recommended way to create a new Next.js application is using \`create-next-app\`, which sets up everything automatically.

#### Step 1: Open Your Terminal

- **Windows**: PowerShell, Command Prompt, or Windows Terminal
- **macOS**: Terminal
- **Linux**: Terminal

#### Step 2: Run the Create Command

Navigate to the folder where you want to create your project, then run:

\`\`\`bash
npx create-next-app@latest
\`\`\`

**Using other package managers:**

\`\`\`bash
# Using yarn
yarn create next-app

# Using pnpm
pnpm create next-app

# Using bun (fastest in 2026)
bunx create-next-app
\`\`\`

#### Step 3: Interactive Setup

You'll be prompted with several questions. Here's what each option means:

\`\`\`bash
✔ What is your project named? › my-nextjs-app
✔ Would you like to use TypeScript? › No / Yes
✔ Would you like to use ESLint? › No / Yes
✔ Would you like to use Tailwind CSS? › No / Yes
✔ Would you like to use \`src/\` directory? › No / Yes
✔ Would you like to use App Router? (recommended) › No / Yes
✔ Would you like to customize the default import alias (@/*)? › No / Yes
\`\`\`

**Recommended Choices for Beginners:**

| Option | Recommendation | Reason |
|--------|---------------|---------|
| **Project name** | my-nextjs-app | Any name you prefer |
| **TypeScript** | Yes | Better code quality and autocomplete |
| **ESLint** | Yes | Catches errors early |
| **Tailwind CSS** | Yes | Rapid styling without CSS files |
| **\`src/\` directory** | No | Simpler structure for beginners |
| **App Router** | Yes | Modern approach (default in Next.js 13+) |
| **Import alias** | No (default @/*) | The default works great |

#### Step 4: Wait for Installation

The tool will:
1. Create your project folder
2. Install all necessary dependencies
3. Set up the basic file structure

This typically takes 1-3 minutes depending on your internet connection.

### Method 2: Manual Installation

For learning purposes, here's how to set up Next.js manually:

\`\`\`bash
# Create project directory
mkdir my-nextjs-app
cd my-nextjs-app

# Initialize npm project
npm init -y

# Install Next.js, React, and React DOM
npm install next@latest react@latest react-dom@latest

# Install TypeScript and types (optional)
npm install -D typescript @types/react @types/node
\`\`\`

Then create the following files:

**package.json scripts:**
\`\`\`json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
\`\`\`

**Create app/page.tsx:**
\`\`\`tsx
export default function Home() {
  return <h1>Hello Next.js!</h1>;
}
\`\`\`

**Create app/layout.tsx:**
\`\`\`tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Understanding the Project Structure

After installation, your project will look like this:

\`\`\`
my-nextjs-app/
├── app/                    # App Router directory (Next.js 13+)
│   ├── favicon.ico        # Website icon
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── public/                # Static assets (images, fonts)
├── node_modules/          # Dependencies (don't edit)
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore rules
├── next.config.js        # Next.js configuration
├── package.json          # Project metadata and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS config (if selected)
└── postcss.config.js     # PostCSS config (if using Tailwind)
\`\`\`

### Key Files Explained

#### 1. app/page.tsx - Your Home Page

This is the main page of your application (\`/\` route):

\`\`\`tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  );
}
\`\`\`

#### 2. app/layout.tsx - Root Layout

The layout wraps all pages and persists across navigation:

\`\`\`tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create-next-app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
\`\`\`

#### 3. next.config.js - Next.js Configuration

Configure Next.js behavior:

\`\`\`js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration options go here
};

export default nextConfig;
\`\`\`

#### 4. package.json - Scripts

Your available npm scripts:

\`\`\`json
{
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Build for production
    "start": "next start",       // Start production server
    "lint": "next lint"          // Run ESLint
  }
}
\`\`\`

## Running Your Next.js Application

### Development Mode

Navigate to your project folder and run:

\`\`\`bash
cd my-nextjs-app
npm run dev
\`\`\`

**Using other package managers:**
\`\`\`bash
yarn dev
pnpm dev
bun dev
\`\`\`

You should see output like:

\`\`\`
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 2.3s
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your Next.js app running!

### Development Features

- **Fast Refresh** - See changes instantly without losing component state
- **Error Overlay** - Helpful error messages in the browser
- **TypeScript Errors** - Real-time type checking
- **Hot Module Replacement (HMR)** - Updates without full page reload

### Changing the Port

If port 3000 is already in use:

\`\`\`bash
npm run dev -- -p 3001
\`\`\`

Or modify package.json:
\`\`\`json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
\`\`\`

## Creating Your First Page

Let's create an "About" page to understand routing:

### Step 1: Create the Route Folder

\`\`\`bash
mkdir app/about
\`\`\`

### Step 2: Create page.tsx

Create \`app/about/page.tsx\`:

\`\`\`tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg">
        This is my first Next.js application!
      </p>
    </div>
  );
}
\`\`\`

### Step 3: Visit the Page

Navigate to [http://localhost:3000/about](http://localhost:3000/about) to see your new page!

### Adding Navigation

Update \`app/page.tsx\` to include a link:

\`\`\`tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to Next.js!</h1>
      <Link 
        href="/about" 
        className="text-blue-500 hover:underline"
      >
        Go to About Page →
      </Link>
    </main>
  );
}
\`\`\`

## Configuration Options Deep Dive

### Tailwind CSS Setup (If Not Installed Initially)

If you skipped Tailwind during setup, you can add it later:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

Update \`tailwind.config.ts\`:
\`\`\`ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
\`\`\`

Add to \`app/globals.css\`:
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

### Environment Variables

Create \`.env.local\` for sensitive data:

\`\`\`bash
# .env.local
DATABASE_URL=your_database_url
API_KEY=your_api_key
NEXT_PUBLIC_SITE_NAME=My Next App
\`\`\`

**Important:** Variables prefixed with \`NEXT_PUBLIC_\` are exposed to the browser.

Use in your code:
\`\`\`tsx
const apiKey = process.env.API_KEY; // Server-only
const siteName = process.env.NEXT_PUBLIC_SITE_NAME; // Available everywhere
\`\`\`

### Next.js Configuration Advanced

\`\`\`js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Allow external images
  },
  env: {
    CUSTOM_KEY: 'value',
  },
  // Enable Turbopack (faster than Webpack)
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
\`\`\`

## Building for Production

When you're ready to deploy:

### Step 1: Build Your App

\`\`\`bash
npm run build
\`\`\`

This command:
1. Optimizes your code
2. Generates static pages
3. Creates production bundles
4. Analyzes bundle sizes

Output example:
\`\`\`
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB        87.4 kB
└ ○ /about                               1.8 kB        83.2 kB

○  (Static)  prerendered as static content
\`\`\`

### Step 2: Test Production Build Locally

\`\`\`bash
npm run start
\`\`\`

This starts a production server at [http://localhost:3000](http://localhost:3000).

## Common Issues and Troubleshooting

### Issue 1: Port Already in Use

**Error:** \`Port 3000 is already in use\`

**Solution:**
\`\`\`bash
# Use different port
npm run dev -- -p 3001

# Or kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
\`\`\`

### Issue 2: Module Not Found

**Error:** \`Module not found: Can't resolve 'xyz'\`

**Solution:**
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
\`\`\`

### Issue 3: Hydration Errors

**Error:** \`Hydration failed because the initial UI does not match...\`

**Common Causes:**
- Using browser-only APIs in server components
- Inconsistent HTML structure between server and client
- Using \`new Date()\` without timezone handling

**Solution:**
\`\`\`tsx
'use client'; // Mark as client component if using browser APIs

import { useEffect, useState } from 'react';

export default function TimeComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <div>{new Date().toLocaleString()}</div>;
}
\`\`\`

### Issue 4: TypeScript Errors

**Error:** \`Type 'string' is not assignable to type...\`

**Solution:**
- Read the error message carefully
- Check your type definitions
- Use \`any\` as a last resort (not recommended)
- Restart TypeScript server in VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

### Issue 5: Slow Development Server

**Solutions:**
1. **Enable Turbopack (Next.js 14+):**
   \`\`\`bash
   npm run dev --turbo
   \`\`\`

2. **Reduce file watching:**
   \`\`\`js
   // next.config.js
   module.exports = {
     webpack: (config) => {
       config.watchOptions = {
         poll: 1000,
         aggregateTimeout: 300,
       };
       return config;
     },
   };
   \`\`\`

3. **Close unnecessary applications**
4. **Use SSD instead of HDD**

## Best Practices for Beginners

### 1. Organize Your Project Structure

\`\`\`
app/
├── components/          # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                # Utility functions
│   └── utils.ts
├── types/              # TypeScript types
│   └── index.ts
├── (routes)/
│   ├── about/
│   └── contact/
├── layout.tsx
└── page.tsx
\`\`\`

### 2. Use Server Components by Default

\`\`\`tsx
// Server Component (default) - Fast and SEO-friendly
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts');
  return <div>{/* render posts */}</div>;
}
\`\`\`

Only use client components when you need:
- Event handlers (onClick, onChange)
- State (useState, useReducer)
- Effects (useEffect)
- Browser APIs (localStorage, window)

### 3. Optimize Images

Always use the Next.js Image component:

\`\`\`tsx
import Image from 'next/image';

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={500}
      priority // For above-the-fold images
    />
  );
}
\`\`\`

### 4. Use Metadata for SEO

\`\`\`tsx
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | My Next.js App',
  description: 'Welcome to my awesome Next.js application',
};

export default function Home() {
  return <div>Home Page</div>;
}
\`\`\`

### 5. Keep Dependencies Updated

\`\`\`bash
# Check for outdated packages
npm outdated

# Update Next.js and React
npm install next@latest react@latest react-dom@latest

# Or update all dependencies
npm update
\`\`\`

## Next Steps After Installation

Now that you have Next.js installed, here's what to learn next:

### 1. Master Routing
- Dynamic routes: \`[id]\`, \`[slug]\`
- Route groups: \`(marketing)\`, \`(dashboard)\`
- Parallel routes: \`@modal\`, \`@sidebar\`
- Intercepting routes: \`(..)folder\`

### 2. Learn Data Fetching
\`\`\`tsx
// Server Component data fetching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // or 'force-cache' for SSG
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{JSON.stringify(data)}</div>;
}
\`\`\`

### 3. Create API Routes
\`\`\`tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}
\`\`\`

### 4. Add Authentication
Popular options:
- NextAuth.js (Auth.js)
- Clerk
- Supabase Auth
- Firebase Auth

### 5. Deploy Your App
Easy deployment platforms:
- **Vercel** (made by Next.js creators) - Easiest
- **Netlify**
- **AWS Amplify**
- **Cloudflare Pages**
- **Digital Ocean**

## Resources for Learning

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs) - Comprehensive official docs
- [Next.js Learn](https://nextjs.org/learn) - Interactive tutorial
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples) - 300+ examples

### Video Tutorials
- Next.js YouTube Channel
- Web Dev Simplified
- Traversy Media
- Fireship

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [r/nextjs on Reddit](https://reddit.com/r/nextjs)

## Conclusion

Congratulations! You've successfully installed Next.js and learned the fundamentals of project setup. You now understand:

✅ How to install Next.js using create-next-app
✅ The project structure and key files
✅ How to run development and production servers
✅ How to create pages and routes
✅ Basic configuration options
✅ Common troubleshooting techniques
✅ Best practices for beginners

Next.js makes building modern web applications easier and more efficient. Don't be intimidated by all the features—start small, build projects, and gradually explore advanced features as you become more comfortable.

**Remember:** Every expert was once a beginner. Keep coding, keep learning, and most importantly, have fun building with Next.js!

## Quick Reference Commands

\`\`\`bash
# Create new Next.js app
npx create-next-app@latest my-app

# Navigate to project
cd my-app

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Install a package
npm install package-name

# Update Next.js
npm install next@latest
\`\`\`

Happy coding! 🚀
    `,
    author: "Merajul Haque",
    date: "2026-02-15",
    tags: ["Next.js", "Tutorial", "Beginner", "Installation", "Setup", "create-next-app"],
    readTime: 18,
    featured: true,
  },
  {
    id: "4",
    title: "What is Next.js? Why Use It Over React?",
    slug: "what-is-nextjs-why-use-it-over-react",
    excerpt:
      "A comprehensive guide comparing Next.js and React, exploring the advantages of Next.js for modern web development, including SSR, performance optimization, and enhanced developer experience.",
    content: `
# What is Next.js? Why Use It Over React?

In the evolving landscape of web development, choosing the right framework can significantly impact your project's success. While React has been the go-to library for building user interfaces, Next.js has emerged as a powerful framework built on top of React. Let's dive deep into what Next.js is and why you might choose it over plain React.

## Understanding React

React is a JavaScript library developed by Facebook for building user interfaces. It focuses on creating reusable UI components and managing the application state efficiently. React provides:

- **Component-Based Architecture** - Build encapsulated components that manage their own state
- **Virtual DOM** - Efficient updates and rendering
- **One-Way Data Flow** - Predictable data management
- **JSX Syntax** - Write HTML-like code in JavaScript

However, React is just a library, not a complete framework. It handles the view layer but leaves routing, data fetching, and many other concerns to third-party libraries.

## What is Next.js?

Next.js is a production-ready React framework created by Vercel. It extends React with powerful features that make building full-stack web applications easier and more efficient. Think of it as React with superpowers.

\`\`\`tsx
// A simple Next.js page component
export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>The React Framework for Production</p>
    </div>
  );
}
\`\`\`

## Key Advantages of Next.js Over React

### 1. Server-Side Rendering (SSR) & Static Site Generation (SSG)

Next.js provides multiple rendering strategies out of the box, while React requires additional setup.

**Next.js Server Components:**
\`\`\`tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // SSR
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <div>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
\`\`\`

**React (requires additional libraries like React Server Components or frameworks):**
\`\`\`tsx
function PostsPage() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);
  
  return <div>{/* render posts */}</div>;
}
\`\`\`

### 2. File-Based Routing

Next.js uses an intuitive file-system based router, eliminating the need for react-router-dom.

**Next.js Structure:**
\`\`\`
app/
├── page.tsx                  → /
├── about/
│   └── page.tsx             → /about
├── blog/
│   ├── page.tsx             → /blog
│   └── [slug]/
│       └── page.tsx         → /blog/:slug
└── dashboard/
    ├── layout.tsx
    └── page.tsx             → /dashboard
\`\`\`

**React requires setup:**
\`\`\`tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### 3. Built-in Performance Optimization

Next.js automatically optimizes your application:

- **Automatic Code Splitting** - Only load JavaScript needed for each page
- **Image Optimization** - The Image component automatically optimizes images
- **Font Optimization** - Automatic font optimization with zero layout shift

\`\`\`tsx
import Image from 'next/image';

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={500}
      priority // Preload critical images
    />
  );
}
\`\`\`

### 4. SEO Advantages

Next.js excels at SEO with server-side rendering and built-in metadata support.

\`\`\`tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPost({ params }) {
  // Component code
}
\`\`\`

React requires additional libraries and configuration for proper SEO.

### 5. API Routes

Next.js allows you to build API endpoints alongside your frontend code.

\`\`\`tsx
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await fetchPostsFromDB();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newPost = await createPost(body);
  return NextResponse.json(newPost, { status: 201 });
}
\`\`\`

This eliminates the need for a separate backend for many use cases.

### 6. TypeScript Support

Both support TypeScript, but Next.js provides better out-of-the-box configuration.

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

### 7. Middleware & Edge Functions

Next.js supports middleware for request manipulation before rendering.

\`\`\`tsx
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Redirect logged-out users
  if (!request.cookies.get('auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/dashboard/:path*',
};
\`\`\`

### 8. Advanced Data Fetching Patterns

**Server Actions (Next.js 14+):**
\`\`\`tsx
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  
  await db.posts.create({ title, content });
  revalidatePath('/blog');
}

// In component
'use client';
export default function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create</button>
    </form>
  );
}
\`\`\`

### 9. Streaming and Suspense

Next.js App Router has built-in support for React Suspense and streaming.

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <DataComponent />
      </Suspense>
    </div>
  );
}
\`\`\`

## When to Use Next.js Over React

**Choose Next.js when:**
- Building production applications that need SEO
- Requiring server-side rendering or static generation
- Need built-in routing and navigation
- Want optimal performance out of the box
- Building full-stack applications
- Need fast initial page loads
- Working on e-commerce, blogs, marketing sites, or SaaS platforms

**Stick with React when:**
- Building single-page applications (SPAs) that don't need SSR
- Creating embedded widgets or components for other applications
- Developing mobile apps with React Native
- You need maximum flexibility and control
- Your project doesn't benefit from Next.js features

## Performance Comparison

| Feature | React | Next.js |
|---------|-------|---------|
| Initial Load Time | Slower (CSR) | Faster (SSR/SSG) |
| SEO | Requires extra work | Built-in |
| Code Splitting | Manual setup | Automatic |
| Image Optimization | External libraries | Built-in |
| Bundle Size | Can be large | Optimized |

## Modern Best Practices (2026)

1. **Embrace Server Components** - Use server components by default, client components only when needed
2. **Leverage Partial Prerendering** - Combine static and dynamic content efficiently
3. **Use Turbopack** - Next.js's new bundler for faster builds
4. **Implement Incremental Static Regeneration** - For dynamic but cacheable content
5. **Optimize with React Compiler** - Next.js integrates with React's new compiler

## Real-World Example: Blog Platform

\`\`\`tsx
// app/blog/page.tsx - Server Component
export default async function BlogPage() {
  const posts = await getPosts(); // Runs on server
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <Link key={post.id} href={\`/blog/\${post.slug}\`}>
          <BlogCard post={post} />
        </Link>
      ))}
    </div>
  );
}

// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <CommentSection postId={post.id} /> {/* Client Component */}
    </article>
  );
}
\`\`\`

## Migration Path

If you're considering moving from React to Next.js:

1. **Start with App Router** - Use the modern approach
2. **Gradually Convert Components** - Move client-side logic to server components where possible
3. **Leverage Codemods** - Next.js provides migration tools
4. **Test Thoroughly** - Ensure SSR doesn't break existing functionality

## Conclusion

Next.js isn't a replacement for React—it's React enhanced with powerful features for production applications. While React gives you flexibility, Next.js provides structure, performance, and developer experience improvements that can significantly accelerate your development process.

For most modern web applications, especially those requiring SEO, performance, and scalability, Next.js is the superior choice. It handles the complex infrastructure concerns, allowing you to focus on building great user experiences.

**The Bottom Line:** If you're starting a new React project in 2026, strongly consider Next.js. It offers everything React provides plus production-ready features that would otherwise require extensive setup and maintenance.
    `,
    author: "Merajul Haque",
    date: "2026-02-14",
    tags: ["Next.js", "React", "Web Development", "Framework Comparison", "SSR"],
    readTime: 15,
    featured: true,
  },
  {
    id: "1",
    title: "Getting Started with Next.js 14: App Router Guide",
    slug: "nextjs-14-app-router-guide",
    excerpt:
      "Learn how to leverage Next.js 14's powerful App Router to build faster, more efficient web applications with server and client components.",
    content: `
# Getting Started with Next.js 14: App Router Guide

Next.js 14 introduces the App Router, a revolutionary approach to building React applications. This guide will walk you through the fundamentals and best practices.

## What is the App Router?

The App Router is Next.js's modern routing system that replaces the traditional Pages Router. It uses the file system to define routes and supports both server and client components natively.

## Key Features

### 1. Server Components by Default
Server components in Next.js 14 run exclusively on the server, reducing JavaScript sent to the client and improving performance.

\`\`\`tsx
// app/posts/page.tsx - This is a Server Component by default
export default async function PostsPage() {
  const posts = await fetchPosts();
  return <div>{/* Render posts */}</div>;
}
\`\`\`

### 2. Client Components with 'use client'
When you need interactivity, mark components with the 'use client' directive.

\`\`\`tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

### 3. Dynamic Routes
Create dynamic routes by using square brackets in your file names.

\`\`\`
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx
│   └── page.tsx
\`\`\`

## Layouts and Nesting

Layouts allow you to create shared UI that persists across multiple pages.

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Best Practices

1. **Use Server Components by Default** - They improve performance and reduce bundle size
2. **Only Use Client Components When Needed** - For interactivity and browser APIs
3. **Leverage Async/Await** - Server components support async operations
4. **Organize Your Routes Clearly** - Use meaningful folder structures

## Conclusion

Next.js 14's App Router provides a modern, efficient way to build React applications. By understanding server and client components, you can build faster, more maintainable applications.
    `,
    author: "Merajul Haque",
    date: "2025-12-01",
    // image: "",
    tags: ["Next.js", "React", "Web Development", "App Router"],
    readTime: 8,
  },
  {
    id: "2",
    title: "Building Scalable APIs with Node.js and Express",
    slug: "building-scalable-apis-nodejs-express",
    excerpt:
      "Discover best practices for building robust and scalable REST APIs using Node.js and Express.js with proper error handling and middleware architecture.",
    content: `
# Building Scalable APIs with Node.js and Express

Creating scalable APIs is essential for modern web applications. This guide covers best practices for building production-ready APIs with Node.js and Express.

## Architecture Overview

A well-designed API follows a clear architecture pattern:

\`\`\`
routes → controllers → services → models → database
\`\`\`

### Routes
Define your API endpoints and map them to controllers.

\`\`\`js
// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);

module.exports = router;
\`\`\`

### Controllers
Handle request and response logic.

\`\`\`js
// controllers/userController.js
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
\`\`\`

### Services
Encapsulate business logic.

\`\`\`js
// services/userService.js
const User = require('../models/User');

exports.getAllUsers = async () => {
  return await User.find();
};

exports.createNewUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
\`\`\`

## Error Handling

Implement comprehensive error handling:

\`\`\`js
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({ error: { status, message } });
};

module.exports = errorHandler;
\`\`\`

## Authentication & Authorization

Secure your APIs with proper authentication:

\`\`\`js
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
\`\`\`

## Best Practices

1. **Use Environment Variables** - Never hardcode sensitive data
2. **Implement Rate Limiting** - Protect against abuse
3. **Validate Input** - Use libraries like Joi or Yup
4. **Log Everything** - Use Winston or Morgan for logging
5. **Write Tests** - Use Jest or Mocha for testing

## Conclusion

Building scalable APIs requires careful planning and adherence to best practices. By following these patterns, you'll create maintainable and efficient APIs.
    `,
    author: "Merajul Haque",
    date: "2025-11-28",
    // image: "",
    tags: ["Node.js", "Express", "API Development", "Backend"],
    readTime: 10,
  },
  {
    id: "3",
    title: "React Performance Optimization Techniques",
    slug: "react-performance-optimization",
    excerpt:
      "Optimize your React applications with memoization, code splitting, and lazy loading techniques to ensure smooth user experiences.",
    content: `
# React Performance Optimization Techniques

Performance is crucial for user experience. Learn advanced techniques to optimize your React applications.

## 1. Memoization with React.memo

Prevent unnecessary re-renders of components:

\`\`\`tsx
import { memo } from 'react';

const UserCard = memo(({ user }) => {
  return <div>{user.name}</div>;
});

export default UserCard;
\`\`\`

## 2. useMemo Hook

Memoize expensive calculations:

\`\`\`tsx
import { useMemo } from 'react';

export default function ProductList({ products }) {
  const total = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price, 0);
  }, [products]);

  return <div>Total: {total}</div>;
}
\`\`\`

## 3. useCallback Hook

Memoize callback functions:

\`\`\`tsx
import { useCallback } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }, []);

  return <TodoForm onAdd={addTodo} />;
}
\`\`\`

## 4. Code Splitting and Lazy Loading

Use dynamic imports to load components only when needed:

\`\`\`tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
\`\`\`

## 5. Virtual Scrolling

Render only visible items in large lists:

\`\`\`tsx
import { FixedSizeList as List } from 'react-window';

export default function LargeList({ items }) {
  return (
    <List height={600} itemCount={items.length} itemSize={35} width="100%">
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </List>
  );
}
\`\`\`

## Best Practices

1. **Profile Your App** - Use React DevTools Profiler
2. **Avoid Inline Objects/Functions** - Define outside components
3. **Use Keys Properly** - Essential for list rendering
4. **Split Large Bundles** - Implement code splitting early
5. **Monitor Bundle Size** - Use webpack-bundle-analyzer

## Conclusion

By applying these optimization techniques, you'll significantly improve your React application's performance and user experience.
    `,
    author: "Merajul Haque",
    date: "2025-11-20",
    // image: "",
    tags: ["React", "Performance", "Web Development", "Optimization"],
    readTime: 9,
  },
];
