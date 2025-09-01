
import "./globals.css";
import Navbar from "@/components/Navbar/Index";
import { Providers } from "./providers";
import { store } from "../../store/store";
// Separate viewport export (Next.js 14+ requirement)
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

// Metadata
export const metadata = {
  title: "My Food Tracker",
  description: "Track your meals easily with Supabase + Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "My Food Tracker",
  },
  icons: {
    icon: "/icons/logo192.png",
    apple: "/icons/logo192.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="My Food Tracker" />
        <link rel="apple-touch-icon" href="/icons/logo192.png" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <Providers >
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        <Navbar />
        <main className="w-full min-h-screen">{children}</main>
      </body>
      </Providers>
    </html>
  );
}