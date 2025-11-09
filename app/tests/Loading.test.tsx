import { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingPhoto } from "~/components/Loading";

describe("LoadingPhoto", () => {
  it("assigns the ref to the outer div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<LoadingPhoto ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.classList.contains("p-2.5")).toBe(true);
  });
});
