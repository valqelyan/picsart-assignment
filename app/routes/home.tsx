import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router";
import { Masonry, MasonryColumn } from '~/components/Masonry'
import { Photo } from '~/components/Photo'
import { VirtualListViewport } from "~/components/VirtualList";
import { useDebounce } from "@uidotdev/usehooks";
import { Loading } from "~/components/Loading";
import type { PexelsResponse } from "~/types/photo";

const PEXELS_API_KEY = "pdrmAIgN3EAQTZ7zrnWiLdXhQ2pcuIQUSj3pYQKWQaJ4Nd6p84SnjNZa";

async function fetchCuratedPhotos(url?: string, searchTerm?: string) {
  const endpoint = url
    ? url
    : searchTerm
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=15`
      : `https://api.pexels.com/v1/curated?page=1&per_page=15`;

  const res = await fetch(endpoint, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch photos");

  const data = await res.json();
  return data;
}

function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // window exists here safely
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial scroll position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

export default function Home() {
  const [searchTerm, setTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading, fetchNextPage, error } = useInfiniteQuery<PexelsResponse>({
    queryKey: ["pexelsCuratedPhotos", debouncedSearchTerm],
    queryFn: ({ pageParam = null }) => fetchCuratedPhotos(pageParam, debouncedSearchTerm),
    getNextPageParam: (lastPage) => {
      return lastPage.next_page
    },
  });

  const { ref: inViewRef, inView } = useInView()

  const scrollY = useScrollPosition();

  const photos = data?.pages.map(value => value.photos).flat()

  return (<div>
    <input
      type="text"
      style={{ padding: 10, fontSize: 32, width: '100%' }}
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => {
        setTerm(e.target.value)
      }}
    />

    {isLoading && <Loading />}

    {(!error) && <Masonry photos={photos}>
      {(photoColumns, columns) => photoColumns.map((columnPhotos, index) => (
        <MasonryColumn key={index} photos={columnPhotos} onLazy={fetchNextPage}>
          <VirtualListViewport
            list={columnPhotos}
            onPreComputeHeight={(item) => {
              const aspectRatio = item.height / item.width;
              const columnWidth = Math.floor(window.innerWidth / columns)
              const scaledHeight = columnWidth * aspectRatio;

              return scaledHeight
            }}
            offset={scrollY}
          >
            {columnPhotos.map(photo => (
              <Photo
                key={photo.id}
                smallSrc={photo.src.tiny}
                color={photo.avg_color}
                src={photo.src.medium}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
              >
                <Link
                  to={`/photo/${photo.id}`}
                  aria-label={`View photo ${photo.id}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    zIndex: 3,
                  }} />
              </Photo>
            ))}
          </VirtualListViewport>

        </MasonryColumn>
      ))}
    </Masonry>}
  </div>)
}
