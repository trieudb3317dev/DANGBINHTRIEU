import { useQuery } from '@tanstack/react-query';
import usePublic from './usePublic';

export const useProducts = () => {
  const apiUrl = usePublic();
  const {
    data: products = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/v1/products?page=1&limit=100`);
      return res.json().then((data) => data.data || []);
    },
  });

  return { products, loading, refetch };
};
