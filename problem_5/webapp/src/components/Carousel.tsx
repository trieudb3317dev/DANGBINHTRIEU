'use client';

import React from 'react';
import Banner from './Banner';

type Slide = {
  id: string | number;
  title?: string;
  description?: string;
  image?: string;
  time_to_cook?: string;
  main_ingredients?: string[];
  created_by?: number;
};

export default function Carousel({
  slides = [
    {
      id: 1,
      title: 'Spicy delicious chicken wings',
      description:
        'Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim ',
      image: '/images/auth-left.jpg',
	  time_to_cook: '30 Minutes',
	  main_ingredients: ['Chicken', 'Spices', 'Oil'],
	  created_by: 1,
    },
    {
      id: 2,
      title: 'Spicy delicious chicken wings',
      description:
        'Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim ',
      image: '/images/auth-left.jpg',
	  time_to_cook: '30 Minutes',
	  main_ingredients: ['Chicken', 'Spices', 'Oil'],
	  created_by: 1,
    },
    {
      id: 3,
      title: 'Spicy delicious chicken wings',
      description:
        'Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim ',
      image: '/images/auth-left.jpg',
	  time_to_cook: '30 Minutes',
	  main_ingredients: ['Chicken', 'Spices', 'Oil'],
	  created_by: 1,
    },
  ],
  interval = 4500,
}: {
  slides?: Slide[];
  interval?: number;
}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        {/* only render current slide's Banner to keep DOM small */}
        <Banner bannerItem={slides[index]} />
      </div>

      {/* controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button onClick={prev} className="bg-white/90 dark:bg-black/70 p-2 rounded-full shadow">
          ←
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button onClick={next} className="bg-white/90 dark:bg-black/70 p-2 rounded-full shadow">
          →
        </button>
      </div>

      {/* dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-8 rounded-full transition-all ${
              i === index ? 'bg-black dark:bg-white scale-110' : 'bg-black/20 dark:bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
