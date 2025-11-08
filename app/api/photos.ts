import type { Photo } from "~/types/photo";

const headers = {
  headers: {
    Authorization: import.meta.env.VITE_PEXELS_API,
  },
}

export async function fetchPhotoById(photoId: string | number) {
  const res = await fetch(`https://api.pexels.com/v1/photos/${photoId}`, headers);

  if (!res.ok) throw new Error("Failed to fetch photo");

  return res.json();
}

export async function fetchCuratedPhotos(url?: string, searchTerm?: string) {
  const endpoint = url
    ? url
    : searchTerm
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=15`
      : `https://api.pexels.com/v1/curated?page=1&per_page=15`;

  const res = await fetch(endpoint, headers);

  if (!res.ok) throw new Error("Failed to fetch photos");

  const data = await res.json();
  return data;
}
