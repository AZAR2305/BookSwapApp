import { useEffect, useMemo, useState } from 'react';
import { loadBooksPage, subscribeToBooks, type BookFilter } from '@/src/services/bookService';
import type { BookCondition, BookListing } from '@/src/utils/types';

export function useBooks() {
  const [books, setBooks] = useState<BookListing[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<BookCondition | 'All'>('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<any>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const filters: BookFilter = useMemo(
    () => ({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      condition: selectedCondition,
    }),
    [maxPrice, minPrice, selectedCondition]
  );

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToBooks(
      (data) => {
        setBooks(data);
        setIsLoading(false);
      },
      filters
    );

    return unsubscribe;
  }, [filters]);

  const filteredBooks = useMemo(() => {
    if (!query.trim()) return books;
    const normalized = query.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(normalized) ||
        book.author.toLowerCase().includes(normalized)
    );
  }, [books, query]);

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const page = await loadBooksPage(10, cursor);
      setBooks((prev) => {
        const ids = new Set(prev.map((b) => b.id));
        const next = page.books.filter((b) => !ids.has(b.id));
        return [...prev, ...next];
      });
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (error) {
      console.warn('Failed to load more books:', error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    books: filteredBooks,
    query,
    setQuery,
    selectedCondition,
    setSelectedCondition,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    isLoading,
    isLoadingMore,
    loadMore,
  };
}
