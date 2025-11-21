'use client';

import React from 'react';
import Image from 'next/image';
import { IoShareOutline, IoPrintOutline } from 'react-icons/io5';
import AddToCart from './AddToCart';
import notify from '@/utils/notify';

export default function ProductDetail({
  product,
}: {
  product: {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    price?: number;
    category?: { _id?: string; name?: string; description?: string } | string | null;
    create_by?: { _id?: string; username?: string; email?: string } | string | null;
    is_active?: boolean;
    created_at?: string;
    // other fields...
  };
}) {
  const p = product;
  const priceFormatted =
    typeof p.price === 'number'
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)
      : '';

  const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
  const creatorName = typeof p.create_by === 'string' ? p.create_by : p.create_by?.username;

  const handleAddToCart = (productId: string, qty: number) => {
    // example behaviour: show notification; integrate real cart API here
    notify('success', `Added ${qty} × ${p.name} to cart`);
    // TODO: call cart API or context
  };

  return (
    <article className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-4">{p.name}</h1>

      <div className="flex items-start gap-6 mb-6">
        <div className="w-full md:w-2/3">
          <div 
          // style={{
          //   backgroundImage: p.image ? `url(${p.image})` : undefined,
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          //   backgroundRepeat: 'no-repeat',  
          //   borderRadius: '1rem',
          // }}
          className="relative w-full h-[80vh] bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-4">
            {p.image ? (
              <Image src={p.image} alt={p.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">No image</div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="rounded-full bg-white/90 dark:bg-black/60 p-2 shadow">
                <IoPrintOutline />
              </button>
              <button className="rounded-full bg-white/90 dark:bg-black/60 p-2 shadow">
                <IoShareOutline />
              </button>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert text-zinc-700 dark:text-zinc-300">
            <p>{p.description || 'No description provided.'}</p>
          </div>

          <div className="mt-6 text-sm text-zinc-500">
            <div>
              Category:{' '}
              <strong className="text-zinc-800 dark:text-zinc-100">{categoryName || '—'}</strong>
            </div>
            <div>
              Creator: <strong>{creatorName || '—'}</strong>
            </div>
            <div>
              Created at: <strong>{p.created_at ? new Date(p.created_at).toLocaleString() : '—'}</strong>
            </div>
          </div>
        </div>

        <aside className="w-full md:w-1/3">
          <div className="sticky top-24 p-4 border rounded-2xl bg-white dark:bg-[#071018]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-semibold">{priceFormatted || '—'}</div>
              <div className="text-xs text-zinc-500">{p.is_active ? 'Inactive' : 'Active'}</div>
            </div>

            <AddToCart productId={p._id} price={p.price ?? 0} onAdd={handleAddToCart} />

            <div className="mt-4 text-sm text-zinc-500">
              <div>
                <strong>SKU:</strong> {p._id}
              </div>
              <div className="mt-2">Ships within 1-3 business days.</div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
