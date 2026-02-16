import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean state with toggle functionality
 * @param {boolean} initialValue - Initial boolean value (default: false)
 * @returns {Array} - [value, toggle, setTrue, setFalse, setValue]
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // Toggle the value
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  // Set to true
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  // Set to false
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse, setValue];
}

export default useToggle;