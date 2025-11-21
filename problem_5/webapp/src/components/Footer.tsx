import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-black bg-black dark:border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-zinc-100 dark:text-zinc-100">Recipes Chef</h4>
          <p className="mt-4 text-zinc-300 dark:text-zinc-300 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare cursus sed nunc eget dictum.
          </p>
        </div>

        <div className="hidden md:block">
          <h4 className="text-lg font-semibold text-zinc-100 dark:text-zinc-100">Menu</h4>
          <ul className="mt-4 space-y-4 text-sm">
            <li>
              <Link href="#" className="text-zinc-200 dark:text-zinc-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="text-zinc-200 dark:text-zinc-200">
                Recipes
              </Link>
            </li>
            <li>
              <Link href="#" className="text-zinc-200 dark:text-zinc-200">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="text-zinc-200 dark:text-zinc-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="text-zinc-200 dark:text-zinc-200">
                About us
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <h4 className="text-lg font-semibold text-zinc-100 dark:text-zinc-100">Account</h4>
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 border rounded text-sm text-white border-white">
              <Link href="/sign-in">Sign in</Link>
            </button>
            <button className="px-4 py-2 rounded text-sm bg-white text-black">
              <Link href="/sign-up">Sign up</Link>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-sm border-b border-black/10 dark:border-white/10 text-zinc-400 dark:text-zinc-600">
        &copy; {new Date().getFullYear()} Recipes Chef. All rights reserved.
      </div>
    </footer>
  );
}
