'use client';

import React from 'react';
import Pagination from './Pagination';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { useRouter } from 'next/navigation';

type Recipe = {
  id: string | number;
  image: string;
  title: string;
  time?: string;
  category?: string;
  time_to_cook?: string;
  main_ingredients?: string[];
  liked?: boolean;
};

export default function RecipesGrid({ items }: { items?: Recipe[] }) {
  const defaultItems: Recipe[] = [
    {
      id: 1,
      image: '/images/recipes/1.jpg',
      title: 'Big and Juicy Wagyu Beef Cheeseburger',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Beef', 'Cheese', 'Bun'],
      category: 'Snack',
    },
    {
      id: 2,
      image: '/images/recipes/2.jpg',
      title: 'Fresh Lime Roasted Salmon with Ginger Sauce',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Salmon', 'Lime', 'Ginger'],
      category: 'Fish',
    },
    {
      id: 3,
      image: '/images/recipes/3.jpg',
      title: 'Strawberry Oatmeal Pancake with Honey Syrup',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Strawberry', 'Oats', 'Honey'],
      category: 'Breakfast',
    },
    {
      id: 4,
      image: '/images/recipes/4.jpg',
      title: 'Fresh and Healthy Mixed Mayonnaise Salad',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Lettuce', 'Tomato', 'Cucumber'],
      category: 'Healthy',
    },
    {
      id: 5,
      image: '/images/recipes/5.jpg',
      title: 'Chicken Meatballs with Cream Cheese',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Chicken', 'Cheese', 'Spices'],
      category: 'Meat',
    },
    {
      id: 6,
      image: '/images/recipes/6.jpg',
      title: 'Fruity Pancake with Orange & Blueberry',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Orange', 'Blueberry', 'Flour'],
      category: 'Sweet',
    },
    {
      id: 7,
      image: '/images/recipes/7.jpg',
      title: 'The Best Easy One Pot Chicken and Rice',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Chicken', 'Rice', 'Vegetables'],
      category: 'Snack',
    },
    {
      id: 8,
      image: '/images/recipes/8.jpg',
      title: 'The Creamiest Creamy Chicken and Bacon Pasta',
      time: '30 Minutes',
      time_to_cook: '30 Minutes',
      main_ingredients: ['Chicken', 'Bacon', 'Pasta'],
      category: 'Noodles',
    },
    {
      id: 9,
      image: '/images/recipes/9.jpg',
      title: 'Tasty Meat Skewers with Herbs',
      time: '25 Minutes',
      time_to_cook: '25 Minutes',
      main_ingredients: ['Beef', 'Bell Peppers', 'Onion'],
      category: 'Grill',
    },
  ];

  const router = useRouter();

  const { products } = useProducts();
  console.log('products:', products);

  const list = items && items.length ? items : products;

  const [likedMap, setLikedMap] = React.useState<Record<string | number, boolean>>({});
  const [page, setPage] = React.useState(1);
  const perPage = 6;

  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const pagedItems = list.slice((page - 1) * perPage, page * perPage) ?? list;

  const handleLike = (id: string | number) => {
    setLikedMap((m) => ({ ...m, [id]: !m[id] }));
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // detect desktop (md breakpoint) on client
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false);
  React.useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Products</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed do eiusmod tempor.
        </p>

        {isDesktop ? (
          // Desktop: grid layout (wrap to new lines)
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-4 gap-6">
              {pagedItems.map((it: any) => (
                // <RecipeCard key={it.id} item={{ ...it, liked: !!likedMap[it.id] }} onLike={() => handleLike(it.id)} />
                <ProductCard
                  key={it._id || it.id}
                  item={{ ...it, liked: !!likedMap[it._id || it.id] }}
                  onLike={(id) => handleLike(id)}
                  onClick={(id) => router.push(`/products/${id}`)} // optional
                />
              ))}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <Pagination page={page} goPrev={goPrev} goNext={goNext} setPage={setPage} totalPages={totalPages} />
            )}
          </>
        ) : (
          // Mobile: horizontal scroll of cards
          <>
            <div className="overflow-x-auto py-2 -mx-2">
              <div className="flex gap-4 px-2">
                {list.map((it: any) => (
                  <div key={it._id} className="min-w-[240px] flex-shrink-0">
                    {/* <RecipeCard item={{ ...it, liked: !!likedMap[it.id] }} onLike={() => handleLike(it.id)} /> */}
                    <ProductCard
                      key={it._id || it.id}
                      item={{ ...it, liked: !!likedMap[it._id || it.id] }}
                      onLike={(id) => handleLike(id)}
                      onClick={(id) => router.push(`/products/${id}`)} // optional
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* simple hint for mobile */}
            {list.length > 3 && (
              <div className="flex items-center justify-center mt-4 text-xs text-zinc-500">
                Swipe to see more recipes
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
