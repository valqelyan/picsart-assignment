import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Photo } from "../components/Photo";

describe("Photo component", () => {
  const src = "https://example.com/image.jpg";
  const alt = "Example Image";

  it("renders an img with correct src and alt", () => {
    render(<Photo src={src} alt={alt} />);
    const img = screen.getByAltText(alt);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", src);
  });

  it("renders children inside the container", () => {
    render(
      <Photo src={src} alt={alt}>
        <span data-testid="child">Child</span>
      </Photo>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies width and height props to the img element", () => {
    render(<Photo src={src} alt={alt} width={300} height="200" />);
    const img = screen.getByAltText(alt);
    expect(img).toHaveAttribute("width", "300");
    expect(img).toHaveAttribute("height", "200");
  });

  it("applies backgroundColor style when color prop is provided", () => {
    render(<Photo src={src} alt={alt} color="red" />);
    const img = screen.getByAltText(alt);
    expect(img).toHaveStyle({ backgroundColor: "red" });
  });

  it("does not apply backgroundColor style when color prop is not provided", () => {
    render(<Photo src={src} alt={alt} />);
    const img = screen.getByAltText(alt);
    expect(img).not.toHaveStyle({ backgroundColor: "red" });
  });
});
