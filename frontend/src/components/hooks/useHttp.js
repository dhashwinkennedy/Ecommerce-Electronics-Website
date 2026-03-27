import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, onSuccess) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...requestConfig.headers, // merge any extra headers like auth token
        },
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      onSuccess(data); // ← pass response data to the caller
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return { isLoading, error, sendRequest, clearError };
};

export default useHttp;
