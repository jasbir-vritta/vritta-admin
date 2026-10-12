"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useAdmin } from "./AdminProvider";
import { BrandLogo } from "./BrandLogo";
import { HelpIcon, LogoutIcon, UsersIcon } from "./icons";

const NAV = [
  { label: "Astrologers", href: "/", icon: UsersIcon },
  { label: "Support", href: "/support", icon: HelpIcon },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { userId, signOut } = useAdmin();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-primary/8 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Vritta Admin home" className="flex items-center gap-2">
            <BrandLogo alt="" className="h-8 w-auto" />
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Admin
            </span>
          </Link>

          <nav className="ml-2 flex gap-1" aria-label="Admin">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                    active ? "bg-primary font-semibold text-white" : "text-ink/70 hover:bg-lavender hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <span className="hidden max-w-48 truncate text-xs text-ink/50 md:inline" title={userId}>
            {userId}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogoutIcon className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
