import { useQuery } from '@tanstack/react-query';
import { getWines } from '@/services/api';

export const useWines = () => {
  return useQuery({
    queryKey: ['wines'],
    queryFn: getWines,
  });
};
