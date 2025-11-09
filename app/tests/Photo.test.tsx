import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Photo } from "../components/Photo";

describe("Photo component", () => {
  const src = "https://example.com/image.jpg";
  const alt = "Example Image";

  it("renders an img with correct src and alt", () => {
    render(<Photo>
      <img src={src} alt={alt} />
    </Photo>);
    const img = screen.getByAltText(alt);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", src);
  });

  it("passes extra className and other props to figure", () => {
    render(<Photo className="custom-class" data-testid="photo" />);
    const figure = screen.getByTestId("photo");
    expect(figure).toHaveClass("custom-class");
    expect(figure.tagName).toBe("FIGURE");
  });

  it("does not render loading div when loading is false", () => {
    render(
      <Photo loading={false}>
        <span data-testid="child">Child Content</span>
      </Photo>
    );
    expect(screen.queryByLabelText("Loading content")).toBeNull();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders loading shimmer div when loading is true", () => {
    render(<Photo loading={true} />);
    const loadingDiv = screen.getByLabelText("Loading content");
    expect(loadingDiv).toBeInTheDocument();
    expect(loadingDiv).toHaveClass("shimmer");
  });
});
