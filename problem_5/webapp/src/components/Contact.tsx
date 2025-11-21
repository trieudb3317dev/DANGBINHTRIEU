'use client';

import React from 'react';
import Image from 'next/image';
import notify from '@/utils/notify';

export default function Contact() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      return notify('error', 'Please enter a valid email address.');
    }
    try {
      setLoading(true);
      // TODO: send to API / subscribe endpoint
      await new Promise((r) => setTimeout(r, 700));
      notify('success', 'Subscribed! Check your inbox.');
      setEmail('');
    } catch (err) {
      notify('error', 'Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-4">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-[28px] bg-[#e8fbff] dark:bg-[#052026] overflow-hidden py-16 px-8 md:px-16">
          {/* left decorative image */}
          <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2">
            <Image src="/images/news-left.png" alt="decor" width={180} height={180} className="object-contain" />
          </div>

          {/* right decorative bowl */}
          <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2">
            <Image src="/images/news-right.png" alt="bowl" width={220} height={220} className="object-contain" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Deliciousness to your inbox
            </h3>
            <p className="mt-3 text-sm md:text-base text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliquot enim ad minim
            </p>

            <form onSubmit={onSubmit} className="mt-8 flex items-center justify-center gap-3">
              <label htmlFor="newsletter" className="sr-only">
                Your email address
              </label>
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address..."
                className="min-w-[260px] md:min-w-[420px] px-4 py-3 rounded-full border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 dark:bg-transparent dark:border-zinc-700 dark:text-white"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-full bg-black text-white shadow hover:opacity-95 disabled:opacity-60"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
