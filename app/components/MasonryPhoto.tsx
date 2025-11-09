import { Photo } from '~/components/Photo'
import { Link } from "react-router";
import { type VirtualizedComponentProps } from '~/components/VirtualListViewport'
import type { Photo as PhotoAPI } from '~/types/photo';

export function MasonryPhoto({ value: photo, style, loading, className }: VirtualizedComponentProps<PhotoAPI>) {
  return (
    <Photo
      loading={loading}
      key={photo.id}
      color={photo.avg_color}
      src={photo.src?.medium}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      style={style}
      className={className}
    >
      <Link
        viewTransition
        to={`/photo/${photo.id}`}
        aria-label={`View photo ${photo.id}`}
        className='w-full h-full top-0 left-0 absolute z-3'
      />
    </Photo>)
}
