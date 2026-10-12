"use client";

import { useCallback, useEffect, useState } from "react";

import { api } from "./api";

/**
 * GET `path` with the admin token. Reloads when the path changes or
 * reload() is called; while reloading, the previous data stays visible.
 */
export function useLoad<T>(path: string, token: string) {
  const [state, setState] = useState<{ path: string; data?: T; error?: string } | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // Started from a timer so no state is set synchronously in the effect.
    const timer = window.setTimeout(async () => {
      try {
        const data = await api<T>(path, { token });
        if (!cancelled) setState({ path, data });
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            path,
            data: prev?.path === path ? prev.data : undefined,
            error: (err as Error).message,
          }));
        }
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [path, token, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const current = state?.path === path ? state : null;

  return { data: current?.data, error: current?.error, loading: !current, reload };
}
