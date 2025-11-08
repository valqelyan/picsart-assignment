import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { VirtualListViewport } from "~/components/VirtualListViewport";
import { getColumns } from "~/components/Masonry";

type Item = {
  id: string;
  width: number;
  height: number;
  src: string;
  alt: string;
};

const TestComponent = ({
  value,
  style,
}: {
  value: Item;
  style: React.CSSProperties;
  className: string;
  index: number;
}) => (
  <img
    src={value.src}
    alt={value.alt}
    style={style}
  />
);

describe("VirtualListViewport simple test", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 600,
    });
  });

  const items: Item[] = [
    { id: "1", width: 100, height: 100, src: "img1.jpg", alt: "Image 1" },
    { id: "2", width: 100, height: 120, src: "img2.jpg", alt: "Image 2" },
    { id: "3", width: 100, height: 140, src: "img3.jpg", alt: "Image 3" },
    { id: "4", width: 100, height: 160, src: "img4.jpg", alt: "Image 4" },
    { id: "5", width: 100, height: 180, src: "img5.jpg", alt: "Image 5" },
    { id: "6", width: 100, height: 200, src: "img6.jpg", alt: "Image 6" },
    { id: "7", width: 100, height: 220, src: "img7.jpg", alt: "Image 7" },
    { id: "8", width: 100, height: 240, src: "img8.jpg", alt: "Image 8" },
    { id: "9", width: 100, height: 260, src: "img9.jpg", alt: "Image 9" },
    { id: "10", width: 100, height: 280, src: "img10.jpg", alt: "Image 10" },
  ];

  const computeHeight = (item: Item) => item.height;

  it.skip("should render correctly with 300px default overscan pixels", () => {
    render(
      <VirtualListViewport
        list={items}
        onPreComputeHeight={computeHeight}
        component={TestComponent}
        offset={0}
      />
    );

    for (let i = 1; i <= 6; i++) {
      expect(screen.getByAltText(`Image ${i}`)).toBeInTheDocument();
    }

    for (let i = 7; i <= 10; i++) {
      expect(screen.queryByAltText(`Image ${i}`)).not.toBeInTheDocument();
    }
  });

  it.skip("should render correctly with 0 overscan pixels", () => {
    render(
      <VirtualListViewport
        list={items}
        onPreComputeHeight={computeHeight}
        component={TestComponent}
        offset={0}
        overscanPixels={0}
      />
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByAltText(`Image ${i}`)).toBeInTheDocument();
    }

    for (let i = 6; i <= 10; i++) {
      expect(screen.queryByAltText(`Image ${i}`)).not.toBeInTheDocument();
    }
  });

  it.skip("should render correct items when offset is 290px with 0 overscan", () => {
    // Calculate offset based on items' heights:
    // item 1 height = 100
    // item 2 height = 120
    // partial item 3 height ≈ 70 (half of 140)
    const offset = 100 + 120 + 70; // 290px

    render(
      <VirtualListViewport
        list={items}
        onPreComputeHeight={computeHeight}
        component={TestComponent}
        offset={offset}
        overscanPixels={0}
      />
    );


    // Items 3,4,5,6 should be visible
    for (let i = 3; i <= 6; i++) {
      expect(screen.getByAltText(`Image ${i}`)).toBeInTheDocument();
    }

    // Items 1,2 and 7-10 should NOT be visible
    [1, 2, 7, 8, 9, 10].forEach(i => {
      expect(screen.queryByAltText(`Image ${i}`)).not.toBeInTheDocument();
    });

    expect(screen.getByAltText('Image 3').style.top).toBe('220px');
  });

  it("recalculates image heights correctly on window width resize", async () => {
    const columnsBefore = getColumns();

    render(
      <VirtualListViewport
        list={items}
        onPreComputeHeight={(item) => {
          const aspectRatio = item.height / item.width;
          const columnWidth = Math.floor(window.innerWidth / columnsBefore);
          const scaledHeight = columnWidth * aspectRatio;
          return scaledHeight;
        }}
        component={TestComponent}
        overscanPixels={0}
        offset={0}
      />
    );

    const beforeHeights = screen.getAllByAltText(/Image/i).map(v => parseFloat(v.style.height));

    vi.useFakeTimers();

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 200,
      });
      window.dispatchEvent(new Event("resize"));

      vi.advanceTimersByTime(150);
    });

    vi.useRealTimers();

    await waitFor(() => {
      const afterHeights = screen.getAllByAltText(/Image/i).map(v => parseFloat(v.style.height));


      expect(afterHeights.length).toBeGreaterThan(beforeHeights.length)

      expect(beforeHeights.every((height, i) => height > afterHeights[i])).toBe(true);
    });
  });

  it('handles offset that skips first items', () => {
    const offset = 250;

    render(
      <VirtualListViewport
        list={items}
        onPreComputeHeight={computeHeight}
        component={TestComponent}
        offset={offset}
        overscanPixels={0}
      />
    );

    const images = screen.getAllByRole("img");
    // The first rendered image should not be the first item
    expect(images[0]).not.toHaveAttribute("src", items[0].src);
  });

  it('handles empty list gracefully', () => {
    const { container } = render(
      <VirtualListViewport
        list={[]}
        onPreComputeHeight={computeHeight}
        component={TestComponent}
        offset={0}
        overscanPixels={0}
      />
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
