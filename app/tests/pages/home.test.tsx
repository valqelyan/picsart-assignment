import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import Home from '~/routes/home';

vi.mock('~/hooks/usePhotosInfiniteQuery', () => ({
  usePhotosInfiniteQuery: vi.fn(),
}));

import { usePhotosInfiniteQuery } from '~/hooks/usePhotosInfiniteQuery';

describe('Home', () => {
  const fetchNextPageMock = vi.fn();

  function renderWithRoute(initialEntries = ['/']) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('renders Masonry with loading data when loading', () => {
    (usePhotosInfiniteQuery as any).mockReturnValue({
      data: null,
      isSuccess: false,
      isError: false,
      isLoading: true,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderWithRoute();

    const loadingElements = screen.getAllByLabelText(/loading content/i);
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders error message when isError', () => {
    (usePhotosInfiniteQuery as any).mockReturnValue({
      data: null,
      isSuccess: false,
      isError: true,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });

    renderWithRoute();

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });


  it('loads and displays photos after typing', async () => {
    let queryState = {
      data: null,
      isSuccess: false,
      isError: false,
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: fetchNextPageMock,
    };

    (usePhotosInfiniteQuery as any).mockImplementation(() => queryState);

    renderWithRoute();

    const input = screen.getByLabelText('Search photos');

    queryState = {
      ...queryState,
      isLoading: true,
      data: null,
    };

    (usePhotosInfiniteQuery as any).mockImplementation(() => queryState);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'cats' } });
    });

    expect(screen.getAllByLabelText("Loading content").length).toBeGreaterThan(0);

    const response = {
      "page": 1,
      "per_page": 15,
      "photos": [
        {
          "id": 34622874,
          "width": 2736,
          "height": 3648,
          "url": "https://www.pexels.com/photo/black-and-white-aerial-view-of-fisherman-in-boat-34622874/",
          "photographer": "Anshu Kumar",
          "photographer_url": "https://www.pexels.com/@anshu-kumar-2148611331",
          "photographer_id": 2148611331,
          "avg_color": "#989898",
          "src": {
            "medium": "https://images.pexels.com/photos/34622874/pexels-photo-34622874.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350",
          },
          "liked": false,
          "alt": "Boat black and white"
        },
        {
          "id": 34574841,
          "width": 4000,
          "height": 6000,
          "url": "https://www.pexels.com/photo/close-up-of-blue-plumbago-flowers-in-chiba-garden-34574841/",
          "photographer": "C. M.",
          "photographer_url": "https://www.pexels.com/@c-m-336304177",
          "photographer_id": 336304177,
          "avg_color": "#24324C",
          "src": {
            "medium": "https://images.pexels.com/photos/34574841/pexels-photo-34574841.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350",
          },
          "liked": false,
          "alt": "Free stock photo of asia, autumn, blue"
        },
        {
          "id": 34578083,
          "width": 3547,
          "height": 5321,
          "url": "https://www.pexels.com/photo/abstract-shadows-on-building-facade-at-sunset-34578083/",
          "photographer": "Letícia Alvares",
          "photographer_url": "https://www.pexels.com/@leticia-alvares-1805702",
          "photographer_id": 1805702,
          "avg_color": "#835227",
          "src": {
            "medium": "https://images.pexels.com/photos/34578083/pexels-photo-34578083.jpeg?auto=compress\u0026cs=tinysrgb\u0026h=350",
          },
          "liked": false,
          "alt": "Free stock photo of cozy, shadow, sunlight"
        }
      ],
      "total_results": 8000,
      "next_page": "https://api.pexels.com/v1/curated?page=2\u0026per_page=15"
    }

    queryState = {
      ...queryState,
      isLoading: false,
      isSuccess: true,
      data: {
        pages: [
          response
        ],
      },
    };

    (usePhotosInfiniteQuery as any).mockImplementation(() => queryState);

    await waitFor(() => {
      response.photos.forEach(({ alt }) => {
        expect(screen.getByAltText(alt)).toBeInTheDocument();
      })
    });
  });
});
