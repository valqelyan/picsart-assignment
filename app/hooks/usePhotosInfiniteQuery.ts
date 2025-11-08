import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchCuratedPhotos } from '~/api/photos';
import type { PexelsResponse } from '~/types/photo';

export function usePhotosInfiniteQuery(debouncedSearchTerm: string) {
  return useInfiniteQuery<PexelsResponse>({
    queryKey: ['pexelsCuratedPhotos', debouncedSearchTerm],
    queryFn: ({ pageParam = null }) => fetchCuratedPhotos(pageParam, debouncedSearchTerm),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  });
}
