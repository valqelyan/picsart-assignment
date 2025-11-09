import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as api from "~/api/photos";
import { usePhotosInfiniteQuery } from "~/hooks/usePhotosInfiniteQuery";
import { createQueryClientWrapper } from "../test-utils/queryClientWrapper";

describe("usePhotosInfiniteQuery", () => {
  const wrapper = createQueryClientWrapper();

  it("fetches initial page and returns data", async () => {
    const mockResponse = {
      page: 1,
      per_page: 10,
      photos: [{ id: 1, src: { original: "url1" } }],
      next_page: "nextPageToken",
      total_results: 100,
    };

    const fetchMock = vi
      .spyOn(api, "fetchCuratedPhotos")
      .mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePhotosInfiniteQuery("cats", 10), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(null, "cats", 10);
    expect(result.current.data?.pages[0]).toEqual(mockResponse);

    fetchMock.mockRestore();
  });
});
