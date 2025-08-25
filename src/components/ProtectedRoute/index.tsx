"use client";
import { supabase } from "../../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const FullPageLoader = () => (
  <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center z-50">
    <div className="text-center">
      {/* Animated Logo */}
      <div className="mb-6 relative">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <span className="text-white font-bold text-2xl">L</span>
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>
      </div>

      {/* Loading Animation */}
      <div className="mb-4">
        <LoadingSpinner />
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading</h2>
      <p className="text-slate-500">Please wait while we fetch your information...</p>

      {/* Progress dots */}
      <div className="flex justify-center space-x-1 mt-4">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-indigo-200 rounded-full"></div>
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return <FullPageLoader />;
  }
  return <>{children}</>;
}