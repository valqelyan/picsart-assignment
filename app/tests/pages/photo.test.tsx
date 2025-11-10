import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import PhotoPage from '~/routes/photo';

vi.mock('~/hooks/usePhotoQuery', () => ({
  usePhotoQuery: vi.fn(),
}));

// Create the mock at the top level so vi.mock can reference it
const mockedUsedNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

import { usePhotoQuery } from '~/hooks/usePhotoQuery';

describe('PhotoPage', () => {
  it('renders photo details and handles back button', () => {
    (usePhotoQuery as any).mockReturnValue({
      data: {
        photographer: 'Test Photographer',
        src: { large: 'test-photo.jpg' },
      },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={['/photo/123']}>
        <Routes>
          <Route path="/photo/:photoId" element={<PhotoPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Photographer')).toBeInTheDocument();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test-photo.jpg');

    const backBtn = screen.getByRole('button', { name: /go back/i });
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
  });

  it('renders error message on error', () => {
    (usePhotoQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(
      <MemoryRouter initialEntries={['/photo/123']}>
        <Routes>
          <Route path="/photo/:photoId" element={<PhotoPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls navigate("/") if history.length <= 1', () => {
    (usePhotoQuery as any).mockReturnValue({
      data: {
        photographer: 'Test Photographer',
        src: { large: 'test-photo.jpg' },
      },
      isLoading: false,
      isError: false,
    });

    mockedUsedNavigate.mockReset();

    Object.defineProperty(window.history, 'length', { value: 1, configurable: true });

    render(
      <MemoryRouter initialEntries={['/photo/123']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/photo/:photoId" element={<PhotoPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/', { viewTransition: true });
  });

  it('calls navigate(-1) if history.length > 1', () => {
    (usePhotoQuery as any).mockReturnValue({
      data: {
        photographer: 'Test Photographer',
        src: { large: 'test-photo.jpg' },
      },
      isLoading: false,
      isError: false,
    });

    mockedUsedNavigate.mockReset();

    Object.defineProperty(window.history, 'length', { value: 2, configurable: true });

    render(
      <MemoryRouter initialEntries={['/photo/123']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/photo/:photoId" element={<PhotoPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));

    expect(mockedUsedNavigate).toHaveBeenCalledWith(-1);
  });
});
