export default function Loader() {
  return (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
      <span className="ml-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse">Loading your pantry...</span>
    </div>
  );
}