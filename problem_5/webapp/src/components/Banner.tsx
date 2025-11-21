'use client';

import React from 'react';
import Image from 'next/image';
import resolveImage from '@/utils/resolveImage';

type Slide = {
  id: string | number;
  title?: string;
  description?: string;
  image?: string;
  time_to_cook?: string;
  main_ingredients?: string[];
  created_by?: number;
};

type BannerProps = {
  bannerItem?: Slide;
  authorName?: string;
  authorDate?: string;
};

export default function Banner({
  authorName = 'John Smith',
  authorDate = '15 March 2022',
  bannerItem,
}: BannerProps) {
  const resolvedImage = resolveImage(bannerItem?.image || '/images/auth-left.jpg');

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden bg-white dark:bg-[#071018] shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* left */}
          <div className="p-10 md:p-16 bg-[#eaf9fb] dark:bg-transparent">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-3 py-1 shadow-sm mb-6 w-max">
              <span className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-sm">🧂</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">Hot Recipes</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight mb-4">
              {bannerItem?.title}
            </h2>

            <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mb-6">{bannerItem?.description}</p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-700 dark:text-zinc-200">
                🕒 <span>{bannerItem?.time_to_cook}</span>
              </span>
              <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 text-xs text-zinc-700 dark:text-zinc-200">
                🍗 <span>{bannerItem?.main_ingredients?.join(', ')}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-zinc-200">
                  {/* placeholder avatar */}
                  <Image src="/images/avatar.png" alt={authorName} width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{authorName}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{authorDate}</div>
                </div>
              </div>

              <button className="inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full shadow hover:opacity-95">
                View Recipes{' '}
                <span className="inline-block bg-white text-black rounded-full w-6 h-6 flex items-center justify-center">
                  ▶
                </span>
              </button>
            </div>
          </div>

          {/* right */}
          <div className="relative flex items-center justify-center p-6 md:p-0 bg-transparent">
            <div className="w-full h-80 md:h-[420px] relative">
              <Image
                src={resolvedImage}
                alt={bannerItem?.title || 'Banner Image'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-l-none rounded-r-3xl md:rounded-l-none md:rounded-r-3xl"
              />
            </div>

            {/* circular badge */}
            <div className="absolute right-8 top-6">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white shadow-md flex items-center justify-center text-center">
                <div className="text-xs font-semibold">Handpicked</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
