import "./globals.css";
import Navbar from "@/components/Navbar/Index";

export const metadata = {
  title: "Food Tracker",
  description: "Track your meals easily with Supabase + Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
