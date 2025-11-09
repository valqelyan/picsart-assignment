import { Masonry, MasonryColumn } from '~/components/Masonry'
import { VirtualListViewport } from "~/components/VirtualListViewport";
import { useWindowScroll, useDebounce } from "@uidotdev/usehooks";
import { MasonryPhoto } from "~/components/MasonryPhoto";
import { usePhotosInfiniteQuery } from "~/hooks/usePhotosInfiniteQuery";
import { useSearchParams } from "react-router";
import { loadingData } from '~/api/photos';

export default function Home() {
  const [{ y }] = useWindowScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, status, hasNextPage, isLoading, fetchNextPage } = usePhotosInfiniteQuery(debouncedSearchTerm, 20)

  const photos = data?.pages.map(value => value.photos).flat()

  return (<div>
    <input
      type="text"
      className='p-5 text-4xl w-full'
      placeholder="Search..."
      value={q}
      onChange={(e) => {
        setSearchParams({ q: e.target.value })
      }}
    />

    {status === 'success' && !photos?.length ? <h2 className='text-4xl p-5 font-playfair text-center text-[#999]'>
      ˙◠˙ We couldn’t find anything matching your search
    </h2> : ''}

    <Masonry photos={isLoading ? loadingData : photos ?? []} size={264}>
      {(photoColumns, columns) => photoColumns.map((columnPhotos, index) => (
        <MasonryColumn key={index} lazyLoad={hasNextPage} onLazy={() => {
          fetchNextPage()
        }}>
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
  </div >)
}
