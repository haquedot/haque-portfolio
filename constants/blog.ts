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
    date: "2024-12-01",
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
    date: "2024-11-28",
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
    date: "2024-11-20",
    // image: "",
    tags: ["React", "Performance", "Web Development", "Optimization"],
    readTime: 9,
  },
];
