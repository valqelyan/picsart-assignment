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

const getRelativeImageHeight = (image, targetWidth) => {
  const { width, height } = image
  const widthQuotient = targetWidth / width
  const relativeHeight = widthQuotient * height

  return relativeHeight
}

function generateImageColumns(photos, columnCount) {
  const columnHeights = Array(columnCount).fill(0)
  const columns = [...Array(columnCount)].map(() => [])

  photos.forEach(photo => {
    const smallestHeight = Math.min(...columnHeights)
    const indexOfSmallestHeight = columnHeights.indexOf(
      Math.min(...columnHeights)
    )

    const smallestColumn = columns[indexOfSmallestHeight]
    smallestColumn.push(photo)

    const height = getRelativeImageHeight(photo, 200)

    columnHeights[indexOfSmallestHeight] = smallestHeight + height
  })

  return columns
}

export function MasonryColumn({ photos, children, onLazy }) {
  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (inView) {
      onLazy()
    }

  }, [inView])

  return <div style={{ flex: '1 1 200px', gap: 0, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
    {children}
    <LoadingPhoto ref={ref} />
  </div>
}

export function Masonry({ photos, children }) {
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

  return <div style={{
    display: 'flex',
    gap: 0,
    justifyContent: 'center',
    flexWrap: 'nowrap',
    overflowX: 'clip'
  }}>
    {children(imageColumns, columnCount)}
  </div>
}

