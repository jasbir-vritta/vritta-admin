"use client";

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

import { Login } from "./Login";
import { Shell } from "./Shell";
import { Button } from "./ui";
import { ApiError, api } from "@/lib/api";
import { loadToken, saveToken, subscribeToken } from "@/lib/storage";

type Admin = { token: string; userId: string; signOut: () => void };

const AdminContext = createContext<Admin | null>(null);

export function useAdmin(): Admin {
  const admin = useContext(AdminContext);
  if (!admin) throw new Error("useAdmin must be used inside AdminProvider.");
  return admin;
}

const Centered = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-ink/60">{children}</div>
);

type Check = { token: string; userId?: string; error?: string };

/** Shows the sign-in form until there's a valid admin token, then the dashboard. */
export function AdminProvider({ children }: { children: ReactNode }) {
  // `undefined` while rendering on the server / hydrating, then token or null.
  const token = useSyncExternalStore(subscribeToken, loadToken, () => undefined);
  const [check, setCheck] = useState<Check | null>(null);
  const [attempt, setAttempt] = useState(0);

  const signOut = useCallback(() => saveToken(null), []);

  // Check the saved token is still a valid admin session.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const me = await api<{ user_id: string }>("/api/admin/me", { token });
        if (!cancelled) setCheck({ token, userId: me.user_id });
      } catch (err) {
        if (cancelled) return;
        // Expired or not an admin: sign in again. Otherwise (offline,
        // server down) keep the token and offer a retry.
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) signOut();
        else setCheck({ token, error: (err as Error).message });
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [token, signOut, attempt]);

  if (token === undefined) return <Centered>Loading…</Centered>;
  if (!token) return <Login onSignedIn={saveToken} />;
  if (!check || check.token !== token) return <Centered>Loading…</Centered>;

  if (!check.userId) {
    return (
      <Centered>
        <p>Couldn&apos;t reach the server. {check.error}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setCheck(null);
              setAttempt((n) => n + 1);
            }}
          >
            Try again
          </Button>
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </Centered>
    );
  }

  return (
    <AdminContext.Provider value={{ token, userId: check.userId, signOut }}>
      <Shell>{children}</Shell>
    </AdminContext.Provider>
  );
}
