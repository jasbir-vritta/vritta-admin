type IconProps = { className?: string };

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function LotusIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} viewBox="0 0 48 48" className={className}>
      <path d="M24 6c4 5 6 10 6 15s-2 10-6 14c-4-4-6-9-6-14s2-10 6-15Z" />
      <path d="M24 35C17 33 11 28 9 20c5 0 10 2 13 6" />
      <path d="M24 35c7-2 13-7 15-15-5 0-10 2-13 6" />
      <path d="M22 37c-6 0-12-3-16-9 4-2 9-1 12 1" />
      <path d="M26 37c6 0 12-3 16-9-4-2-9-1-12 1" />
      <path d="M24 35v6" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.9.7 3.1 2.4 3.5 5.2" />
    </svg>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 16l-4-4 4-4M6 12h10" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...strokeProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" />
    </svg>
  );
}
