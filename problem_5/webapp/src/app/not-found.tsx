import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black text-black dark:text-white ">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-sm">This page could not be found.</p>
        <div className="mt-6">
          <Link
            href="/"
            className="px-4 py-2 text-black rounded border border-black/10 dark:border dark:border-white/10 dark:bg-white dark:text-black"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
