'use client';

import React from 'react';
import Image from 'next/image';
import Pagination from './Pagination';
import { useCategories } from '@/hooks/useCategories';

type Category = {
  id: string | number;
  image: string; // path under public, e.g. /images/categories/breakfast.png
  title: string;
  count: number;
};

export default function Categories({ items }: { items?: Category[] }) {
  const { categories, loading, refetch } = useCategories();

  const list = items && items.length ? items : categories;

  // pagination state (used on desktop)
  const [page, setPage] = React.useState(1);
  const perPage = 4; // number of items per page on desktop

  // detect desktop (md breakpoint) on client
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false);
  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // reset page when switching breakpoint or items
  React.useEffect(() => {
    setPage(1);
  }, [isDesktop, list.length]);

  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const pagedItems = isDesktop ? list.slice((page - 1) * perPage, page * perPage) : list;

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Categories</h3>
          <button className="hidden md:inline-block px-4 py-2 text-sm bg-sky-100 rounded-full">
            View All Categories
          </button>
        </div>

        {/* Desktop: grid with pagination; Mobile: horizontal scroll */}
        {isDesktop ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {pagedItems.map((c: any) => (
                <article
                  key={c._id}
                  className="bg-white dark:bg-[#0b0b0b] rounded-2xl p-5 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-white/60 dark:bg-white/5 rounded-xl p-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24">
                      <Image src={c.image} alt={c.name} fill className="object-contain" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{c.products.length} products</div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination for desktop */}
            {totalPages > 1 && (
              <Pagination page={page} goPrev={goPrev} goNext={goNext} setPage={setPage} totalPages={totalPages} />
            )}
          </>
        ) : (
          <>
            <div className="overflow-x-auto py-2 -mx-2">
              <div className="flex gap-6 px-2">
                {pagedItems.map((c: any) => (
                  <article
                    key={c._id}
                    className="min-w-[140px] flex-shrink-0 bg-white dark:bg-[#0b0b0b] rounded-2xl p-5 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="bg-white/60 dark:bg-white/5 rounded-xl p-4">
                      <div className="relative w-20 h-20">
                        <Image src={c.image} alt={c.name} fill className="object-contain" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.name}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{c.products.length} products</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* On mobile we typically don't show pagination; show simple indicator if many items */}
            {list.length > 6 && (
              <div className="flex items-center justify-center mt-4 text-xs text-zinc-500">
                Scroll to see more categories
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
