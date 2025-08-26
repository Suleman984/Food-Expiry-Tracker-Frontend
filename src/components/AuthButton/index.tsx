"use client";
import { supabase } from "../../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-3 bg-white/10 px-2 py-2 rounded-lg shadow-sm">
          {/* Profile Circle */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
            {/* Could later be replaced with profile image */}
            {user.user_metadata?.name?.charAt(0).toUpperCase() || "?"}
          </div>

         <div className="flex flex-col items-start">
           {/* Username */}
          <span className="text-sm font-medium text-white">
            {user.user_metadata?.name ?? "undefined"}
          </span>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="text-xs text-red-300 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
         </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link
            href="/login"
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Signup
          </Link>
        </div>
      )}
    </>
  );
}
