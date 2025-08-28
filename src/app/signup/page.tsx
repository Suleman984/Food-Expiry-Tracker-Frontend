"use client";
import { supabase } from "../../../lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    // Basic validation
    if (!fullName.trim()) {
      setMessage("Please enter your full name");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setMessage("This email is already registered. Please try logging in instead.");
          setMessageType("error");
        } else {
          setMessage(error.message);
          setMessageType("error");
        }
      } else {
        if (data.user && !data.user.email_confirmed_at) {
          setMessage(`✅ Account created successfully! Please check your email (${email}) and click the verification link before logging in.`);
          setMessageType("success");
          
          // Redirect after showing message
          setTimeout(() => {
            router.push("/login");
          }, 4000);
        } else {
          setMessage("Account created successfully! Redirecting to login...");
          setMessageType("success");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join us to start tracking your meals
            </p>
          </div>
          
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              messageType === "success" 
                ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" 
                : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-colors duration-200"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-colors duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password (min 6 characters)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4
                         bg-gradient-to-r from-indigo-600 to-purple-600 
                         hover:from-indigo-700 hover:to-purple-700 
                         disabled:from-gray-400 disabled:to-gray-500
                         disabled:cursor-not-allowed
                         text-white font-semibold rounded-lg
                         shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5
                         transition-all duration-200 
                         focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                disabled={isLoading}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}