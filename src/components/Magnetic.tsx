import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface Props {
  children: ReactNode;
  strength?: number;
  className?: string;
}

// Pulls its child slightly toward the pointer.
export function Magnetic({ children, strength = 0.3, className = "" }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 16 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduce || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}
