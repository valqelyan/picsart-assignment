import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCuratedPhotos } from '~/api/photos';
import type { PexelsResponse } from '~/types/photo';

export function usePhotosInfiniteQuery(debouncedSearchTerm: string, perPage: number) {
  return useInfiniteQuery<PexelsResponse>({
    queryKey: ['pexelsCuratedPhotos', debouncedSearchTerm],
    queryFn: ({ pageParam = null }) => fetchCuratedPhotos(pageParam, debouncedSearchTerm, perPage),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.next_page ?? undefined
    },
  });
}
