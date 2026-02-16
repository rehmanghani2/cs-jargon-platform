import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for searching/filtering items
 * @param {Array} items - Array of items to search
 * @param {Array|string} searchKeys - Keys to search in (for objects) or single key
 * @param {number} debounceDelay - Debounce delay in ms (default: 300)
 * @returns {Object} - Search state and methods
 */
export function useSearch(items = [], searchKeys = [], debounceDelay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Convert searchKeys to array if string
  const keys = Array.isArray(searchKeys) ? searchKeys : [searchKeys];

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();

    return items.filter((item) => {
      // If item is a string or number, search directly
      if (typeof item !== 'object') {
        return String(item).toLowerCase().includes(searchLower);
      }

      // If item is an object, search in specified keys
      if (keys.length === 0) {
        // If no keys specified, search in all values
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        );
      }

      // Search in specified keys
      return keys.some((key) => {
        const value = key.split('.').reduce((obj, k) => obj?.[k], item);
        return String(value || '').toLowerCase().includes(searchLower);
      });
    });
  }, [items, debouncedSearchTerm, keys]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Check if searching
  const isSearching = searchTerm.length > 0;

  // Get search result count
  const resultCount = filteredItems.length;

  // Check if no results
  const hasNoResults = isSearching && resultCount === 0;

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
    filteredItems,
    isSearching,
    resultCount,
    hasNoResults,
    isDebouncing: searchTerm !== debouncedSearchTerm,
  };
}

export default useSearch;