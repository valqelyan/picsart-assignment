import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as api from "~/api/photos";
import { createQueryClientWrapper } from "../test-utils/queryClientWrapper";
import { usePhotoQuery } from "~/hooks/usePhotoQuery";

const wrapper = createQueryClientWrapper();

describe("usePhotoQuery", () => {
  it("calls fetchPhotoById and returns data when photoId is valid", async () => {
    const mockPhoto = { id: 1, url: "test.jpg", photographer: "John Doe" };
    const fetchMock = vi.spyOn(api, "fetchPhotoById").mockResolvedValue(mockPhoto);

    const { result } = renderHook(() => usePhotoQuery(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockPhoto);

    fetchMock.mockRestore();
  });
});
