import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { rotatingWords } from "../data/profile";

const INTERVAL_MS = 2200;

export function RoleRotator() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % rotatingWords.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <p className="mt-4 font-mono text-lg text-white/70 sm:text-xl">
      <span className="sr-only">I automate {rotatingWords.join(", ")}.</span>
      <span aria-hidden="true">
        <span className="text-ok">&gt;</span> I automate
        {/* own line on phones so wrapping never changes the layout height; inline from sm up */}
        <span className="mt-1 flex min-h-7 sm:mt-0 sm:ml-[1ch] sm:inline-flex sm:min-w-[26ch] sm:align-bottom">
          <AnimatePresence mode="wait">
            <motion.span
              key={rotatingWords[i]}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-block font-bold text-ok"
            >
              {rotatingWords[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </p>
  );
}
