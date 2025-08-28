"use client";
import { supabase } from "../../../lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | "">("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");

    // Basic validation
    if (!email || !password) {
      setMessage("Please enter both email and password");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Login error:", error);
        
        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          setMessage("Please check your email and click the verification link before logging in. Check your spam folder if you don't see it.");
          setMessageType("info");
        } else if (error.message.includes("Invalid login credentials")) {
          setMessage("Invalid email or password. Please check your credentials and try again.");
          setMessageType("error");
        } else if (error.message.includes("Too many requests")) {
          setMessage("Too many login attempts. Please wait a moment before trying again.");
          setMessageType("error");
        } else {
          setMessage(error.message);
          setMessageType("error");
        }
      } else if (data.user) {
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
        
        // Small delay to show success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.log("Unexpected error:", err);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email address first");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setMessage("Failed to resend verification email. " + error.message);
        setMessageType("error");
      } else {
        setMessage("Verification email sent! Please check your inbox and spam folder.");
        setMessageType("success");
      }
    } catch (err) {
      setMessage("Failed to resend verification email. Please try again.");
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>
          
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              messageType === "success" 
                ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" 
                : messageType === "info"
                ? "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            }`}>
              {message}
              {messageType === "info" && message.includes("Email not confirmed") && (
                <div className="mt-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="text-blue-800 dark:text-blue-200 underline hover:no-underline text-sm font-medium disabled:opacity-50"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                disabled={isLoading}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                Create one here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}