import { useState, useMemo } from 'react';

/**
 * Custom hook for pagination logic
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 10)
 * @returns {Object} - Pagination state and methods
 */
export function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // Go to next page
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Go to previous page
  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Go to first page
  const firstPage = () => {
    setCurrentPage(1);
  };

  // Go to last page
  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  // Check if on first page
  const isFirstPage = currentPage === 1;

  // Check if on last page
  const isLastPage = currentPage === totalPages || totalPages === 0;

  // Get page numbers for pagination UI
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // Reset to first page (useful when items change)
  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    itemsPerPage,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    isFirstPage,
    isLastPage,
    getPageNumbers,
    reset,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, items.length),
    totalItems: items.length,
  };
}

export default usePagination;