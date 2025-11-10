import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchCuratedPhotos } from '~/api/photos'
import type { PexelsResponse } from '~/types/photo'

export function usePhotosInfiniteQuery(debouncedSearchTerm: string, perPage: number) {
  return useInfiniteQuery<PexelsResponse>({
    queryKey: ['pexelsCuratedPhotos', debouncedSearchTerm],
    queryFn: ({ pageParam }) =>
      fetchCuratedPhotos(pageParam as string | undefined, debouncedSearchTerm, perPage),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
  })
}
