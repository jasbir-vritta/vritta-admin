import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { AdminProvider } from "@/components/AdminProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// The dashboard signs in and loads everything in the browser (AdminProvider):
// opt it out of instant-navigation validation.
export const instant = false;

export const metadata: Metadata = {
  title: "Vritta Admin",
  description: "Approve astrologers and answer support requests.",
  // Private tool: keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {/* Signs the admin in, then shows the dashboard shell. */}
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
