import { useState, useCallback } from "react";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

const _initialStates = {
  loading: undefined,
  data: undefined,
  error: undefined,
};

export const useFetch = (url, body) => {
  const fetch = useAuthenticatedFetch();

  const [states, setStates] = useState(_initialStates);

  const _fetchData = useCallback(
    async (overrideUrl, overrideBody) => {
      const _options = body || overrideBody || {};
      try {
        setStates({ ..._initialStates, loading: true });
        const response = await fetch(overrideUrl || url, {
          ..._options,
        });
        const jsonData = await response.json();

        setStates({
          ..._initialStates,
          error: response.ok ? undefined : jsonData,
          data: response.ok ? jsonData : undefined,
        });
      } catch (error) {
        setStates({
          ..._initialStates,
          error: error.message,
        });
      }
    },
    [url]
  );

  return {
    loading: states.loading,
    data: states.data,
    error: states.error,
    fetchData: _fetchData,
  };
};
