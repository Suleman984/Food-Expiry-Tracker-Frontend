export default function  EmptyState() {
  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
      <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Your Food Inventory is Empty! 🌱</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">Let&apos;s get started by adding your first item!</p>
      <div className="mt-4 flex justify-center items-center">
        <span className="inline-block animate-bounce text-yellow-500 text-2xl">👇</span>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Tap &quot;Add Item&quot; to start tracking.</span>
      </div>
    </div>
  );
}