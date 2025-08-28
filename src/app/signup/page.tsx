"use client";
import { supabase } from "../../../lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName, 
        },
      },
    });

    if (!error) router.push("/login");
    else alert(error.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Signup</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-colors duration-200"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-colors duration-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg 
                     bg-white dark:bg-gray-700 
                     text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-colors duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 
                          hover:from-indigo-700 hover:to-purple-700 
                          text-white p-3 rounded-lg font-semibold
                          transition-all duration-200 
                          shadow-md hover:shadow-lg
                          focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Signup
        </button>
      </form>
    </div>
  );
}