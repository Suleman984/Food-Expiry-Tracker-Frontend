"use client";
import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center py-20 px-4  bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Welcome to Food Tracker 🍴
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Track your meals, calories, and stay healthy with our easy-to-use food tracking app!
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                       hover:from-indigo-700 hover:to-purple-700 
                       text-white rounded-lg font-semibold text-lg
                       shadow-lg hover:shadow-xl transform hover:-translate-y-1
                       transition-all duration-200"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white
                       border-2 border-gray-300 dark:border-gray-600
                       hover:border-indigo-500 dark:hover:border-indigo-400
                       rounded-lg font-semibold text-lg
                       shadow-md hover:shadow-lg
                       transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Easy to Use</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simple and intuitive interface designed for daily meal tracking
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Stay Healthy</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your nutrition and maintain a balanced diet
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              View detailed analytics and track your eating habits
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}