import { Photo } from '~/components/Photo'
import { Link } from "react-router";
import { type VirtualizedComponentProps } from '~/components/VirtualListViewport'
import type { Photo as PhotoAPI } from '~/types/photo';

export function MasonryPhoto({ value: photo, index, style, loading, className }: VirtualizedComponentProps<PhotoAPI>) {
  const color = photo.avg_color
  return (
    <Photo
      loading={loading}
      key={photo.id}
      style={style}
      className={className}
    >
      <img
        src={photo.src?.medium}
        alt={photo.alt}
        className="object-cover rounded-2xl w-full h-full"
        width={photo.width}
        height={photo.height}
        style={color ? { backgroundColor: color } : undefined}
        {...(index < 5 ? { fetchPriority: 'high' } : {})}
      />

      <Link
        viewTransition
        to={`/photo/${photo.id}`}
        aria-label={`View photo ${photo.id}`}
        className='w-full h-full top-0 left-0 absolute z-3'
      />
    </Photo>)
}
