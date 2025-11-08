import { Masonry, MasonryColumn } from '~/components/Masonry'
import { VirtualListViewport } from "~/components/VirtualListViewport";
import { useWindowScroll, useDebounce } from "@uidotdev/usehooks";
import { Loading } from "~/components/Loading";
import { MasonryPhoto } from "~/components/MasonryPhoto";
import { usePhotosInfiniteQuery } from "~/hooks/usePhotosInfiniteQuery";
import { useSearchParams } from "react-router";

export default function Home() {
  const [{ y }] = useWindowScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, isLoading, fetchNextPage, error } = usePhotosInfiniteQuery(debouncedSearchTerm)

  const photos = data?.pages.map(value => value.photos).flat()

  return (<div>
    <input
      type="text"
      style={{ padding: 10, fontSize: 32, width: '100%' }}
      placeholder="Search..."
      value={q}
      onChange={(e) => {
        setSearchParams({ q: e.target.value })
      }}
    />

    {isLoading && <Loading />}

    {(!error && photos) && <Masonry photos={photos}>
      {(photoColumns, columns) => photoColumns.map((columnPhotos, index) => (
        <MasonryColumn key={index} onLazy={fetchNextPage}>
          <VirtualListViewport
            list={columnPhotos}
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
    </Masonry>}
  </div>)
}
