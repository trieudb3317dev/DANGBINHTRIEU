'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { IoMenuOutline } from 'react-icons/io5';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);

  // mobile menu state
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu when resizing to desktop
  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // compute background and border based on explicit theme (not on scroll)
  const bgClass = theme === 'dark' ? 'bg-black/60 text-white' : 'bg-white text-black';
  const borderClass = theme === 'dark' ? 'border-white/5' : 'border-black/5';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${bgClass} ${
          scrolled ? `backdrop-blur-sm shadow-sm border-b ${borderClass}` : 'border-b-0'
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Ecommerce
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="group inline-flex flex-col items-center px-4 py-2 rounded transition-colors hover:bg-black/5 dark:hover:bg-white/8"
              >
                <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
                  Home
                </span>
                <span className="mt-1 h-[2px] w-full bg-zinc-900 dark:bg-zinc-50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
              </Link>

              <Link
                href="/products"
                // href="/recipes"
                className="group inline-flex flex-col items-center px-4 py-2 rounded transition-colors hover:bg-black/5 dark:hover:bg-white/8"
              >
                <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
                  Products
                </span>
                <span className="mt-1 h-[2px] w-full bg-zinc-900 dark:bg-zinc-50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
              </Link>

              <Link
                href="/dashboard"
                // href="/recipes"
                className="group inline-flex flex-col items-center px-4 py-2 rounded transition-colors hover:bg-black/5 dark:hover:bg-white/8"
              >
                <span className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
                  Dashboard
                </span>
                <span className="mt-1 h-[2px] w-full bg-zinc-900 dark:bg-zinc-50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md border px-3 py-2 bg-white dark:bg-zinc-900 border-black/10 dark:border-white/10 flex items-center gap-2 text-sm"
              title={`Theme: ${theme}`}
            >
              {theme === 'dark' ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              className="md:hidden block p-2 rounded-md bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10"
              aria-label="Open menu"
              aria-controls="mobile-nav"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((s) => !s)}
            >
              <IoMenuOutline size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav panel (appears below header) */}
      <div
        id="mobile-nav"
        className={`fixed top-[64px] left-0 right-0 z-40 md:hidden transform origin-top transition-transform duration-200 ${
          mobileOpen ? 'scale-y-100' : 'scale-y-0'
        }`}
        style={{ transformOrigin: 'top' }}
      >
        <div className={`${bgClass} border-t ${borderClass} px-4 py-3`}>
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/8"
            >
              Home
            </Link>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/8"
            >
              Products
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded hover:bg-black/5 dark:hover:bg-white/8"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
