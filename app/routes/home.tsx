import { Masonry, MasonryColumn } from '~/components/Masonry'
import { VirtualListViewport } from "~/components/VirtualListViewport";
import { useWindowScroll, useDebounce } from "@uidotdev/usehooks";
import { MasonryPhoto } from "~/components/MasonryPhoto";
import { usePhotosInfiniteQuery } from "~/hooks/usePhotosInfiniteQuery";
import { useSearchParams } from "react-router";
import { loadingData } from '~/api/photos';
import { useCallback, useMemo, useRef, useState } from 'react';

const COL_SIZE = 264

export default function Home() {
  const [{ y }] = useWindowScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isSuccess, isError, hasNextPage, isLoading, fetchNextPage } = usePhotosInfiniteQuery(debouncedSearchTerm, 20)
  const photos = useMemo(() => data?.pages.map(value => value.photos).flat(), [data])

  const debounceRequests = useRef(false);

  const onLazyLoad = useCallback(() => {
    if (!debounceRequests.current) {
      fetchNextPage().then(() => {
        debounceRequests.current = false;
      });
      debounceRequests.current = true;
    }
  }, [fetchNextPage]);

  return (<div>
    <input
      type="text"
      className='p-5 text-4xl w-full'
      placeholder="Search..."
      name='search'
      autoComplete='off'
      aria-label="Search photos"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value)
        setSearchParams({ q: e.target.value })
      }}
    />

    {isError ? <h2 className='text-4xl p-5 font-playfair text-center text-[#999]'>
      Something went wrong. Please try again.
    </h2> : ''}

    {isSuccess && !photos?.length ? <h2 className='text-4xl p-5 font-playfair text-center text-[#999]'>
      ˙◠˙ We couldn’t find anything matching your search
    </h2> : ''}

    <Masonry photos={isLoading ? loadingData : photos ?? []} size={COL_SIZE}>
      {(photoColumns, columns) => photoColumns.map((columnPhotos, index) => (
        <MasonryColumn key={index} lazyLoad={hasNextPage} onLazy={onLazyLoad} size={COL_SIZE}>
          <VirtualListViewport
            list={columnPhotos}
            loading={isLoading}
            component={MasonryPhoto}
            onPreComputeHeight={(item) => {
              const aspectRatio = item.height / item.width;
              const columnWidth = Math.floor(window.innerWidth / columns)
              const scaledHeight = columnWidth * aspectRatio;

              return scaledHeight
            }}
            offset={y ?? 0}
          />
        </MasonryColumn>
      ))}
    </Masonry>
  </div>)
}
