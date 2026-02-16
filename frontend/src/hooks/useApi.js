import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for API calls with loading, error, and success states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options for the hook
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export function useApi(apiFunction, options = {}) {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);
        setData(response);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(response);
        }

        return { success: true, data: response };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || err.message || errorMessage;
        setError(errorMsg);

        if (showErrorToast) {
          toast.error(errorMsg);
        }

        if (onError) {
          onError(err);
        }

        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

export default useApi;