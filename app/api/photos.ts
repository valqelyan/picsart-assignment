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

export async function fetchCuratedPhotos(url?: string, searchTerm?: string, perPage?: number) {
  const pageSize = perPage || 15
  const endpoint = url
    ? url
    : searchTerm
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=${pageSize}`
      : `https://api.pexels.com/v1/curated?page=1&per_page=${pageSize}`;

  const res = await fetch(endpoint, headers);

  if (!res.ok) throw new Error("Failed to fetch photos");

  const data = await res.json();
  return data;
}


const fakeBase = [{ "id": 34622874, "width": 2736, "height": 3648 }, { "id": 34574841, "width": 4000, "height": 6000 }, { "id": 34613802, "width": 4000, "height": 6000 }, { "id": 34612816, "width": 1969, "height": 2954 }, { "id": 34611213, "width": 3376, "height": 6000 }, { "id": 34599531, "width": 3305, "height": 4958 }, { "id": 34587762, "width": 7952, "height": 5304 }, { "id": 34600302, "width": 2198, "height": 4000 }, { "id": 34591910, "width": 4000, "height": 6000 }, { "id": 34585631, "width": 2656, "height": 3984 }, { "id": 34578393, "width": 2457, "height": 3071 }, { "id": 34564957, "width": 5766, "height": 8675 }, { "id": 34563097, "width": 2463, "height": 4000 }, { "id": 34578076, "width": 3648, "height": 5472 }, { "id": 34578083, "width": 3547, "height": 5321 }]

export const loadingData: Photo[] = fakeBase.map(p => ({
  ...p,
  url: "",
  photographer: "",
  photographer_url: "",
  photographer_id: 0,
  avg_color: "#000000",
  liked: false,
  alt: "",
  src: {
    original: "",
    large2x: "",
    large: "",
    medium: "",
    small: "",
    portrait: "",
    landscape: "",
    tiny: "",
  },
}));
