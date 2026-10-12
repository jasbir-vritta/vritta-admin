import type { Metadata } from "next";

import { Support } from "@/components/screens/Support";

// Rendered in the browser after sign-in (see the layout).
export const instant = false;

export const metadata: Metadata = { title: "Support — Vritta Admin" };

export default function SupportPage() {
  return <Support />;
}
