'use client';

import Categories from '@/components/Categories';
import RecipesGrid from '@/components/RecipesGrid';
import RecipesSection from '@/components/RecipesSection';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-12 py-10 bg-zinc-50 font-sans dark:bg-black">
      <Categories />
      <RecipesGrid />
      <RecipesSection />
      <Contact />
    </div>
  );
}
