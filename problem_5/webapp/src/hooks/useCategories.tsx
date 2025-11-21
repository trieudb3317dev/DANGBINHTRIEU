import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import usePublic from './usePublic';

export const useCategories = () => {
  // Implement category fetching logic here using React Query or any data fetching library
  // Fetch the post with Get method
  const apiUrl = usePublic();
  const {
    data: categories = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/v1/categories?page=1&limit=100`);
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      return res.json().then((data) => data.data || []);
    },
  });

  return { categories, loading, refetch };
};
