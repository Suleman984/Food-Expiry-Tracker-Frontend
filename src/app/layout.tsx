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
        <div className="fixed top-0 left-0 right-0 w-full z-50">
          <Navbar />
        </div>
        <main className="w-full pt-16">{children}</main>
      </body>
    </html>
  );
}
