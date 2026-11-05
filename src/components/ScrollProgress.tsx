import { motion, useScroll, useSpring } from "framer-motion";

// Reading progress, styled like a pipeline progress bar.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-ok via-[#5ad1ff] to-info shadow-[0_0_12px_var(--color-ok)]"
    />
  );
}
