import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { Masonry, MasonryColumn, generateImageColumns, getRelativeImageHeight } from "../components/Masonry";

describe("Masonry utility functions", () => {
  const photos = [
    { width: 100, height: 200 },
    { width: 100, height: 100 },
    { width: 100, height: 300 },
  ];

  it("calculates relative image height correctly", () => {
    expect(getRelativeImageHeight({ width: 100, height: 200 }, 50)).toBe(100);
    expect(getRelativeImageHeight({ width: 200, height: 100 }, 100)).toBe(50);
  });

  it("generates columns distributing photos to balance column height", () => {
    const columns = generateImageColumns(photos, 2);
    expect(columns.length).toBe(2);

    const flattened = columns.flat();
    expect(flattened).toEqual(expect.arrayContaining(photos));
  });
});

vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: true,  // simulate element is visible
  }),
}));

describe("MasonryColumn component", () => {
  it("calls onLazy when the element is visible (inView=true)", () => {
    const onLazy = vi.fn();

    render(
      <MasonryColumn photos={[]} onLazy={onLazy}>
        <div data-testid="child">Child content</div>
      </MasonryColumn>
    );

    expect(onLazy).toHaveBeenCalled();
  });
});

describe("Masonry component", () => {
  const photos = [
    { width: 100, height: 200 },
    { width: 100, height: 100 },
    { width: 100, height: 300 },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the correct number of columns initially", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800, // so 800/200 = 4 columns expected
    });

    render(
      <Masonry photos={photos}>
        {(imageColumns, columnCount) => (
          <>
            {imageColumns.map((column, i) => (
              <div key={i} data-testid="masonry-column" />
            ))}
            <div data-testid="column-count">{columnCount}</div>
          </>
        )}
      </Masonry>
    );

    const columns = screen.getAllByTestId("masonry-column");
    const count = Number(screen.getByTestId("column-count").textContent);

    expect(columns.length).toBe(count);
    expect(count).toBe(4); // Expected columns based on window.innerWidth
  });


  it("updates column count when window is resized", () => {
    // Set initial width to 600 => Math.round(600/200) = 3 columns
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 600,
    });

    render(
      <Masonry photos={photos}>
        {(imageColumns, columnCount) => (
          <div data-testid="column-count">{columnCount}</div>
        )}
      </Masonry>
    );

    expect(Number(screen.getByTestId("column-count").textContent)).toBe(3);

    act(() => {
      // Change width to 400 => 2 columns expected
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("resize"));

      // Advance timers to trigger debounce (your debounce is 100ms)
      vi.advanceTimersByTime(150);
    });

    expect(Number(screen.getByTestId("column-count").textContent)).toBe(2);
  });
});
