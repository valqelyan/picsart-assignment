import React, { useMemo, type ReactNode } from "react";

type WithDimensions = {
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
  const prefix = useMemo(() => {
    const arr: number[] = [];
    list.reduce((acc, item, i) => {
      arr[i] = onPreComputeHeight ? acc + onPreComputeHeight(item) : acc;
      return arr[i];
    }, 0);
    return arr;
  }, [list, onPreComputeHeight]);

  const startIndex = findStartIndex(prefix, offset - overscanPixels);
  const endIndex = findEndIndex(prefix, offset, window.innerHeight + overscanPixels)

  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(startIndex, endIndex + 1);

  const passedHeight = startIndex === 0 ? 0 : prefix[startIndex - 1];

  return (
    <div style={{ position: "relative", height: `${prefix.at(-1) ?? 0}px` }}>
      {list.slice(startIndex, endIndex + 1).map((photo, index) => {
        return (
          <div
            key={photo.id}
            style={{
              position: "absolute",
              width: '100%',
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
