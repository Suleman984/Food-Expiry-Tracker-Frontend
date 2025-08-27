import "./globals.css";
import Navbar from "@/components/Navbar/Index";

// Separate viewport export (Next.js 14+ requirement)
export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
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
    icon: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My Food Tracker" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {/* <div className="fixed top-0 left-0 right-0 w-full z-50"> */}
          <Navbar />
        {/* </div> */}
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}