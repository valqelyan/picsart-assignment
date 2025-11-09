import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

export function useInView(onVisible: () => void) {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!entry?.isIntersecting) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      return;
    }

    function loop() {
      onVisible();
      timeoutId.current = setTimeout(loop, 200);
    }

    loop();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, [entry, onVisible]);

  return ref
}
