import { useEffect, useRef } from "react";

export function useDebouncedResize(callback: () => void, delay = 200) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleResize() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback();
      }, delay);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [callback, delay]);
}
