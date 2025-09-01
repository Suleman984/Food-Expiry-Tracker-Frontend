"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setUser } from "../../../store/authSlice";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  // fetch once on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) dispatch(setUser(user));
    };
    fetchUser();

    // listener for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(setUser(null));
    router.push("/login");
  };

  const navItems = [
    { name: "Login", href: "/login" },
    { name: "Signup", href: "/signup" },
  ];

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
          <span className="text-2xl">🍎</span>
          <span>Food Tracker</span>
        </Link>

        <div className="hidden md:flex space-x-4 items-center">
          {!user ? (
            navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                Logout
              </button>
              <span className="text-xs text-gray-500 mt-1">
                {user.user_metadata?.username || user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
