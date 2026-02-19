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
    id: "9",
    title: "Link & Navigation in Next.js (next/link, useRouter)",
    slug: "link-navigation-in-nextjs-next-link-userouter",
    excerpt:
      "Master navigation in Next.js with this comprehensive guide. Learn how to use the Link component, useRouter hook, programmatic navigation, and advanced patterns for building fast, SEO-friendly applications with optimal user experience.",
    content: `
# Link & Navigation in Next.js (next/link, useRouter)

Navigation is the backbone of any web application, and Next.js provides powerful tools to create fast, seamless navigation experiences. In this comprehensive guide, we'll explore everything from basic link components to advanced navigation patterns used in modern production applications.

## Table of Contents

1. Introduction to Navigation in Next.js
2. The Link Component Deep Dive
3. Client-Side Navigation Mechanics
4. useRouter Hook and Navigation Hooks
5. Programmatic Navigation Patterns
6. Advanced Link Features
7. Navigation Events and Loading States
8. Route Groups and Parallel Routes
9. Intercepting Routes
10. Navigation Performance Optimization
11. SEO and Accessibility Considerations
12. Real-World Examples
13. Best Practices and Common Pitfalls

## 1. Introduction to Navigation in Next.js

Next.js revolutionizes web navigation by combining the best of both worlds: the instant feel of single-page applications (SPAs) and the SEO benefits of server-side rendering (SSR).

### Why Next.js Navigation is Different

\`\`\`typescript
// Traditional HTML navigation (full page reload)
<a href="/about">About</a>

// Next.js Link component (client-side navigation)
import Link from 'next/link';
<Link href="/about">About</Link>
\`\`\`

**Key Benefits:**

- **Client-side navigation** - No full page reloads
- **Prefetching** - Routes are loaded before clicking
- **Instant navigation** - Near-instant page transitions
- **State preservation** - React state persists during navigation
- **Optimistic UI updates** - Immediate feedback to users

## 2. The Link Component Deep Dive

The \`<Link>\` component is the primary way to navigate between routes in Next.js.

### Basic Usage

\`\`\`tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
\`\`\`

### Dynamic Routes

\`\`\`tsx
// Linking to dynamic routes
<Link href="/blog/my-first-post">
  Read Post
</Link>

// Using template literals
<Link href={\`/blog/\${post.slug}\`}>
  {post.title}
</Link>

// Using URL objects for complex routes
<Link 
  href={{
    pathname: '/blog/[slug]',
    query: { slug: 'my-post', ref: 'homepage' }
  }}
>
  Read More
</Link>
\`\`\`

### Link Props and Configuration

\`\`\`tsx
import Link from 'next/link';

export default function AdvancedLinks() {
  return (
    <>
      {/* Prefetch disabled for conditional navigation */}
      <Link href="/dashboard" prefetch={false}>
        Dashboard (No Prefetch)
      </Link>

      {/* Replace current history entry */}
      <Link href="/login" replace>
        Login (Replace)
      </Link>

      {/* Scroll to top disabled */}
      <Link href="/docs#section" scroll={false}>
        Go to Section
      </Link>

      {/* Shallow routing (query params only) */}
      <Link href="/?page=2" shallow>
        Next Page
      </Link>

      {/* Custom locale for i18n */}
      <Link href="/about" locale="fr">
        À propos
      </Link>
    </>
  );
}
\`\`\`

### Styling Links

\`\`\`tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <nav className="flex gap-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive 
                ? 'text-blue-600 font-bold' 
                : 'text-gray-600 hover:text-gray-900'
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
\`\`\`

## 3. Client-Side Navigation Mechanics

Understanding how Next.js navigation works under the hood helps you build better applications.

### Prefetching Behavior

\`\`\`tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PrefetchDemo() {
  const [isPrefetchEnabled, setIsPrefetchEnabled] = useState(true);

  return (
    <div>
      <h2>Prefetch Control</h2>
      
      {/* Prefetch enabled (default) */}
      <Link href="/heavy-page" prefetch={isPrefetchEnabled}>
        Heavy Page (Prefetch: {isPrefetchEnabled ? 'On' : 'Off'})
      </Link>

      <button onClick={() => setIsPrefetchEnabled(!isPrefetchEnabled)}>
        Toggle Prefetch
      </button>

      {/* Conditional prefetching */}
      <Link 
        href="/premium-content"
        prefetch={userIsPremium ? true : false}
      >
        Premium Content
      </Link>
    </div>
  );
}
\`\`\`

**Prefetching Rules (Next.js 14+):**

1. **Production mode only** - Prefetching is disabled in development
2. **Viewport detection** - Links are prefetched when they enter viewport
3. **Static routes** - Full route prefetched
4. **Dynamic routes** - Only shared layout prefetched up to loading.js
5. **Cache duration** - Prefetched data cached for 30 seconds

### Router Cache

\`\`\`typescript
// Next.js automatically caches navigated routes
// Cache categories:
// 1. Static routes - Cached indefinitely
// 2. Dynamic routes - Cached for 30 seconds

// Force revalidation
router.refresh();
\`\`\`

## 4. useRouter Hook and Navigation Hooks

The App Router provides several hooks for navigation and route information.

### useRouter Hook

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  const handleRefresh = () => {
    // Refresh current route and fetch new data
    router.refresh();
  };

  return (
    <div>
      <button onClick={handleBack}>← Back</button>
      <button onClick={handleForward}>Forward →</button>
      <button onClick={handleRefresh}>🔄 Refresh</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
\`\`\`

### usePathname Hook

\`\`\`tsx
'use client';

import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // pathname: '/blog/my-first-post'
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex gap-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        {segments.map((segment, index) => {
          const href = \`/\${segments.slice(0, index + 1).join('/')}\`;
          const isLast = index === segments.length - 1;
          
          return (
            <li key={href}>
              / {isLast ? (
                <span>{segment}</span>
              ) : (
                <Link href={href}>{segment}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
\`\`\`

### useSearchParams Hook

\`\`\`tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function ProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(\`\${pathname}?\${params.toString()}\`);
  };

  return (
    <div>
      <select 
        value={currentCategory}
        onChange={(e) => updateSearchParams('category', e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select 
        value={currentSort}
        onChange={(e) => updateSearchParams('sort', e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
\`\`\`

### useParams Hook (for Dynamic Routes)

\`\`\`tsx
'use client';

import { useParams } from 'next/navigation';

// In app/blog/[category]/[slug]/page.tsx
export default function BlogPost() {
  const params = useParams();
  
  // params.category: 'technology'
  // params.slug: 'my-first-post'
  
  return (
    <article>
      <h1>Category: {params.category}</h1>
      <h2>Post: {params.slug}</h2>
    </article>
  );
}
\`\`\`

## 5. Programmatic Navigation Patterns

### Redirect After Form Submission

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreatePostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const post = await response.json();
      
      // Navigate to new post
      router.push(\`/blog/\${post.slug}\`);
      
      // Or replace history entry
      // router.replace(\`/blog/\${post.slug}\`);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
\`\`\`

### Conditional Navigation

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage({ user }: { user: User | null }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return <Dashboard user={user} />;
}
\`\`\`

### Navigation with Loading States

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function NavigationWithLoading() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(null);

  const handleNavigation = async (href: string) => {
    startTransition(async () => {
      // Fetch data before navigation
      const response = await fetch(\`/api/data?page=\${href}\`);
      const newData = await response.json();
      setData(newData);
      
      // Navigate after data is ready
      router.push(href);
    });
  };

  return (
    <div>
      <button 
        onClick={() => handleNavigation('/page-1')}
        disabled={isPending}
      >
        {isPending ? 'Loading...' : 'Go to Page 1'}
      </button>
    </div>
  );
}
\`\`\`

## 6. Advanced Link Features

### Link with Active State Detection

\`\`\`tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  exact?: boolean;
}

export function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  
  const isActive = exact 
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={
        isActive 
          ? 'text-blue-600 font-semibold border-b-2 border-blue-600' 
          : 'text-gray-600 hover:text-gray-900'
      }
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

// Usage
export default function Navigation() {
  return (
    <nav>
      <NavLink href="/" exact>Home</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/about">About</NavLink>
    </nav>
  );
}
\`\`\`

### External Links

\`\`\`tsx
import Link from 'next/link';

export default function ExternalLinks() {
  return (
    <div>
      {/* External link - automatically detected */}
      <Link 
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </Link>

      {/* Download link */}
      <Link 
        href="/downloads/guide.pdf"
        download
      >
        Download Guide
      </Link>

      {/* Email link */}
      <Link href="mailto:contact@example.com">
        Email Us
      </Link>

      {/* Telephone link */}
      <Link href="tel:+1234567890">
        Call Us
      </Link>
    </div>
  );
}
\`\`\`

### Link with Confirmation

\`\`\`tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function DeleteButton({ itemId }: { itemId: string }) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await fetch(\`/api/items/\${itemId}\`, { method: 'DELETE' });
      router.push('/items');
      router.refresh(); // Revalidate data
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <Link 
      href="#" 
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800"
    >
      Delete
    </Link>
  );
}
\`\`\`

## 7. Navigation Events and Loading States

### Creating a Loading Bar

\`\`\`tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // You can use a library like nprogress here
    if (loading) {
      // Start progress bar
    }

    return () => {
      handleComplete();
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50 animate-pulse"
      role="progressbar"
      aria-label="Page loading"
    />
  );
}
\`\`\`

### Optimistic UI Updates

\`\`\`tsx
'use client';

import { useOptimistic } from 'react';
import { useRouter } from 'next/navigation';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoList({ todos }: { todos: Todo[] }) {
  const router = useRouter();
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  const addTodo = async (formData: FormData) => {
    const text = formData.get('text') as string;
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    // Optimistically update UI
    addOptimisticTodo(newTodo);

    // Send to server
    await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    });

    // Refresh data
    router.refresh();
  };

  return (
    <div>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      
      <form action={addTodo}>
        <input name="text" required />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}
\`\`\`

## 8. Route Groups and Parallel Routes

### Route Groups (Organization without affecting URL)

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   └── contact/
├── (shop)/
│   ├── layout.tsx
│   ├── products/
│   └── cart/
└── (dashboard)/
    ├── layout.tsx
    └── analytics/
\`\`\`

\`\`\`tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>Marketing Header</header>
      {children}
      <footer>Marketing Footer</footer>
    </div>
  );
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Dashboard Sidebar</nav>
      {children}
    </div>
  );
}
\`\`\`

### Parallel Routes

\`\`\`
app/
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
└── layout.tsx
\`\`\`

\`\`\`tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
  analytics: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        <section>{team}</section>
        <section>{analytics}</section>
      </div>
    </div>
  );
}
\`\`\`

## 9. Intercepting Routes

Intercepting routes allow you to load a route within the current layout while keeping the context for background content.

### Modal Navigation Pattern

\`\`\`
app/
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx
\`\`\`

\`\`\`tsx
// app/@modal/(.)photo/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PhotoModal({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center"
      onClick={() => router.back()}
    >
      <div 
        className="relative max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => router.back()}
          className="absolute top-2 right-2 text-white"
        >
          ✕ Close
        </button>
        <Image 
          src={\`/photos/\${params.id}.jpg\`}
          alt="Photo"
          width={800}
          height={600}
        />
      </div>
    </div>
  );
}
\`\`\`

## 10. Navigation Performance Optimization

### Smart Prefetching Strategy

\`\`\`tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SmartPrefetch() {
  const [shouldPrefetch, setShouldPrefetch] = useState(false);

  useEffect(() => {
    // Only prefetch on good connections
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      setShouldPrefetch(
        conn.effectiveType === '4g' && !conn.saveData
      );
    }
  }, []);

  return (
    <Link 
      href="/heavy-page"
      prefetch={shouldPrefetch}
    >
      Load Heavy Content
    </Link>
  );
}
\`\`\`

### Route Segment Config

\`\`\`tsx
// app/dashboard/page.tsx

// Disable caching for this route
export const dynamic = 'force-dynamic';

// Set revalidation time
export const revalidate = 60; // Revalidate every 60 seconds

// Runtime edge or nodejs
export const runtime = 'edge';

export default function Dashboard() {
  return <div>Dashboard</div>;
}
\`\`\`

### Partial Prerendering (Experimental)

\`\`\`tsx
// next.config.js
module.exports = {
  experimental: {
    ppr: true, // Partial Prerendering
  },
};

// app/page.tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      {/* Static content - prerendered */}
      <header>Welcome to our site</header>
      
      {/* Dynamic content - streamed */}
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent />
      </Suspense>
    </div>
  );
}
\`\`\`

## 11. SEO and Accessibility Considerations

### Accessible Navigation

\`\`\`tsx
import Link from 'next/link';

export default function AccessibleNav() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li>
          <Link href="/" aria-current="page">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact">
            Contact
          </Link>
        </li>
      </ul>
      
      {/* Skip link for keyboard users */}
      <Link 
        href="#main-content"
        className="sr-only focus:not-sr-only"
      >
        Skip to main content
      </Link>
    </nav>
  );
}
\`\`\`

### SEO-Friendly Navigation

\`\`\`tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://example.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
}
\`\`\`

## 12. Real-World Examples

### E-commerce Product Navigation

\`\`\`tsx
'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

export default function ProductList({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'name';

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const filteredProducts = products
    .filter(p => currentCategory === 'all' || p.category === currentCategory)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'electronics', 'clothing', 'books'].map((cat) => (
          <Link
            key={cat}
            href={\`\${pathname}?\${createQueryString('category', cat)}\`}
            className={
              currentCategory === cat 
                ? 'bg-blue-600 text-white px-4 py-2 rounded'
                : 'bg-gray-200 px-4 py-2 rounded'
            }
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Link>
        ))}
      </div>

      {/* Sort Options */}
      <select
        value={sortBy}
        onChange={(e) => {
          router.push(
            \`\${pathname}?\${createQueryString('sort', e.target.value)}\`
          );
        }}
        className="mb-4 px-4 py-2 border rounded"
      >
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={\`/products/\${product.id}\`}
            className="border rounded p-4 hover:shadow-lg transition"
          >
            <h3>{product.name}</h3>
            <p>\${product.price}</p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {currentPage > 1 && (
          <Link
            href={\`\${pathname}?\${createQueryString('page', String(currentPage - 1))}\`}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            ← Previous
          </Link>
        )}
        <Link
          href={\`\${pathname}?\${createQueryString('page', String(currentPage + 1))}\`}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next →
        </Link>
      </div>
    </div>
  );
}
\`\`\`

### Multi-step Form with Navigation

\`\`\`tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MultiStepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get('step')) || 1;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    payment: '',
  });

  const goToStep = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', String(step));
    router.push(\`?\${params.toString()}\`, { scroll: false });
  };

  const handleSubmit = async () => {
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    router.push('/success');
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={
              step <= currentStep
                ? 'w-1/4 h-2 bg-blue-600 rounded'
                : 'w-1/4 h-2 bg-gray-200 rounded'
            }
          />
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div>
          <h2>Step 1: Personal Info</h2>
          <input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Name"
          />
          <button onClick={() => goToStep(2)}>Next →</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Step 2: Contact Info</h2>
          <input
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Email"
          />
          <button onClick={() => goToStep(1)}>← Back</button>
          <button onClick={() => goToStep(3)}>Next →</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Step 3: Address</h2>
          <input
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Address"
          />
          <button onClick={() => goToStep(2)}>← Back</button>
          <button onClick={() => goToStep(4)}>Next →</button>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <h2>Step 4: Payment</h2>
          <input
            value={formData.payment}
            onChange={(e) => setFormData({...formData, payment: e.target.value})}
            placeholder="Payment Info"
          />
          <button onClick={() => goToStep(3)}>← Back</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}
\`\`\`

## 13. Best Practices and Common Pitfalls

### ✅ Best Practices

1. **Always use Link for internal navigation**
   \`\`\`tsx
   // ✅ Good
   <Link href="/about">About</Link>
   
   // ❌ Bad (causes full page reload)
   <a href="/about">About</a>
   \`\`\`

2. **Prefetch strategically**
   \`\`\`tsx
   // ✅ Good - disable for rarely visited pages
   <Link href="/admin" prefetch={false}>
     Admin Panel
   </Link>
   \`\`\`

3. **Handle loading states**
   \`\`\`tsx
   // ✅ Good
   const [isPending, startTransition] = useTransition();
   
   const navigate = () => {
     startTransition(() => {
       router.push('/dashboard');
     });
   };
   \`\`\`

4. **Use proper error boundaries**
   \`\`\`tsx
   // app/error.tsx
   'use client';
   
   export default function Error({
     error,
     reset,
   }: {
     error: Error;
     reset: () => void;
   }) {
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={() => reset()}>Try again</button>
       </div>
     );
   }
   \`\`\`

5. **Implement proper 404 pages**
   \`\`\`tsx
   // app/not-found.tsx
   import Link from 'next/link';
   
   export default function NotFound() {
     return (
       <div>
         <h2>Page Not Found</h2>
         <Link href="/">Return Home</Link>
       </div>
     );
   }
   \`\`\`

### ❌ Common Pitfalls to Avoid

1. **Using anchor tags for internal navigation**
   \`\`\`tsx
   // ❌ Wrong - causes full page reload
   <a href="/about">About</a>
   
   // ✅ Correct
   <Link href="/about">About</Link>
   \`\`\`

2. **Not handling query parameters properly**
   \`\`\`tsx
   // ❌ Wrong - loses other query params
   router.push('/products?category=electronics');
   
   // ✅ Correct - preserves other params
   const params = new URLSearchParams(searchParams);
   params.set('category', 'electronics');
   router.push(\`/products?\${params.toString()}\`);
   \`\`\`

3. **Excessive prefetching**
   \`\`\`tsx
   // ❌ Wrong - prefetches everything
   {heavyPages.map(page => (
     <Link href={page.url}>{page.title}</Link>
   ))}
   
   // ✅ Correct - selective prefetching
   {heavyPages.map(page => (
     <Link href={page.url} prefetch={page.priority === 'high'}>
       {page.title}
     </Link>
   ))}
   \`\`\`

4. **Using useRouter in Server Components**
   \`\`\`tsx
   // ❌ Wrong - Server Component
   import { useRouter } from 'next/navigation';
   
   export default function Page() {
     const router = useRouter(); // Error!
   }
   
   // ✅ Correct - Client Component
   'use client';
   import { useRouter } from 'next/navigation';
   
   export default function Page() {
     const router = useRouter();
   }
   \`\`\`

5. **Not handling back button properly**
   \`\`\`tsx
   // ❌ Wrong - replaces history unnecessarily
   router.replace('/dashboard');
   
   // ✅ Correct - allows back navigation
   router.push('/dashboard');
   \`\`\`

### Performance Checklist

- [ ] Use \`<Link>\` for all internal navigation
- [ ] Disable prefetch for rarely visited pages
- [ ] Implement loading.tsx for route segments
- [ ] Use Suspense boundaries strategically
- [ ] Handle navigation errors gracefully
- [ ] Optimize images in linked pages
- [ ] Use route groups for better organization
- [ ] Implement proper caching strategies
- [ ] Test navigation on slow connections
- [ ] Monitor Core Web Vitals

## Conclusion

Navigation in Next.js is powerful and flexible, offering developers the tools to create fast, SEO-friendly applications with excellent user experience. Key takeaways:

- **Use Link component** for instant client-side navigation
- **Leverage prefetching** to make navigation feel instant
- **Use navigation hooks** (useRouter, usePathname, useSearchParams) for programmatic control
- **Implement loading states** to keep users informed
- **Optimize strategically** based on your application's needs
- **Follow accessibility best practices** for inclusive navigation

By mastering these navigation patterns, you'll build Next.js applications that are fast, maintainable, and provide exceptional user experiences.

### Additional Resources

- [Next.js Documentation - Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Next.js Documentation - Linking and Navigating](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
- [Web.dev - Navigation Performance](https://web.dev/navigation/)

Happy navigating! 🚀
    `,
    author: "Merajul Haque",
    date: "2026-02-19",
    tags: ["Next.js", "React", "Navigation", "Web Development", "App Router", "Performance"],
    readTime: 18,
    featured: true,
  },
  {
    id: "8",
    title: "Layouts in Next.js (Root Layout, Nested Layouts Explained)",
    slug: "layouts-in-nextjs-root-layout-nested-layouts-explained",
    excerpt:
      "Master the power of layouts in Next.js App Router. Learn how Root Layouts work, implement nested layouts for complex UIs, share data between layouts, and build reusable layout patterns that scale with your application.",
    content: `
# Layouts in Next.js (Root Layout, Nested Layouts Explained)

Layouts are one of the most powerful features in Next.js App Router, fundamentally changing how we structure applications. They enable you to share UI between routes, preserve state during navigation, and create consistent user experiences across your application. In this comprehensive guide, we'll dive deep into layouts, from basics to advanced patterns used in production applications.

## Table of Contents

1. Understanding Layouts in App Router
2. Root Layout Fundamentals
3. Creating Nested Layouts
4. Layout Composition Patterns
5. Data Fetching in Layouts
6. Metadata and SEO in Layouts
7. Templates vs Layouts
8. Layout Groups and Organization
9. Streaming and Suspense in Layouts
10. Advanced Layout Patterns
11. Performance Optimization
12. Real-World Examples
13. Best Practices and Common Pitfalls

## 1. Understanding Layouts in App Router

### What Are Layouts?

Layouts are shared UI components that wrap around page content. Unlike traditional React patterns where you might repeat header and footer code, Next.js layouts allow you to define shared UI once and reuse it across multiple routes.

**Key Characteristics:**

- **Persistent** - Don't re-render on navigation between routes
- **Nested** - Can be composed to create complex UI hierarchies
- **Server Components** - By default, reducing client-side JavaScript
- **State Preserving** - Maintain state across route changes

### Why Layouts Matter

\`\`\`tsx
// ❌ Without Layouts (Repetitive)
// app/blog/page.tsx
export default function BlogPage() {
  return (
    <>
      <Header />
      <Sidebar />
      <main>{/* Blog content */}</main>
      <Footer />
    </>
  );
}

// app/about/page.tsx
export default function AboutPage() {
  return (
    <>
      <Header />
      <Sidebar />
      <main>{/* About content */}</main>
      <Footer />
    </>
  );
}

// ✅ With Layouts (DRY)
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <Sidebar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/blog/page.tsx
export default function BlogPage() {
  return <div>{/* Just blog content */}</div>;
}
\`\`\`

### Layout Hierarchy

Layouts follow the folder structure, creating a nested hierarchy:

\`\`\`
app/
├── layout.tsx           # Root layout (wraps entire app)
├── page.tsx             # Home page
├── dashboard/
│   ├── layout.tsx       # Dashboard layout (wraps all dashboard pages)
│   ├── page.tsx         # /dashboard
│   └── analytics/
│       ├── layout.tsx   # Analytics layout (wraps analytics pages)
│       └── page.tsx     # /dashboard/analytics
\`\`\`

**Rendering Order:**
\`\`\`
app/layout.tsx
  └─ dashboard/layout.tsx
      └─ analytics/layout.tsx
          └─ analytics/page.tsx
\`\`\`

## 2. Root Layout Fundamentals

The Root Layout is **required** and must be defined at the top level of the \`app\` directory.

### Basic Root Layout Structure

\`\`\`tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
\`\`\`

### Root Layout Requirements

**Must Include:**
1. \`<html>\` tag - Define document language and direction
2. \`<body>\` tag - Contain all page content
3. \`children\` prop - Render nested layouts and pages

**Cannot Use:**
- \`<head>\` tag - Use Metadata API instead
- \`<title>\` tag - Use metadata object
- Manual \`<script>\` tags - Use next/script component

### Enhanced Root Layout Example

\`\`\`tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'My Next.js App',
    template: '%s | My Next.js App',
  },
  description: 'A modern web application built with Next.js',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    siteName: 'My Next.js App',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
\`\`\`

### Root Layout Best Practices

1. **Keep It Lean** - Only include truly global components
2. **Use Server Components** - Root layout is a server component by default
3. **Optimize Fonts** - Use \`next/font\` for automatic optimization
4. **Centralize Providers** - Theme, auth, and state providers go here
5. **Global Styles** - Import global CSS files in root layout

## 3. Creating Nested Layouts

Nested layouts are the secret sauce for building scalable applications with distinct sections.

### Basic Nested Layout

\`\`\`tsx
// app/dashboard/layout.tsx
import { DashboardNav } from '@/components/dashboard-nav';
import { UserMenu } from '@/components/user-menu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-6">
        <DashboardNav />
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1">
        <header className="border-b p-4">
          <UserMenu />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
\`\`\`

Now any page inside \`app/dashboard/\` will automatically be wrapped with this layout:

\`\`\`tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      {/* This content appears inside DashboardLayout's {children} */}
    </div>
  );
}

// app/dashboard/settings/page.tsx
export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      {/* Also wrapped by DashboardLayout */}
    </div>
  );
}
\`\`\`

### Multi-Level Nested Layouts

You can nest layouts as deeply as needed:

\`\`\`tsx
// app/dashboard/products/layout.tsx
import { ProductFilters } from '@/components/product-filters';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      {/* Products-specific sidebar */}
      <aside className="w-48">
        <ProductFilters />
      </aside>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
\`\`\`

**Rendering for** \`/dashboard/products/[id]\`:
\`\`\`
RootLayout
  └─ DashboardLayout (sidebar + header)
      └─ ProductsLayout (product filters)
          └─ ProductPage (specific product)
\`\`\`

### Conditional Layout Elements

\`\`\`tsx
// app/dashboard/layout.tsx
import { headers } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /mobile/i.test(userAgent);

  return (
    <div className="flex min-h-screen flex-col">
      {!isMobile && <DesktopNav />}
      {isMobile && <MobileNav />}
      
      <main className="flex-1">{children}</main>
    </div>
  );
}
\`\`\`

## 4. Layout Composition Patterns

### Slot-Based Layouts (Parallel Routes)

Create layouts with multiple slots for different content areas:

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main content area */}
      <div className="col-span-8">{children}</div>
      
      {/* Right sidebar with slots */}
      <aside className="col-span-4 space-y-6">
        {analytics}
        {notifications}
      </aside>
    </div>
  );
}
\`\`\`

Folder structure for slots:
\`\`\`
app/dashboard/
├── layout.tsx
├── page.tsx
├── @analytics/
│   └── page.tsx
└── @notifications/
    └── page.tsx
\`\`\`

### Component-Based Layout Composition

\`\`\`tsx
// components/layouts/sidebar-layout.tsx
export function SidebarLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      <aside className="w-64">{sidebar}</aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

// app/docs/layout.tsx
import { DocsNav } from '@/components/docs-nav';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout sidebar={<DocsNav />}>
      {children}
    </SidebarLayout>
  );
}
\`\`\`

### Layout HOC Pattern

\`\`\`tsx
// lib/with-auth-layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export function withAuthLayout(
  Component: React.ComponentType<any>,
  requiredRole?: string
) {
  return async function AuthLayout(props: any) {
    const session = await getServerSession();
    
    if (!session) {
      redirect('/login');
    }
    
    if (requiredRole && session.user.role !== requiredRole) {
      redirect('/unauthorized');
    }
    
    return (
      <div>
        <AdminHeader user={session.user} />
        <Component {...props} />
      </div>
    );
  };
}

// app/admin/layout.tsx
import { withAuthLayout } from '@/lib/with-auth-layout';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-container">{children}</div>;
}

export default withAuthLayout(AdminLayout, 'admin');
\`\`\`

## 5. Data Fetching in Layouts

Layouts can fetch data asynchronously since they're async Server Components by default.

### Fetching User Data

\`\`\`tsx
// app/dashboard/layout.tsx
import { getUserProfile } from '@/lib/api';
import { UserProfileCard } from '@/components/user-profile-card';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This runs on the server
  const user = await getUserProfile();
  
  return (
    <div className="flex">
      <aside className="w-64">
        <UserProfileCard user={user} />
        <nav>{/* Navigation */}</nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
\`\`\`

### Parallel Data Fetching

\`\`\`tsx
// app/dashboard/layout.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getNotifications() {
  const res = await fetch('https://api.example.com/notifications');
  return res.json();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch in parallel using Promise.all
  const [user, notifications] = await Promise.all([
    getUser(),
    getNotifications(),
  ]);
  
  return (
    <div className="flex">
      <aside className="w-64">
        <UserCard user={user} />
        <NotificationList notifications={notifications} />
      </aside>
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### Caching Layout Data

\`\`\`tsx
// app/dashboard/layout.tsx
async function getLayoutData() {
  const res = await fetch('https://api.example.com/layout-data', {
    // Revalidate every 1 hour
    next: { revalidate: 3600 }
  });
  return res.json();
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getLayoutData();
  
  return (
    <div>
      <Sidebar data={data} />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### Streaming Layout Data

\`\`\`tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react';

async function UserData() {
  const user = await getUserProfile();
  return <UserCard user={user} />;
}

async function NotificationData() {
  const notifications = await getNotifications();
  return <NotificationList notifications={notifications} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 space-y-4">
        <Suspense fallback={<UserSkeleton />}>
          <UserData />
        </Suspense>
        
        <Suspense fallback={<NotificationSkeleton />}>
          <NotificationData />
        </Suspense>
      </aside>
      
      <main>{children}</main>
    </div>
  );
}
\`\`\`

## 6. Metadata and SEO in Layouts

Layouts can export metadata that's inherited by all child routes.

### Static Metadata

\`\`\`tsx
// app/blog/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My Blog',
    default: 'My Blog',
  },
  description: 'A blog about web development',
  openGraph: {
    type: 'website',
    siteName: 'My Blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="blog-container">{children}</div>;
}
\`\`\`

### Dynamic Metadata

\`\`\`tsx
// app/dashboard/[workspace]/layout.tsx
import type { Metadata } from 'next';

type Props = {
  params: { workspace: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const workspace = await getWorkspace(params.workspace);
  
  return {
    title: workspace.name,
    description: workspace.description,
    openGraph: {
      images: [workspace.image],
    },
  };
}

export default function WorkspaceLayout({ children }: Props) {
  return <div className="workspace">{children}</div>;
}
\`\`\`

### Metadata Inheritance

\`\`\`tsx
// app/layout.tsx
export const metadata = {
  title: 'My App',
  description: 'Base description',
};

// app/blog/layout.tsx
export const metadata = {
  title: {
    template: '%s | Blog',
    default: 'Blog',
  },
  // Inherits description from root
};

// app/blog/[slug]/page.tsx
export const metadata = {
  title: 'My Post', // Becomes "My Post | Blog"
  // Inherits other fields from parent layouts
};
\`\`\`

## 7. Templates vs Layouts

Templates are similar to layouts but **re-render** on every navigation.

### When to Use Templates

\`\`\`tsx
// app/dashboard/template.tsx
'use client';

import { useEffect } from 'react';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // This runs on EVERY navigation
    console.log('Template mounted');
    
    return () => {
      console.log('Template unmounted');
    };
  }, []);
  
  return <div className="animate-fade-in">{children}</div>;
}
\`\`\`

### Layout vs Template Comparison

| Feature | Layout | Template |
|---------|--------|----------|
| Re-renders on navigation | ❌ No | ✅ Yes |
| Preserves state | ✅ Yes | ❌ No |
| Can be async | ✅ Yes | ✅ Yes |
| Performance | ⚡ Better | 🐌 More re-renders |
| Use for | Persistent UI | Animations, resets |

### Combined Usage

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* This persists across navigation */}
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/template.tsx
'use client';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-slide-in">
      {/* This animates on every page change */}
      {children}
    </div>
  );
}
\`\`\`

## 8. Layout Groups and Organization

Route groups let you organize routes without affecting the URL structure.

### Basic Route Groups

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx       # Marketing layout
│   ├── page.tsx         # / (home)
│   ├── about/
│   │   └── page.tsx     # /about
│   └── pricing/
│       └── page.tsx     # /pricing
├── (shop)/
│   ├── layout.tsx       # Shop layout
│   ├── products/
│   │   └── page.tsx     # /products
│   └── cart/
│       └── page.tsx     # /cart
└── (dashboard)/
    ├── layout.tsx       # Dashboard layout
    └── settings/
        └── page.tsx     # /settings
\`\`\`

**Note:** Group names like \`(marketing)\` don't appear in URLs.

### Multiple Root Layouts

You can have multiple root layouts using route groups:

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx       # Marketing root layout
│   └── page.tsx
└── (app)/
    ├── layout.tsx       # App root layout
    └── dashboard/
        └── page.tsx
\`\`\`

\`\`\`tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="marketing-theme">
        <MarketingHeader />
        {children}
        <MarketingFooter />
      </body>
    </html>
  );
}

// app/(app)/layout.tsx
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-theme">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
\`\`\`

### Organizational Route Groups

\`\`\`
app/
└── dashboard/
    ├── layout.tsx
    ├── (overview)/
    │   ├── page.tsx           # /dashboard
    │   └── stats/
    │       └── page.tsx       # /dashboard/stats
    └── (management)/
        ├── users/
        │   └── page.tsx       # /dashboard/users
        └── settings/
            └── page.tsx       # /dashboard/settings
\`\`\`

## 9. Streaming and Suspense in Layouts

Use Suspense boundaries in layouts for progressive rendering.

### Layout-Level Loading States

\`\`\`tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react';

async function DashboardSidebar() {
  const navigation = await getNavigationItems();
  return <Sidebar items={navigation} />;
}

async function UserProfile() {
  const user = await getCurrentUser();
  return <ProfileCard user={user} />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Suspense fallback={<SidebarSkeleton />}>
        <DashboardSidebar />
      </Suspense>
      
      <div className="flex flex-1 flex-col">
        <header className="border-b p-4">
          <Suspense fallback={<ProfileSkeleton />}>
            <UserProfile />
          </Suspense>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
\`\`\`

### Granular Streaming

\`\`\`tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Each component streams independently */}
      <aside className="col-span-3 space-y-4">
        <Suspense fallback={<div>Loading user...</div>}>
          <UserCard />
        </Suspense>
        
        <Suspense fallback={<div>Loading nav...</div>}>
          <Navigation />
        </Suspense>
        
        <Suspense fallback={<div>Loading stats...</div>}>
          <QuickStats />
        </Suspense>
      </aside>
      
      <main className="col-span-9">
        {children}
      </main>
    </div>
  );
}
\`\`\`

## 10. Advanced Layout Patterns

### Authentication-Protected Layouts

\`\`\`tsx
// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div>
      <DashboardHeader user={session.user} />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### Multi-Tenant Layouts

\`\`\`tsx
// app/[tenant]/layout.tsx
import { notFound } from 'next/navigation';

type Props = {
  params: { tenant: string };
  children: React.ReactNode;
};

async function getTenantConfig(tenant: string) {
  const res = await fetch(\`https://api.example.com/tenants/\${tenant}\`);
  if (!res.ok) return null;
  return res.json();
}

export default async function TenantLayout({ params, children }: Props) {
  const config = await getTenantConfig(params.tenant);
  
  if (!config) {
    notFound();
  }
  
  return (
    <div style={{ '--primary-color': config.primaryColor } as any}>
      <header className="tenant-header">
        <img src={config.logo} alt={config.name} />
      </header>
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### Responsive Layout Switching

\`\`\`tsx
// app/dashboard/layout.tsx
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MobileLayout } from '@/components/mobile-layout';
import { DesktopLayout } from '@/components/desktop-layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  if (isDesktop) {
    return <DesktopLayout>{children}</DesktopLayout>;
  }
  
  return <MobileLayout>{children}</MobileLayout>;
}
\`\`\`

### Layout with Global State

\`\`\`tsx
// app/layout.tsx
import { Providers } from '@/components/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// components/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
\`\`\`

## 11. Performance Optimization

### Lazy Loading Layout Components

\`\`\`tsx
// app/dashboard/layout.tsx
import dynamic from 'next/dynamic';

// Only load heavy components when needed
const AnalyticsDashboard = dynamic(
  () => import('@/components/analytics-dashboard'),
  {
    loading: () => <AnalyticsSkeleton />,
    ssr: false, // Skip SSR for client-only components
  }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64">
        <Navigation />
        <AnalyticsDashboard />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
\`\`\`

### Memoizing Layout Data

\`\`\`tsx
// lib/get-navigation.ts
import { cache } from 'react';

export const getNavigation = cache(async () => {
  const res = await fetch('https://api.example.com/navigation');
  return res.json();
});

// app/dashboard/layout.tsx
import { getNavigation } from '@/lib/get-navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will be deduped if called multiple times
  const navigation = await getNavigation();
  
  return (
    <div>
      <Sidebar navigation={navigation} />
      <main>{children}</main>
    </div>
  );
}
\`\`\`

### Static Layout Components

\`\`\`tsx
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

// Mark as const to optimize
const navigation = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/settings', label: 'Settings' },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar navigation={navigation} />
      <div className="flex-1">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
\`\`\`

## 12. Real-World Examples

### E-Commerce Layout

\`\`\`tsx
// app/(shop)/layout.tsx
import { Suspense } from 'react';
import { ShoppingCart } from '@/components/shopping-cart';
import { SearchBar } from '@/components/search-bar';
import { CategoryNav } from '@/components/category-nav';

async function CartData() {
  const cart = await getCart();
  return <ShoppingCart items={cart.items} />;
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Logo />
          <SearchBar />
          <Suspense fallback={<CartSkeleton />}>
            <CartData />
          </Suspense>
        </div>
        <CategoryNav />
      </header>
      
      <main className="container mx-auto py-8">
        {children}
      </main>
      
      <footer className="border-t bg-gray-50">
        <ShopFooter />
      </footer>
    </div>
  );
}
\`\`\`

### Documentation Site Layout

\`\`\`tsx
// app/docs/layout.tsx
import { DocsNav } from '@/components/docs-nav';
import { DocSearch } from '@/components/doc-search';
import { TableOfContents } from '@/components/table-of-contents';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Navigation */}
      <aside className="w-64 border-r p-6">
        <DocSearch />
        <DocsNav />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-12">
        <article className="prose prose-lg max-w-4xl">
          {children}
        </article>
      </main>
      
      {/* Right Sidebar - TOC */}
      <aside className="w-64 border-l p-6">
        <TableOfContents />
      </aside>
    </div>
  );
}
\`\`\`

### Admin Dashboard Layout

\`\`\`tsx
// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminHeader } from '@/components/admin-header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Collapsible Sidebar */}
      <AdminSidebar user={session.user} />
      
      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
\`\`\`

### Blog with Sidebar Layout

\`\`\`tsx
// app/blog/layout.tsx
import { Suspense } from 'react';
import { PopularPosts } from '@/components/popular-posts';
import { Categories } from '@/components/categories';
import { Newsletter } from '@/components/newsletter';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Main Content */}
        <main className="lg:col-span-8">{children}</main>
        
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <Suspense fallback={<div>Loading...</div>}>
            <PopularPosts />
          </Suspense>
          
          <Categories />
          <Newsletter />
        </aside>
      </div>
    </div>
  );
}
\`\`\`

## 13. Best Practices and Common Pitfalls

### Best Practices

**1. Keep Layouts Focused**
\`\`\`tsx
// ✅ Good - Single responsibility
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// ❌ Bad - Too much logic
export default async function DashboardLayout({ children }) {
  const user = await getUser();
  const permissions = await getPermissions(user.id);
  const notifications = await getNotifications(user.id);
  const settings = await getSettings(user.id);
  const analytics = await getAnalytics(user.id);
  // Too much!
}
\`\`\`

**2. Use Server Components by Default**
\`\`\`tsx
// ✅ Good - Server component fetches data
export default async function Layout({ children }) {
  const data = await getData();
  return <div>{/* Use data */}{children}</div>;
}

// ❌ Bad - Unnecessary client component
'use client';
export default function Layout({ children }) {
  // No interactivity needed - why client component?
  return <div>{children}</div>;
}
\`\`\`

**3. Strategic Data Fetching**
\`\`\`tsx
// ✅ Good - Fetch only layout-level data
export default async function Layout({ children }) {
  const navigation = await getNavigation();
  return <Sidebar navigation={navigation} />;
}

// ❌ Bad - Fetching page-specific data in layout
export default async function Layout({ children }) {
  const posts = await getAllPosts(); // This should be in page!
  return <div>{children}</div>;
}
\`\`\`

**4. Optimize Suspense Boundaries**
\`\`\`tsx
// ✅ Good - Granular suspense boundaries
export default function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={<NavSkeleton />}>
        <Navigation />
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}

// ❌ Bad - Single boundary blocks everything
export default function Layout({ children }) {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Navigation />
      <Sidebar />
      <main>{children}</main>
    </Suspense>
  );
}
\`\`\`

**5. Proper Error Boundaries**
\`\`\`tsx
// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
\`\`\`

### Common Pitfalls

**1. Client Component in Root Layout**
\`\`\`tsx
// ❌ Bad - Makes entire app client-side
'use client';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light');
  return <html>{children}</html>;
}

// ✅ Good - Use provider pattern
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
\`\`\`

**2. Forgetting Route Groups**
\`\`\`
// ❌ Bad - URLs include layout folders
app/
├── marketing-layout/
│   └── about/
│       └── page.tsx    # URL: /marketing-layout/about

// ✅ Good - Use route groups
app/
├── (marketing)/
│   └── about/
│       └── page.tsx    # URL: /about
\`\`\`

**3. Breaking HTML Hierarchy**
\`\`\`tsx
// ❌ Bad - Multiple <html> or <body> tags
export default function DashboardLayout({ children }) {
  return (
    <html> {/* Don't do this in nested layouts! */}
      <body>{children}</body>
    </html>
  );
}

// ✅ Good - Only <html> and <body> in root layout
export default function DashboardLayout({ children }) {
  return <div className="dashboard">{children}</div>;
}
\`\`\`

**4. Over-Fetching in Layouts**
\`\`\`tsx
// ❌ Bad - Fetching page data in layout
export default async function BlogLayout({ children }) {
  const posts = await getAllPosts(); // Runs on every blog page
  const post = await getCurrentPost(); // Not available here!
}

// ✅ Good - Fetch only shared data
export default async function BlogLayout({ children }) {
  const categories = await getCategories(); // Shared across blog
  return <SidebarWithCategories categories={categories} />;
}
\`\`\`

**5. Not Using Parallel Routes**
\`\`\`tsx
// ❌ Bad - Sequential loading
export default async function Layout({ children }) {
  const data1 = await fetchData1();
  const data2 = await fetchData2(); // Waits for data1
  // Components render after both complete
}

// ✅ Good - Parallel loading with Suspense
export default function Layout({ children }) {
  return (
    <>
      <Suspense fallback={<Skeleton1 />}>
        <Component1 />
      </Suspense>
      <Suspense fallback={<Skeleton2 />}>
        <Component2 />
      </Suspense>
    </>
  );
}
\`\`\`

## Conclusion

Layouts are one of the most powerful features in Next.js App Router, enabling you to build scalable, performant applications with consistent user experiences. By mastering root layouts, nested layouts, and advanced patterns, you can create sophisticated application structures that are both maintainable and performant.

### Key Takeaways

- **Root Layout** is required and wraps your entire application
- **Nested Layouts** enable section-specific UI without repetition
- **Layouts persist** across navigation, preserving state
- **Server Components** by default improve performance
- **Suspense** enables progressive rendering
- **Route Groups** organize code without affecting URLs
- **Templates** re-render when layouts shouldn't

### Next Steps

Now that you understand layouts, explore:
- **Loading UI** - Create skeleton screens with loading.tsx
- **Error Handling** - Graceful error states with error.tsx
- **Parallel Routes** - Multiple simultaneous views with slots
- **Intercepting Routes** - Modal-like experiences
- **Middleware** - Authentication and redirects
- **Server Actions** - Data mutations with forms

The Next.js App Router is constantly evolving. Stay updated with the [official documentation](https://nextjs.org/docs) and experiment with these patterns in your projects.

Master layouts, and you'll master Next.js! 🚀
    `,
    author: "Merajul Haque",
    date: "2026-02-18",
    tags: ["Next.js", "React", "App Router", "Layouts", "Web Development", "TypeScript"],
    readTime: 22,
  },
  {
    id: "7",
    title: "Routing in Next.js App Router (Pages & Navigation Basics)",
    slug: "routing-in-nextjs-app-router-pages-navigation-basics",
    excerpt:
      "Master the fundamentals of routing in Next.js App Router. Learn about file-based routing, dynamic routes, layouts, navigation components, and modern routing patterns that make Next.js the most powerful React framework in 2026.",
    content: `
# Routing in Next.js App Router (Pages & Navigation Basics)

Routing is the backbone of any web application, and Next.js has revolutionized how we think about routing with its file-based system. With the App Router (stable since Next.js 13+), routing has become more powerful, intuitive, and feature-rich. In this comprehensive guide, we'll explore everything you need to know about routing and navigation in Next.js.

## Table of Contents

1. Introduction to App Router
2. File-Based Routing Fundamentals
3. Creating Pages
4. Dynamic Routes
5. Route Groups and Organization
6. Navigation Methods
7. Layouts and Nested Routes
8. Loading and Error States
9. Parallel and Intercepting Routes
10. Route Handlers (API Routes)
11. Best Practices and Tips

## 1. Introduction to App Router

The App Router, introduced in Next.js 13 and now the default in Next.js 15, represents a paradigm shift in how we build Next.js applications. It's built on React Server Components and provides several advantages:

### Why App Router?

**Server-First Architecture**
- Built on React Server Components by default
- Automatic code splitting at the route level
- Better initial page load performance
- Reduced JavaScript bundle size

**Enhanced Developer Experience**
- Intuitive file-based routing
- Colocation of data fetching with components
- Built-in loading and error handling
- Nested layouts that preserve state

**Modern Features**
- Streaming and Suspense support
- Parallel and intercepting routes
- Route groups for organization
- Better TypeScript support

### App Router vs Pages Router

While the Pages Router (\`pages/\` directory) is still fully supported, the App Router offers significant improvements:

\`\`\`
Pages Router (Legacy)          →    App Router (Modern)
────────────────────────────────────────────────────────
pages/index.js                 →    app/page.tsx
pages/about.js                 →    app/about/page.tsx
pages/api/users.js             →    app/api/users/route.ts
pages/_app.js                  →    app/layout.tsx
pages/_document.js             →    app/layout.tsx
getServerSideProps             →    async components
getStaticProps                 →    fetch with cache
\`\`\`

## 2. File-Based Routing Fundamentals

Next.js uses a file-system based router where **folders define routes** and **special files define UI**.

### File Conventions

Next.js has specific files that serve special purposes:

\`\`\`
app/
├── layout.tsx        # Root layout (required)
├── page.tsx          # Home page route
├── loading.tsx       # Loading UI
├── error.tsx         # Error UI
├── not-found.tsx     # 404 page
├── template.tsx      # Re-rendered layout
└── route.ts          # API endpoint
\`\`\`

### Key Concepts

**Folders = Routes**
- Each folder represents a route segment
- Folder hierarchy maps to URL structure
- Use special file names to create UI

**Only page.tsx Creates Routes**
- Folders alone don't create accessible routes
- You need \`page.tsx\` to make a route publicly accessible
- This allows colocation of components and utilities

## 3. Creating Pages

Pages are the most fundamental routing component in Next.js.

### Basic Page Structure

\`\`\`tsx
// app/page.tsx - Home page (/)
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to My Next.js App</h1>
      <p>This is the home page rendered at "/"</p>
    </main>
  );
}
\`\`\`

### Creating Multiple Pages

\`\`\`
app/
├── page.tsx              # /
├── about/
│   └── page.tsx          # /about
├── blog/
│   └── page.tsx          # /blog
└── contact/
    └── page.tsx          # /contact
\`\`\`

### Server Components by Default

Pages in the App Router are React Server Components by default:

\`\`\`tsx
// app/blog/page.tsx - Server Component
async function getBlogPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // SSG-like behavior
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

### Client Components

When you need interactivity, use the \`'use client'\` directive:

\`\`\`tsx
// app/counter/page.tsx - Client Component
'use client';

import { useState } from 'react';

export default function CounterPage() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## 4. Dynamic Routes

Dynamic routes allow you to create pages with variable URL segments.

### Single Dynamic Segment

Use square brackets \`[param]\` to create a dynamic route:

\`\`\`
app/
└── blog/
    └── [slug]/
        └── page.tsx      # /blog/:slug
\`\`\`

\`\`\`tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BlogPost({ params }: PageProps) {
  return (
    <article>
      <h1>Blog Post: {params.slug}</h1>
      <p>This page handles /blog/{params.slug}</p>
    </article>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
\`\`\`

### Multiple Dynamic Segments

\`\`\`
app/
└── shop/
    └── [category]/
        └── [product]/
            └── page.tsx  # /shop/:category/:product
\`\`\`

\`\`\`tsx
// app/shop/[category]/[product]/page.tsx
interface PageProps {
  params: { category: string; product: string };
}

export default function ProductPage({ params }: PageProps) {
  return (
    <div>
      <h1>Category: {params.category}</h1>
      <h2>Product: {params.product}</h2>
    </div>
  );
}
\`\`\`

### Catch-All Routes

Use \`[...param]\` to catch all subsequent segments:

\`\`\`
app/
└── docs/
    └── [...slug]/
        └── page.tsx      # /docs/a, /docs/a/b, /docs/a/b/c
\`\`\`

\`\`\`tsx
// app/docs/[...slug]/page.tsx
interface PageProps {
  params: { slug: string[] };
}

export default function DocsPage({ params }: PageProps) {
  return (
    <div>
      <h1>Documentation</h1>
      <p>Path segments: {params.slug.join(' / ')}</p>
    </div>
  );
}
\`\`\`

### Optional Catch-All Routes

Use \`[[...param]]\` to make the catch-all optional:

\`\`\`
app/
└── shop/
    └── [[...categories]]/
        └── page.tsx      # /shop, /shop/clothing, /shop/clothing/shirts
\`\`\`

## 5. Route Groups and Organization

Route groups allow you to organize routes without affecting the URL structure.

### Creating Route Groups

Use parentheses \`(folder)\` to create a route group:

\`\`\`
app/
├── (marketing)/
│   ├── layout.tsx        # Layout for marketing pages
│   ├── about/
│   │   └── page.tsx      # /about (not /(marketing)/about)
│   └── contact/
│       └── page.tsx      # /contact
└── (shop)/
    ├── layout.tsx        # Layout for shop pages
    ├── products/
    │   └── page.tsx      # /products
    └── cart/
        └── page.tsx      # /cart
\`\`\`

### Benefits of Route Groups

**1. Organize Without Affecting URLs**
\`\`\`tsx
// app/(marketing)/about/page.tsx
// URL: /about (not /(marketing)/about)
\`\`\`

**2. Multiple Layouts**
\`\`\`tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <div className="marketing-layout">
      <nav>{/* Marketing navigation */}</nav>
      {children}
    </div>
  );
}

// app/(shop)/layout.tsx
export default function ShopLayout({ children }) {
  return (
    <div className="shop-layout">
      <nav>{/* Shop navigation */}</nav>
      {children}
    </div>
  );
}
\`\`\`

**3. Multiple Root Layouts**

You can even have multiple root layouts:

\`\`\`
app/
├── (main)/
│   ├── layout.tsx        # Root layout for main app
│   └── page.tsx
└── (admin)/
    ├── layout.tsx        # Different root layout for admin
    └── page.tsx
\`\`\`

## 6. Navigation Methods

Next.js provides multiple ways to navigate between routes.

### Link Component (Client-Side Navigation)

The \`Link\` component is the primary way to navigate:

\`\`\`tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      {/* Basic link */}
      <Link href="/about">About</Link>
      
      {/* Dynamic route */}
      <Link href="/blog/my-post">Read Post</Link>
      
      {/* With dynamic data */}
      <Link href={\`/user/\${userId}\`}>User Profile</Link>
      
      {/* With query parameters */}
      <Link href={{
        pathname: '/search',
        query: { q: 'nextjs', filter: 'latest' }
      }}>
        Search
      </Link>
      
      {/* Prefetching disabled */}
      <Link href="/heavy-page" prefetch={false}>
        Heavy Page
      </Link>
      
      {/* Replace history */}
      <Link href="/login" replace>
        Login
      </Link>
      
      {/* Scroll to top disabled */}
      <Link href="/blog" scroll={false}>
        Blog (No Scroll)
      </Link>
    </nav>
  );
}
\`\`\`

### Link Features

**Automatic Prefetching**
- Links in viewport are prefetched automatically
- Improves perceived performance
- Can be disabled with \`prefetch={false}\`

**Active Link Styling**

\`\`\`tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  );
}
\`\`\`

### useRouter Hook (Programmatic Navigation)

For programmatic navigation, use the \`useRouter\` hook:

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform login
    const success = await login();
    
    if (success) {
      // Navigate to dashboard
      router.push('/dashboard');
      
      // Or replace current history entry
      // router.replace('/dashboard');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Login</button>
      <button type="button" onClick={() => router.back()}>
        Go Back
      </button>
    </form>
  );
}
\`\`\`

### Router Methods

\`\`\`tsx
'use client';

import { useRouter } from 'next/navigation';

export default function NavigationExample() {
  const router = useRouter();
  
  return (
    <div>
      {/* Navigate forward */}
      <button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </button>
      
      {/* Replace current route */}
      <button onClick={() => router.replace('/new-page')}>
        Replace Route
      </button>
      
      {/* Go back */}
      <button onClick={() => router.back()}>
        Back
      </button>
      
      {/* Go forward */}
      <button onClick={() => router.forward()}>
        Forward
      </button>
      
      {/* Refresh current route */}
      <button onClick={() => router.refresh()}>
        Refresh Data
      </button>
      
      {/* Prefetch a route */}
      <button onClick={() => router.prefetch('/dashboard')}>
        Prefetch Dashboard
      </button>
    </div>
  );
}
\`\`\`

### redirect() Function (Server-Side)

For server-side redirects:

\`\`\`tsx
// app/profile/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    // Server-side redirect
    redirect('/login');
  }
  
  return <div>Welcome {session.user.name}</div>;
}
\`\`\`

### permanentRedirect() Function

For permanent redirects (308 status):

\`\`\`tsx
import { permanentRedirect } from 'next/navigation';

export default async function OldPage() {
  permanentRedirect('/new-page');
}
\`\`\`

### Middleware Redirects

For global redirect logic:

\`\`\`tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
\`\`\`

## 7. Layouts and Nested Routes

Layouts provide shared UI that persists across multiple pages.

### Root Layout (Required)

Every app needs a root layout:

\`\`\`tsx
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My Next.js App',
  description: 'Built with App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav>{/* Global navigation */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* Global footer */}</footer>
      </body>
    </html>
  );
}
\`\`\`

### Nested Layouts

Layouts can be nested for section-specific UI:

\`\`\`
app/
├── layout.tsx            # Root layout
├── page.tsx              # Home page
└── dashboard/
    ├── layout.tsx        # Dashboard layout
    ├── page.tsx          # /dashboard
    ├── settings/
    │   └── page.tsx      # /dashboard/settings
    └── analytics/
        └── page.tsx      # /dashboard/analytics
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside>
        {/* Dashboard sidebar */}
        <nav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/settings">Settings</Link>
          <Link href="/dashboard/analytics">Analytics</Link>
        </nav>
      </aside>
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}
\`\`\`

### Layout Composition

Layouts compose from root to leaf:

\`\`\`
URL: /dashboard/settings

Rendered as:
<RootLayout>
  <DashboardLayout>
    <SettingsPage />
  </DashboardLayout>
</RootLayout>
\`\`\`

### Templates

Unlike layouts, templates create a new instance on navigation:

\`\`\`tsx
// app/dashboard/template.tsx
'use client';

import { motion } from 'framer-motion';

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
\`\`\`

**Layout vs Template:**
- **Layout**: Stateful, persists across navigation, doesn't re-render
- **Template**: Stateless, re-renders on navigation, useful for animations

## 8. Loading and Error States

Next.js provides built-in support for loading and error UI.

### Loading States

Create a \`loading.tsx\` file for automatic loading UI:

\`\`\`tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-content" />
      <div className="skeleton-sidebar" />
    </div>
  );
}
\`\`\`

This automatically wraps your page in Suspense:

\`\`\`tsx
// Automatic behavior
<Suspense fallback={<DashboardLoading />}>
  <DashboardPage />
</Suspense>
\`\`\`

### Manual Suspense Boundaries

For granular control:

\`\`\`tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function Analytics() {
  const data = await fetchAnalytics(); // Slow
  return <div>{/* Analytics UI */}</div>;
}

async function RecentActivity() {
  const activity = await fetchActivity(); // Fast
  return <div>{/* Activity UI */}</div>;
}

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Fast content loads first */}
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
      
      {/* Slow content streams in when ready */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics />
      </Suspense>
    </div>
  );
}
\`\`\`

### Error Boundaries

Create an \`error.tsx\` file for error handling:

\`\`\`tsx
// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Dashboard error:', error);
  }, [error]);
  
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
\`\`\`

### Global Error Handling

For root-level errors, use \`global-error.tsx\`:

\`\`\`tsx
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Application Error</h1>
        <p>{error.message}</p>
        <button onClick={reset}>Retry</button>
      </body>
    </html>
  );
}
\`\`\`

### Not Found Pages

Create custom 404 pages:

\`\`\`tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Go Home</Link>
    </div>
  );
}
\`\`\`

Programmatically trigger 404:

\`\`\`tsx
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  
  if (!post) {
    notFound(); // Shows nearest not-found.tsx
  }
  
  return <article>{/* render post */}</article>;
}
\`\`\`

## 9. Parallel and Intercepting Routes

Advanced routing patterns for complex UIs.

### Parallel Routes

Render multiple pages in the same layout simultaneously:

\`\`\`
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @notifications/
        └── page.tsx
\`\`\`

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div className="dashboard-grid">
      <div className="main">{children}</div>
      <div className="analytics">{analytics}</div>
      <div className="notifications">{notifications}</div>
    </div>
  );
}
\`\`\`

### Conditional Rendering

\`\`\`tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  const isAdmin = checkUserRole();
  
  return (
    <div>
      {children}
      {isAdmin && analytics}
      {notifications}
    </div>
  );
}
\`\`\`

### Intercepting Routes

Intercept routes to show them in a modal while preserving URL:

\`\`\`
app/
├── photos/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (.)photos/
        └── [id]/
            └── page.tsx
\`\`\`

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
\`\`\`

**Intercept Conventions:**
- \`(.)\` - match same level
- \`(..)\` - match one level up
- \`(..)(..)\` - match two levels up
- \`(...)\` - match from root

## 10. Route Handlers (API Routes)

Create API endpoints with \`route.ts\` files.

### Basic Route Handler

\`\`\`tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    received: body,
    timestamp: new Date().toISOString(),
  });
}
\`\`\`

### Dynamic Route Handlers

\`\`\`tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await getPost(params.id);
  
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await updatePost(params.id, body);
  
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deletePost(params.id);
  
  return NextResponse.json({ success: true });
}
\`\`\`

### Request and Response

\`\`\`tsx
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  
  // Get headers
  const userAgent = request.headers.get('user-agent');
  
  // Get cookies
  const token = request.cookies.get('token');
  
  const results = await search(query, parseInt(page));
  
  // Return response with custom headers
  return NextResponse.json(results, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      'X-Custom-Header': 'value',
    },
  });
}
\`\`\`

### Middleware in Route Handlers

\`\`\`tsx
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function authenticate(request: NextRequest) {
  const token = request.headers.get('authorization');
  if (!token) {
    throw new Error('Unauthorized');
  }
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    
    const data = await getProtectedData(user.id);
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
\`\`\`

## 11. Best Practices and Tips

### Performance Optimization

**1. Use Server Components by Default**
\`\`\`tsx
// ✅ Server Component (default)
async function BlogPosts() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// ✅ Client Component only when needed
'use client';
function InteractiveWidget() {
  const [state, setState] = useState();
  return <div>...</div>;
}
\`\`\`

**2. Optimize Link Prefetching**
\`\`\`tsx
// ✅ Let Next.js prefetch in viewport
<Link href="/blog">Blog</Link>

// ✅ Disable for heavy pages
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>
\`\`\`

**3. Use Loading States**
\`\`\`tsx
// ✅ Provide loading.tsx for better UX
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />;
}
\`\`\`

### Code Organization

**1. Colocation**
\`\`\`
app/
└── dashboard/
    ├── page.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── components/
    │   ├── chart.tsx
    │   └── stats.tsx
    └── utils/
        └── calculations.ts
\`\`\`

**2. Route Groups for Organization**
\`\`\`
app/
├── (auth)/
│   ├── login/
│   └── register/
└── (app)/
    ├── dashboard/
    └── settings/
\`\`\`

**3. Shared Layouts**
\`\`\`tsx
// app/(app)/layout.tsx - Shared auth layout
export default function AppLayout({ children }) {
  return (
    <AuthProvider>
      <Sidebar />
      <main>{children}</main>
    </AuthProvider>
  );
}
\`\`\`

### SEO and Metadata

**1. Static Metadata**
\`\`\`tsx
// app/blog/[slug]/page.tsx
export const metadata = {
  title: 'Blog Post',
  description: 'Read our latest blog post',
};
\`\`\`

**2. Dynamic Metadata**
\`\`\`tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
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
\`\`\`

### Error Handling

**1. Granular Error Boundaries**
\`\`\`
app/
├── error.tsx              # Root errors
└── dashboard/
    ├── error.tsx          # Dashboard errors
    └── settings/
        └── error.tsx      # Settings errors
\`\`\`

**2. Graceful Degradation**
\`\`\`tsx
export default async function Page() {
  try {
    const data = await fetchData();
    return <Content data={data} />;
  } catch (error) {
    return <FallbackUI />;
  }
}
\`\`\`

### TypeScript Best Practices

**1. Type Route Parameters**
\`\`\`tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  // Fully typed params and search params
}
\`\`\`

**2. Type Route Handlers**
\`\`\`tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // Fully typed
}
\`\`\`

### Common Patterns

**1. Protected Routes**
\`\`\`tsx
// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>{children}</div>;
}
\`\`\`

**2. Breadcrumbs Navigation**
\`\`\`tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  
  return (
    <nav>
      <Link href="/">Home</Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        return (
          <span key={href}>
            {' / '}
            <Link href={href}>{segment}</Link>
          </span>
        );
      })}
    </nav>
  );
}
\`\`\`

**3. Tab Navigation with URL State**
\`\`\`tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function TabNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const switchTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push('?' + params.toString());
  };
  
  return (
    <div>
      <button onClick={() => switchTab('overview')}>Overview</button>
      <button onClick={() => switchTab('analytics')}>Analytics</button>
      <button onClick={() => switchTab('settings')}>Settings</button>
      
      {activeTab === 'overview' && <Overview />}
      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'settings' && <Settings />}
    </div>
  );
}
\`\`\`

## Conclusion

The Next.js App Router represents the future of React development, combining powerful routing capabilities with excellent developer experience. By mastering these routing fundamentals:

- **File-based routing** makes project structure intuitive and scalable
- **Server Components** by default improves performance significantly
- **Nested layouts** enable complex UI patterns with shared state
- **Built-in loading and error states** provide better UX with minimal code
- **Advanced patterns** like parallel and intercepting routes solve complex scenarios

### Key Takeaways

1. **Start with Server Components** - Only use \`'use client'\` when necessary
2. **Leverage layouts** - Use nested layouts for shared UI and state
3. **Provide feedback** - Always include loading.tsx and error.tsx
4. **Organize with route groups** - Keep your structure clean without affecting URLs
5. **Use TypeScript** - Type safety prevents routing errors
6. **Optimize navigation** - Use Link for client-side navigation, let Next.js handle prefetching

### What's Next?

Now that you understand routing basics, explore:
- **Data Fetching** - Learn about Server Actions and data mutations
- **Caching Strategies** - Master Next.js caching behavior
- **Middleware** - Implement authentication and request handling
- **Internationalization** - Build multi-language applications
- **Deployment** - Deploy your App Router app to production

The App Router is continually evolving, with the Next.js team adding new features regularly. Stay updated with the [official documentation](https://nextjs.org/docs) and experiment with these patterns in your projects.

Happy routing! 🚀
    `,
    author: "Merajul Haque",
    date: "2026-02-17",
    // image: "",
    tags: ["Next.js", "React", "App Router", "Routing", "Navigation", "Web Development"],
    readTime: 18,
  },
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
