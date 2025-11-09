import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhotoDetails } from "../components/PhotoDetails";

describe("PhotoDetails component", () => {
  it("renders photographer name in heading", () => {
    render(<PhotoDetails photographer="John Doe" src="test.jpg" />);
    const heading = screen.getByRole("heading", { name: "John Doe" });
    expect(heading).toBeInTheDocument();
  });

  it("renders paragraph with 'by photographer'", () => {
    render(<PhotoDetails photographer="John Doe" src="test.jpg" />);
    const paragraph = screen.getByText("by John Doe");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.tagName).toBe("P");
  });

  it("renders image with correct src and alt", () => {
    render(<PhotoDetails photographer="John Doe" src="test.jpg" />);
    const img = screen.getByAltText("John Doe") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test.jpg");
  });

  it("renders loading shimmer with correct a11y attributes when loading=true", () => {
    render(<PhotoDetails loading={true} photographer="John Doe" src="test.jpg" />);

    const region = screen.getByRole("region", { name: /photo details for john doe/i });
    expect(region).toHaveAttribute("aria-busy", "true");
    expect(region).toHaveAttribute("aria-live", "polite");

    const shimmer = screen.getByRole("status", { name: /loading photo details/i });
    expect(shimmer).toBeInTheDocument();

    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.queryByText(/by john doe/i)).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
  });
});
