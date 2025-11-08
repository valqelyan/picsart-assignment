import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Photo } from "../components/Photo";

describe("Photo component", () => {
  it("renders image with correct src and alt", () => {
    render(<Photo src="test.jpg" alt="test image" />);
    const img = screen.getByAltText("test image") as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test.jpg");
  });

  it("applies provided width and height", () => {
    render(
      <Photo
        src="test.jpg"
        alt="test image"
        width={200}
        height={100}
      />
    );
    const img = screen.getByAltText("test image");

    expect(img).toHaveAttribute("width", "200");
    expect(img).toHaveAttribute("height", "100");
  });

  it("applies background color and border radius", () => {
    render(
      <Photo
        src="test.jpg"
        alt="test image"
        color="red"
      />
    );
    const img = screen.getByAltText("test image");
    expect(img).toHaveStyle({
      backgroundColor: "red",
      borderRadius: "16px",
    });
  });

  it("renders children correctly", () => {
    render(
      <Photo src="test.jpg" alt="test image">
        <span>Child Text</span>
      </Photo>
    );
    expect(screen.getByText("Child Text")).toBeInTheDocument();
  });
});
