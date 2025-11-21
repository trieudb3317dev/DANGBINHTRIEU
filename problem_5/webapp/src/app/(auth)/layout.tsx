'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuthContext } from '../../../context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';

import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FaApple } from 'react-icons/fa';

export default function AuthLayout({
  children,
  title,
}: Readonly<{
  header?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}>) {
  return (
    <AuthProvider>
      <AuthLayoutContent title={title}>{children}</AuthLayoutContent>
    </AuthProvider>
  );
}

// content inside provider so it can use useAuthContext()
function AuthLayoutContent({ children, title }: { children: React.ReactNode; title?: string }) {
  const { tab, setTab } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const isSignIn =
    pathname.includes('/sign-in') || pathname.includes('/(auth)/sign-in') || pathname.includes('/module/auth/sign-in');
  title = title ?? (isSignIn ? 'Welcome back!' : 'Create your account!');
  const auth_background =
    'https://res.cloudinary.com/dmdzyoslx/image/upload/v1763100684/avatars/73879289-c33d-4d86-890a-60f0af7fd9e1.jpg';

  const { theme, setTheme } = useTheme();
  const [localTheme, setLocalTheme] = React.useState<'light' | 'dark' | 'system'>('system');

  // sync localTheme when provider theme changes
  React.useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    if (localTheme === 'light') {
      setLocalTheme('dark');
      setTheme('dark');
    } else if (localTheme === 'dark') {
      setLocalTheme('system');
      setTheme('system');
    } else {
      setLocalTheme('light');
      setTheme('light');
    }
  };

  const header = (
    <div className="flex items-center gap-6 text-sm text-zinc-500">
      <button
        className={`pb-2 ${
          tab === 'username' ? 'border-b-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : ''
        }`}
        onClick={() => setTab('username')}
      >
        Username
      </button>
      <button
        className={`pb-2 ${
          tab === 'mobile' ? 'border-b-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100' : ''
        }`}
        onClick={() => setTab('mobile')}
      >
        Mobile Number
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-8">
      <div className="relative flex w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Left panel */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04)), url('${auth_background}')`,
            minHeight: 560,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-300 to-indigo-200 opacity-40 mix-blend-multiply" />
          <div className="absolute left-8 bottom-12 w-[70%] rounded-md bg-white/30 backdrop-blur-md p-6 text-white">
            <p className="text-sm opacity-90">Welcome to the community</p>
            <p className="mt-2 font-semibold">{title ?? 'Welcome'}</p>
            <div className="mt-4 flex gap-2">
              <span className="h-2 w-2 rounded-full bg-white/80" />
              <span className="h-2 w-2 rounded-full bg-white/60" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* Right panel (card) */}
        <div className="relative w-full md:w-1/2 bg-white dark:bg-[#0b0b0b] p-10 md:p-16 rounded-tr-2xl rounded-br-2xl">
          {/* <button
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            className="absolute top-4 right-4 rounded-full p-2 bg-white shadow-md dark:bg-zinc-900"
          >
            {localTheme === "dark" ? "🌙" : localTheme === "light" ? "☀️" : "🖥️"}
          </button> */}
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">{title ?? 'Authenticate'}</h2>

          {/* show header (tabs) only on sign-in route */}
          {isSignIn ? <div className="mb-6">{header}</div> : null}

          {/* form/content injected by page */}
          <div>{children}</div>

          {/* common footer / social / link */}
          <div className="mt-6 text-center text-sm text-zinc-500">
            <div className="mb-3">Sign in With</div>
            <div className="flex items-center justify-center gap-4">
              <button aria-label="facebook" className="p-2 rounded-full bg-blue-600 text-white">
                <FaFacebook />
              </button>
              <button aria-label="google" className="p-2 rounded-full bg-white border">
                <FcGoogle />
              </button>
              <button aria-label="apple" className="p-2 rounded-full bg-black text-white">
                <FaApple />
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-center text-zinc-500">
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="text-sky-500 font-medium">
              {isSignIn ? 'Sign up' : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
