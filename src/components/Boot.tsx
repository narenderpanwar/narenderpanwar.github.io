import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export const BOOT_KEY = "booted";

const LINES = [
  "Starting narender.service",
  "Mounting /home/narender/work",
  "Provisioning terraform modules",
  "Pulling image portfolio:latest",
  "Running ansible-playbook site.yml",
  "Health checks passed 6/6",
];

const STEP_MS = 260;
const HOLD_MS = 500;

interface Props {
  onDone: () => void;
}

// Terminal-style intro. Click, Enter, Escape or the Skip button dismisses it.
export function Boot({ onDone }: Props) {
  const [count, setCount] = useState(0);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    sessionStorage.setItem(BOOT_KEY, "1");
    onDone();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(count < LINES.length ? () => setCount((n) => n + 1) : finish, count < LINES.length ? STEP_MS : HOLD_MS);
    return () => clearTimeout(t);
    // finish only touches refs and stable props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      onClick={finish}
      className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-ink px-6"
    >
      <div className="w-full max-w-md font-mono text-sm">
        <Logo size={44} className="mb-5" />
        <p className="mb-4 text-white/40">$ ./boot --env=prod</p>
        <ul className="space-y-1.5">
          {LINES.slice(0, count).map((l) => (
            <motion.li key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-white/80">
              <span className="text-ok">[ OK ]</span> {l}
            </motion.li>
          ))}
        </ul>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <motion.div className="h-full bg-gradient-to-r from-ok to-info" animate={{ width: `${(count / LINES.length) * 100}%` }} transition={{ ease: "easeOut" }} />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="mt-5 text-xs text-white/40 hover:text-ok"
        >
          Skip intro ↵
        </button>
      </div>
    </motion.div>
  );
}
