import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Soft spotlight that trails the pointer; skipped on touch devices.
export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 22 });
  const sy = useSpring(y, { stiffness: 120, damping: 22 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - 280);
      y.set(e.clientY - 280);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="glow-green pointer-events-none fixed top-0 left-0 z-0 size-[560px] rounded-full opacity-60"
    />
  );
}
