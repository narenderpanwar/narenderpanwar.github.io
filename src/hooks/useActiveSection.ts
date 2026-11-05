import { useEffect, useState } from "react";
import { activeSection } from "../lib/helpers";

// Scroll-spy: id of the section currently under the navbar.
// Layout reads are batched into one requestAnimationFrame per frame instead of one per scroll event.
export function useActiveSection(ids: string[], offset = 160): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = ids.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      setActive(activeSection(tops, offset));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids, offset]);

  return active;
}
