import { useEffect, useRef } from "react";

export function useDebouncedResize(callback, delay = 200) {
  const timer = useRef(null);

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

