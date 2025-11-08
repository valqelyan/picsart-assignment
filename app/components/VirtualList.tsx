import React, { useMemo, useState, type ReactNode } from "react";
import { useDebouncedResize } from "~/hooks/useDebouncedResize";

type WithDimensions = {
  id: string | number;
  width: number;
  height: number;
};

type Props<T extends WithDimensions> = {
  list: T[];
  onPreComputeHeight: (item: T) => number;
  overscanPixels?: number;
  children: ReactNode;
  offset: number;
};

function findStartIndex(prefix: number[], offset: number): number {
  let low = 0,
    high = prefix.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (prefix[mid] < offset) low = mid + 1;
    else high = mid;
  }
  return low;
}

function findEndIndex(
  prefix: number[],
  offset: number,
  windowHeight: number,
): number {
  const limit = offset + windowHeight;
  let low = 0,
    high = prefix.length - 1;
  let result = -1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    const top = mid === 0 ? 0 : prefix[mid - 1];

    if (top < limit) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

export function VirtualListViewport<T extends WithDimensions>({
  list,
  onPreComputeHeight,
  overscanPixels = 300,
  children,
  offset,
}: Props<T>) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useDebouncedResize(() => {
    setWindowWidth(window.innerWidth);
  }, 100);

  const prefix = useMemo(() => {
    const arr: number[] = [];
    list.reduce((acc, item, i) => {
      arr[i] = onPreComputeHeight ? acc + onPreComputeHeight(item) : acc;
      return arr[i];
    }, 0);
    return arr;
  }, [list, onPreComputeHeight, windowWidth]);

  const startIndex = findStartIndex(prefix, offset - overscanPixels);
  const endIndex = findEndIndex(prefix, offset, window.innerHeight + overscanPixels)

  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(startIndex, endIndex + 1);

  const totalHeight = prefix.at(-1) ?? 0

  return (
    <div className='relative' style={{ height: `${totalHeight}px` }}>
      {list.slice(startIndex, endIndex + 1).map((photo, index) => {
        return (
          <div
            key={photo.id}
            className='absolute w-full'
            style={{
              height: onPreComputeHeight(photo),
              top:
                (prefix[startIndex + index] ?? 0) - onPreComputeHeight(photo),
            }}
          >
            {visibleChildren[index]}
          </div>
        );
      })}
    </div>
  );
}
