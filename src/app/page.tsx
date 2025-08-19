import Link from "next/link";

export default function Home() {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Food Tracker 🍴</h1>
      <p className="text-gray-600 mb-6">
        Track your meals, calories, and stay healthy!
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-green-600 text-white rounded-lg"
      >
        Go to Dashboard
      </Link>
    </section>
  );
}
