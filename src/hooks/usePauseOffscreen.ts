import { useEffect } from "react";

const OFFSCREEN_CLASS = "is-offscreen";

// Adds `is-offscreen` to every `[data-anim]` element that is outside the viewport so its
// CSS animations pause (see index.css). Keeps off-screen sections from burning frames.
export function usePauseOffscreen(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-anim]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle(OFFSCREEN_CLASS, !e.isIntersecting);
      },
      { rootMargin: "120px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
