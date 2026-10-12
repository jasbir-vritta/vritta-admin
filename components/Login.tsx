"use client";

import { useState, type FormEvent } from "react";

import { BrandLogo } from "./BrandLogo";
import { Button, Field, inputClass } from "./ui";
import { api } from "@/lib/api";

type Props = { onSignedIn: (token: string) => void };

export function Login({ onSignedIn }: Props) {
  const [userId, setUserId] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const auth = await api<{ access_token: string }>("/api/admin/login", {
        method: "POST",
        body: { user_id: userId.trim(), admin_key: adminKey },
      });
      onSignedIn(auth.access_token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <BrandLogo className="h-10 w-auto" />
          <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
            Admin
          </span>
        </div>

        <div className="rounded-3xl border border-primary/8 bg-white p-6 shadow-card sm:p-8">
          <h1 className="text-xl font-bold text-primary">Admin sign in</h1>
          <p className="mt-1 text-sm text-ink/60">Approve astrologers and answer support requests.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="User ID" htmlFor="user-id" hint="Your user_id from the app (must be listed in ADMIN_USER_IDS).">
              <input
                id="user-id"
                className={inputClass}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. 0e2a97d3-0ba8-4dd2-b534-f3cd6ae59d0f"
                autoComplete="username"
                required
              />
            </Field>

            <Field label="Admin key" htmlFor="admin-key" hint="ADMIN_API_KEY from the backend's .env.">
              <input
                id="admin-key"
                type="password"
                className={inputClass}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>

            <Button type="submit" disabled={busy} className="w-full py-3">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
            {error && (
              <p className="text-sm text-rose-600" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
