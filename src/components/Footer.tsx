export function Footer() {
  return (
    <footer className="w-full py-4 mt-auto bg-gray-50 dark:bg-gray-900 transition-colors border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Created by{' '}
          <a 
            href="https://bermudi.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            bermudi.dev
          </a>
        </p>
      </div>
    </footer>
  );
}
