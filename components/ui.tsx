// Small building blocks shared by the admin screens.

import type { ReactNode } from "react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-primary sm:text-[28px]">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-primary/8 bg-white p-5 shadow-[0_1px_2px_rgb(59_31_110/0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-primary text-white hover:bg-primary-dark disabled:bg-primary/40",
    outline: "border border-primary/15 bg-white text-ink hover:bg-lavender disabled:opacity-50",
    ghost: "text-primary hover:bg-lavender disabled:opacity-50",
    danger: "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-50",
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const inputClass =
  "w-full rounded-xl border border-primary/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-primary disabled:cursor-not-allowed disabled:bg-zinc-50";

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (value: T) => void;
  tabs: { key: T; label: string; count?: number }[];
}) {
  return (
    <div className="mb-5 flex gap-6 border-b border-primary/10" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold ${
            value === t.key ? "border-primary text-primary" : "border-transparent text-ink/55 hover:text-primary"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] ${
                t.count > 0 && value !== t.key ? "bg-rose-500 text-white" : "bg-lavender text-primary"
              }`}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Pill({ tone, children }: { tone: "amber" | "green" | "zinc" | "violet"; children: ReactNode }) {
  const tones = {
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    zinc: "bg-zinc-100 text-zinc-600",
    violet: "bg-violet-50 text-violet-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function Avatar({ name, photo, size = 56 }: { name?: string | null; photo?: string | null; size?: number }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return photo ? (
    // eslint-disable-next-line @next/next/no-img-element -- remote photos from the bucket
    <img src={photo} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-lavender font-semibold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {letter}
    </span>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/15 bg-white px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {text && <p className="mt-1 text-sm text-ink/55">{text}</p>}
    </div>
  );
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}
