import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for copying text to clipboard
 * @param {number} resetDelay - Delay in ms before resetting copied state (default: 2000)
 * @returns {Array} - [copiedText, copy, reset]
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copiedText, setCopiedText] = useState(null);

  const copy = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        toast.error('Clipboard not supported');
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success('Copied to clipboard!');

        // Reset copied text after delay
        if (resetDelay) {
          setTimeout(() => {
            setCopiedText(null);
          }, resetDelay);
        }

        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy to clipboard');
        setCopiedText(null);
        return false;
      }
    },
    [resetDelay]
  );

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return [copiedText, copy, reset];
}

export default useCopyToClipboard;