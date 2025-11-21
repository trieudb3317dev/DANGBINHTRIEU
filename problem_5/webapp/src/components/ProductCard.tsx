'use client';

import React from 'react';
import Image from 'next/image';

type ProductItem = {
  _id: string;
  name: string;
  image?: string | null;
  description?: string | null;
  price?: number | null;
  category?: { _id?: string; name?: string; description?: string } | string | null;
  create_by?: { _id?: string; username?: string } | string | null;
  is_active?: boolean;
  created_at?: string;
  liked?: boolean;
};

type Props = {
  item: ProductItem;
  onLike?: (id: string) => void;
  onClick?: (id: string) => void;
};

export default function ProductCard({ item, onLike, onClick }: Props) {
  const {
    _id,
    name,
    image,
    description,
    price,
    category,
    create_by,
    liked,
    created_at,
  } = item;

  const categoryName = typeof category === 'string' ? category : category?.name;
  const creatorName = typeof create_by === 'string' ? create_by : create_by?.username;

  const shortDesc = description
    ? description.length > 120
      ? description.slice(0, 117) + '...'
      : description
    : '';

  const formattedPrice =
    typeof price === 'number'
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
      : '';

  return (
    <article className="bg-white dark:bg-[#0b0b0b] rounded-2xl shadow-sm hover:shadow-md overflow-hidden p-2 cursor-pointer">
      <div
       className="relative w-full h-48 bg-gray-100 dark:bg-gray-900">
        {image ? (
          <Image src={image} alt={name || 'product'} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}

        {/* like button (top-right) */} 
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onLike) onLike(_id);
          }}
          aria-label="like"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-black/60 flex items-center justify-center shadow"
        >
          {liked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657 3.172 11.83a4 4 0 010-5.657z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.657 3.172 10.828a4 4 0 010-5.656z" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
              onClick={() => onClick && onClick(_id)}
            >
              {name}
            </h3>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {categoryName ? categoryName : 'Uncategorized'} • {creatorName ?? 'Unknown'}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{formattedPrice}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400"> {created_at ? new Date(created_at).toLocaleDateString() : ''}</div>
          </div>
        </div>

        {shortDesc && <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">{shortDesc}</p>}
      </div>
    </article>
  );
}

/*
Usage hint:

Replace usages like:
  <RecipeCard key={it.id} item={{ ...it, liked: !!likedMap[it.id] }} onLike={() => handleLike(it.id)} />

with:
  <ProductCard
    key={it._id || it.id}
    item={{ ...it, liked: !!likedMap[it._id || it.id] }}
    onLike={(id) => handleLike(id)}
    onClick={(id) => router.push(`/products/${id}`)} // optional
  />
*/
