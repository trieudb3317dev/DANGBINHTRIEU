'use client';

import React, { useState } from 'react';

type Props = {
  productId: string;
  price?: number;
  onAdd: (productId: string, qty: number) => void;
};

export default function AddToCart({ productId, price = 0, onAdd }: Props) {
  const [qty, setQty] = useState(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => q + 1);

  const handleAdd = () => {
    onAdd(productId, qty);
  };

  const total = typeof price === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * qty) : '';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded overflow-hidden">
          <button type="button" onClick={dec} className="px-3 py-2 bg-white dark:bg-black/60">-</button>
          <div className="px-4 py-2 w-12 text-center">{qty}</div>
          <button type="button" onClick={inc} className="px-3 py-2 bg-white dark:bg-black/60">+</button>
        </div>
        <button type="button" onClick={handleAdd} className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add to cart
        </button>
      </div>

      <div className="text-sm text-zinc-600">Total: <strong className="text-zinc-900 dark:text-zinc-100">{total}</strong></div>
    </div>
  );
}
