import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhotoDetails } from "../components/PhotoDetails";

describe("PhotoDetails component", () => {
  it("renders photographer name in heading", () => {
    render(<PhotoDetails photographer="John Doe" src="test.jpg" />);
    const heading = screen.getByRole("heading", { name: "John Doe" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle({
      fontFamily: `"Playfair Display", serif`,
      fontSize: "32px",
    });
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
    screen.debug(img)
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test.jpg");
  });
});
