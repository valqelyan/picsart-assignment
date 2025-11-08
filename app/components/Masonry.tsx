import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedResize } from "~/hooks/useDebouncedResize";
import { LoadingPhoto } from "./Loading";

function getColumns() {
  if (typeof window === "undefined") {
    return 4
  }

  return Math.round(window.innerWidth / 200)
}

type ImageWithSize = {
  width: number;
  height: number;
};

const getRelativeImageHeight = (image: ImageWithSize, targetWidth: number): number => {
  const { width, height } = image;
  const widthQuotient = targetWidth / width;
  const relativeHeight = widthQuotient * height;
  return relativeHeight;
};

function generateImageColumns<T extends ImageWithSize>(
  photos: T[],
  columnCount: number
): T[][] {
  const columnHeights = Array(columnCount).fill(0);
  const columns: T[][] = Array.from({ length: columnCount }, () => []);

  photos.forEach(photo => {
    const smallestHeight = Math.min(...columnHeights);
    const indexOfSmallestHeight = columnHeights.indexOf(smallestHeight);

    columns[indexOfSmallestHeight].push(photo);

    const height = getRelativeImageHeight(photo, 200);
    columnHeights[indexOfSmallestHeight] = smallestHeight + height;
  });

  return columns;
}

type MasonryColumnProps<T extends ImageWithSize> = {
  photos: T[];
  children?: React.ReactNode;
  onLazy: () => void;
};

export function MasonryColumn<T extends ImageWithSize>({ photos, children, onLazy }: MasonryColumnProps<T>) {
  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (inView) {
      onLazy()
    }

  }, [inView])

  return <div
    className="flex flex-col grow shrink basis-[200px] min-w-0 gap-0"
  >
    {children}
    <LoadingPhoto ref={ref} />
  </div>
}

type MasonryProps<T extends ImageWithSize> = {
  photos: T[];
  children: (imageColumns: T[][], columnCount: number) => React.ReactNode;
};

export function Masonry<T extends ImageWithSize>({ photos, children }: MasonryProps<T>) {
  const [columnCount, setColumnCount] = useState(getColumns())

  const setBodyWidth = () => {
    document.body.style.setProperty('width', `${window.innerWidth}px`);
    document.body.style.setProperty('overflow-x', 'hidden');
  };

  useDebouncedResize(() => {
    setColumnCount(getColumns());
    setBodyWidth();
  }, 100);

  useEffect(() => {
    setBodyWidth();

    return () => {
      document.body.style.removeProperty('width');
      document.body.style.removeProperty('overflow-x');
    };
  }, []);

  const imageColumns = useMemo(() => {
    if (photos) {
      return generateImageColumns(photos, columnCount)
    }

    return []
  }, [photos, columnCount])

  return <div
    className='flex justify-center flex-nowrap overflow-x-clip'
  >
    {children(imageColumns, columnCount)}
  </div>
}

