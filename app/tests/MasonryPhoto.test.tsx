import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MasonryPhoto } from '../components/MasonryPhoto';
import { describe, it, expect } from "vitest";
import type { Photo } from '~/types/photo';

const mockPhoto: Photo = {
  id: 34611213,
  width: 3376,
  height: 6000,
  url: "https://www.pexels.com/photo/close-up-portrait-with-bold-makeup-34611213/",
  photographer: "Ailín  Policano",
  photographer_url: "https://www.pexels.com/@ailin-policano-2150264477",
  photographer_id: 2150264477,
  avg_color: "#7C6F5F",
  src: {
    original: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg",
    large2x: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    large: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    medium: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&h=350",
    small: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&h=130",
    portrait: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    landscape: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    tiny: "https://images.pexels.com/photos/34611213/pexels-photo-34611213.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
  },
  liked: false,
  alt: "Close-up of a woman with striking makeup and vivid lips, artistic style."
};

describe('MasonryPhoto', () => {
  it('renders photo and link correctly', () => {
    render(
      <MemoryRouter>
        <MasonryPhoto
          loading={false}
          value={mockPhoto}
          style={{ position: 'relative' }}
          className="my-class"
          index={0}
        />
      </MemoryRouter>
    );

    const img = screen.getByAltText(mockPhoto.alt);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockPhoto.src.medium);

    const link = screen.getByRole('link', { name: `View photo ${mockPhoto.id}` });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/photo/${mockPhoto.id}`);
  });
});
