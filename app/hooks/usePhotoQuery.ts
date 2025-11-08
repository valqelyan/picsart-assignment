import { useQuery } from '@tanstack/react-query';
import { fetchPhotoById } from '~/api/photos';

export function usePhotoQuery(photoId: number | string) {
  return useQuery({
    queryKey: ['photo', photoId],
    queryFn: () => fetchPhotoById(photoId),
    enabled: !!photoId,
  });
}
