import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedResize } from "../hooks/useDebouncedResize";
import { LoadingPhoto } from "./Loading";

export function getColumns(fixedSize: number) {
  return Math.round(window.innerWidth / fixedSize)
}

type ImageWithSize = {
  width: number;
  height: number;
};

export function getRelativeImageHeight(image: ImageWithSize, targetWidth: number): number {
  const { width, height } = image;
  const widthQuotient = targetWidth / width;
  const relativeHeight = widthQuotient * height;
  return relativeHeight;
};

export function generateImageColumns<T extends ImageWithSize>(
  photos: T[],
  columnCount: number,
  columnSize: number,
): T[][] {
  const columnHeights = Array(columnCount).fill(0);
  const columns: T[][] = Array.from({ length: columnCount }, () => []);

  photos.forEach(photo => {
    const smallestHeight = Math.min(...columnHeights);
    const indexOfSmallestHeight = columnHeights.indexOf(smallestHeight);

    columns[indexOfSmallestHeight].push(photo);

    const height = getRelativeImageHeight(photo, columnSize);
    columnHeights[indexOfSmallestHeight] = smallestHeight + height;
  });

  return columns;
}

type MasonryColumnProps = {
  children?: React.ReactNode;
  lazyLoad?: boolean
  onLazy: () => void;
};

export function MasonryColumn({ children, lazyLoad, onLazy }: MasonryColumnProps) {
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
    {lazyLoad && <LoadingPhoto ref={ref} />}
  </div>
}

type MasonryProps<T extends ImageWithSize> = {
  photos: T[];
  size: number
  children: (imageColumns: T[][], columnCount: number) => React.ReactNode;
};

export function Masonry<T extends ImageWithSize>({ photos, size, children }: MasonryProps<T>) {
  const [columnCount, setColumnCount] = useState(getColumns(size))

  const setBodyWidth = () => {
    document.body.style.setProperty('width', `${window.innerWidth}px`);
    document.body.style.setProperty('overflow-x', 'hidden');
  };

  useDebouncedResize(() => {
    setColumnCount(getColumns(size));
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
    return generateImageColumns(photos, columnCount, size)
  }, [photos, columnCount, size])

  return <div
    className='flex justify-center flex-nowrap overflow-x-clip'
  >
    {children(imageColumns, columnCount)}
  </div>
}

