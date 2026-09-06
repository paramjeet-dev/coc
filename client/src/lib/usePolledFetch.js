'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * usePolledFetch
 * Runs `fetcher` immediately, then again every `intervalMs`.
 * Cancels in-flight requests on unmount and between polls via AbortController.
 * Returns { data, error, loading, refetch } - loading only reflects the FIRST fetch,
 * subsequent polls update data silently unless they error.
 */
export function usePolledFetch(fetcher, deps = [], intervalMs = null) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef(null);
  const firstRunRef = useRef(true);

  const run = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const result = await fetcher({ signal: controller.signal });
      setData(result);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err);
    } finally {
      if (firstRunRef.current) {
        firstRunRef.current = false;
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    firstRunRef.current = true;
    setLoading(true);
    run();
    if (!intervalMs) return () => controllerRef.current?.abort();
    const id = setInterval(run, intervalMs);
    return () => {
      clearInterval(id);
      controllerRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: run };
}