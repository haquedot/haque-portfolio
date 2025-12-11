'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { BlogPost } from '@/constants/blog';
import { searchBlogPosts, getSearchSuggestions, type SearchResult } from '@/lib/blog-search';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, X, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

interface BlogSearchProps {
  posts: BlogPost[];
  onSearchChange?: (results: SearchResult[]) => void;
}

export function BlogSearch({ posts, onSearchChange }: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Get search results
  const results = useMemo(() => {
    return searchBlogPosts(posts, query);
  }, [query, posts]);

  // Notify parent of search results
  useEffect(() => {
    onSearchChange?.(results);
  }, [results, onSearchChange]);

  // Get suggestions
  useEffect(() => {
    if (query.length > 1) {
      const sug = getSearchSuggestions(posts, query, 8);
      setSuggestions(sug);
    } else {
      setSuggestions([]);
    }
  }, [query, posts]);

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10 h-11"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm"
                >
                  <Search className="inline w-4 h-4 mr-2 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      {query && (
        <div className="text-sm text-muted-foreground">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="grid grid-cols-1 gap-4">
          {results.length > 0 ? (
            results.map(result => (
              <Link key={result.id} href={`/blog/${result.slug}`}>
                <Card className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {result.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap capitalize"
                        >
                          {result.matchType}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {result.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(result.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.readTime} min read
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {result.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-secondary/80"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Relevance Score */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(result.relevanceScore)}
                      </div>
                      <div className="text-xs text-muted-foreground">relevance</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-2">No results found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </Card>
          )}
        </div>
      )}

      {/* No Query Message */}
      {/* {!query && (
        <Card className="p-8 text-center bg-muted/30">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">
            Start typing to search articles or browse by tags below
          </p>
        </Card>
      )} */}
    </div>
  );
}
