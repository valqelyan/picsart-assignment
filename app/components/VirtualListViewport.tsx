import React, { useMemo, useState } from "react";
import { useDebouncedResize } from "../hooks/useDebouncedResize";

type WithDimensions = {
  id: string | number;
  width: number;
  height: number;
};

export type VirtualizedComponentProps<T> = {
  className: string
  style: React.CSSProperties
  value: T
  index: number
}

type Props<T extends WithDimensions> = {
  list: T[];
  onPreComputeHeight: (item: T) => number
  component: (
    props: VirtualizedComponentProps<T>
  ) => React.ReactElement;
  overscanPixels?: number
  offset: number
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
  component: ComponentProps,
  onPreComputeHeight,
  overscanPixels = 300,
  offset,
}: Props<T>) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useDebouncedResize(() => {
    setWindowWidth(window.innerWidth);
  }, 100);

  const prefix = useMemo(() => {
    const arr: number[] = [];
    list.reduce((acc, item, i) => {
      arr[i] = acc + onPreComputeHeight(item);
      return arr[i];
    }, 0);
    return arr;
  }, [list, onPreComputeHeight, windowWidth]);

  const startIndex = findStartIndex(prefix, offset - overscanPixels);
  const endIndex = findEndIndex(prefix, offset, window.innerHeight + overscanPixels)

  let visibleChildren = []

  for (let i = startIndex; i < endIndex + 1; i++) {
    const item = list[i]

    const height = onPreComputeHeight(item)

    visibleChildren.push(
      <ComponentProps
        key={item.id}
        className='w-full absolute'
        value={item}
        index={i}
        style={{
          height,
          top:
            (prefix[i] ?? 0) - height,
        }}
      />
    )
  }

  const totalHeight = prefix.at(-1) ?? 0

  return (
    <div className='relative' style={{ height: `${totalHeight}px` }}>
      {visibleChildren}
    </div>
  );
}
