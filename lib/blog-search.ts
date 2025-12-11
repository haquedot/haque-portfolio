import { BlogPost } from '@/constants/blog';

export interface SearchResult extends BlogPost {
  relevanceScore: number;
  matchType: 'title' | 'excerpt' | 'content' | 'tag';
  highlightedText?: string;
}

export function searchBlogPosts(
  posts: BlogPost[],
  query: string,
  filters?: {
    tags?: string[];
    dateRange?: { from: Date; to: Date };
    readTimeRange?: { min: number; max: number };
  }
): SearchResult[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);

  const results: SearchResult[] = posts
    .map(post => {
      let relevanceScore = 0;
      let matchType: 'title' | 'excerpt' | 'content' | 'tag' = 'content';

      // Title match (highest priority)
      const titleLower = post.title.toLowerCase();
      if (titleLower.includes(lowerQuery)) {
        relevanceScore += 100;
        matchType = 'title';
      } else {
        queryWords.forEach(word => {
          if (titleLower.includes(word)) relevanceScore += 50;
        });
      }

      // Excerpt match
      const excerptLower = post.excerpt.toLowerCase();
      if (excerptLower.includes(lowerQuery)) {
        relevanceScore += 50;
        if (relevanceScore < 50) matchType = 'excerpt';
      } else {
        queryWords.forEach(word => {
          if (excerptLower.includes(word)) relevanceScore += 20;
        });
      }

      // Tag match
      const tagMatches = post.tags.filter(tag =>
        tag.toLowerCase().includes(lowerQuery)
      );
      if (tagMatches.length > 0) {
        relevanceScore += tagMatches.length * 30;
        if (matchType === 'content') matchType = 'tag';
      }

      // Content match (lower priority)
      const contentLower = post.content.toLowerCase();
      const contentMatches = queryWords.filter(word =>
        contentLower.includes(word)
      ).length;
      relevanceScore += contentMatches * 5;

      return {
        ...post,
        relevanceScore,
        matchType,
      };
    })
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Apply filters
  if (filters) {
    return results.filter(result => {
      // Date range filter
      if (filters.dateRange) {
        const postDate = new Date(result.date);
        if (
          postDate < filters.dateRange.from ||
          postDate > filters.dateRange.to
        ) {
          return false;
        }
      }

      // Read time range filter
      if (filters.readTimeRange) {
        if (
          result.readTime < filters.readTimeRange.min ||
          result.readTime > filters.readTimeRange.max
        ) {
          return false;
        }
      }

      // Tag filter
      if (filters.tags && filters.tags.length > 0) {
        return filters.tags.some(tag => result.tags.includes(tag));
      }

      return true;
    });
  }

  return results;
}

export function highlightSearchResults(text: string, query: string): string {
  const lowerQuery = query.toLowerCase();
  if (!lowerQuery) return text;

  const regex = new RegExp(`(${lowerQuery})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function getSearchSuggestions(
  posts: BlogPost[],
  query: string,
  limit: number = 5
): string[] {
  if (!query.trim() || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  // Add matching tags
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) {
        suggestions.add(tag);
      }
    });
  });

  // Add matching titles (if partial match)
  posts.forEach(post => {
    const words = post.title.split(/\s+/);
    words.forEach(word => {
      if (word.toLowerCase().startsWith(lowerQuery)) {
        suggestions.add(word);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
}
