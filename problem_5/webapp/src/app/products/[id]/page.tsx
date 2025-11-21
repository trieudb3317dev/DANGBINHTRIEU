import React from 'react';
import ProductDetail from '@/components/ProductDetail'; // ProductDetail component (file kept name RecipeDetail)
import usePublic from '@/hooks/usePublic';
import { notFound } from 'next/navigation';

const apiUrl = usePublic();
const [products, loading] = await fetch(`${apiUrl}/api/v1/products?page=1&limit=100`)
  .then((res) => res.json())
  .then((data) => [data.data || [], false])
  .catch(() => [[], false]);

export default async function Page({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolved = await params;
  const id = Number(resolved?.id);
  if (Number.isNaN(id)) return notFound();

  const product = products.find((r: any) => Number(r._id) === id);
  if (!product) return notFound();

  return <ProductDetail product={product} />;
}
