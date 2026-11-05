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
    <span role="status" className="block">
      👀 <span className="font-bold text-ok">{count.toLocaleString("en-IN")}</span> {count === 1 ? "visit" : "visits"} and counting
    </span>
  );
}
