import { useEffect, useState } from "react";
import { loadVisitorCount } from "../lib/visitors";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    loadVisitorCount({ signal: ctrl.signal }).then((n) => {
      if (!ctrl.signal.aborted) setCount(n);
    });
    return () => ctrl.abort();
  }, []);

  if (count === null) return null;
  return (
    <div
      role="status"
      aria-label={`${count.toLocaleString("en-IN")} ${count === 1 ? "visit" : "visits"}`}
      className="panel pointer-events-none fixed right-5 bottom-5 z-40 flex items-center gap-2.5 rounded-full py-2 pr-4 pl-3 font-mono text-xs select-none"
    >
      <span className="relative grid size-2.5 place-items-center" aria-hidden="true">
        <span className="absolute size-2.5 animate-ping rounded-full bg-ok/60 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-ok" />
      </span>
      <span className="font-extrabold text-white tabular-nums" aria-hidden="true">
        {count.toLocaleString("en-IN")}
      </span>
      <span className="text-white/50" aria-hidden="true">
        {count === 1 ? "visit" : "visits"} · live
      </span>
    </div>
  );
}
