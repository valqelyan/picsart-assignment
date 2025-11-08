import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDebouncedResize } from '~/hooks/useDebouncedResize';

describe('useDebouncedResize', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls callback after debounce delay', () => {
    const callback = vi.fn();
    renderHook(() => useDebouncedResize(callback, 100));

    window.dispatchEvent(new Event('resize'));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('clears timeout and calls callback once for multiple quick resizes', () => {
    const callback = vi.fn();
    renderHook(() => useDebouncedResize(callback, 100));

    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('clears timeout on unmount', () => {
    const callback = vi.fn();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useDebouncedResize(callback, 100));

    window.dispatchEvent(new Event('resize'));
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('removes event listener on unmount', () => {
    const callback = vi.fn();
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useDebouncedResize(callback, 100));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
