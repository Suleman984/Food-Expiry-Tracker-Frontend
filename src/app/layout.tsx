import "./globals.css";
import Navbar from "@/components/Navbar/Index";

// Separate viewport export (Next.js 14+ requirement)
export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark", // Support both light and dark
};

// Metadata without themeColor
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My Food Tracker" />
        <link rel="apple-touch-icon" href="/icons/logo192.png" />
        {/* Support both light and dark color schemes */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen h-full transition-colors duration-200">
        <Navbar />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}