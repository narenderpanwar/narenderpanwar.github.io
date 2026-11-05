import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Check, Loader2, Play, RotateCcw } from "lucide-react";
import { stages } from "../data/profile";
import { stageStatus } from "../lib/helpers";
import { Section } from "./Section";

const STEP_MS = 900;

export function Pipeline() {
  const [current, setCurrent] = useState(-1);
  const trackRef = useRef<HTMLOListElement>(null);
  const inView = useInView(trackRef, { once: true, amount: 0.6 });
  const running = current >= 0 && current < stages.length;
  const finished = current >= stages.length;

  // Kick off the first run automatically when the section scrolls into view.
  useEffect(() => {
    if (inView) setCurrent((c) => (c < 0 ? 0 : c));
  }, [inView]);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setCurrent((n) => n + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [current, running]);

  const doneStages = stages.slice(0, Math.min(Math.max(current, 0), stages.length));
  const active = running ? stages[current] : undefined;

  return (
    <Section
      id="pipeline"
      num="02"
      command="gh workflow run ship-it.yml"
      title={
        <>
          How I ship: commit to prod, <span className="text-gradient">no drama.</span>
        </>
      }
    >
      <div className="panel rounded-xl p-5 md:p-8">
        <ol ref={trackRef} className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
          {stages.map((s, i) => {
            const status = stageStatus(i, current);
            return (
              <li key={s.id} className="relative">
                <div
                  className={`flex h-full flex-col items-center gap-3 rounded-lg border p-4 text-center transition-all duration-300 ${
                    status === "done"
                      ? "border-ok/60 bg-ok/10"
                      : status === "running"
                        ? "scale-105 border-info bg-info/15 shadow-[0_0_30px_-6px_var(--color-info)]"
                        : "border-line bg-ink/40"
                  }`}
                >
                  <span
                    className={`grid size-10 place-items-center rounded-md font-mono text-sm ${
                      status === "done" ? "bg-ok text-ink" : status === "running" ? "bg-info text-white" : "bg-line text-white/40"
                    }`}
                  >
                    {status === "done" ? <Check size={18} /> : status === "running" ? <Loader2 size={18} className="animate-spin" /> : i + 1}
                  </span>
                  <span className="font-mono text-sm font-bold">{s.label}</span>
                  <span className="sr-only">{status}</span>
                </div>
                {i < stages.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 -right-3 z-10 hidden h-0.5 w-4 md:block ${status === "done" ? "flow-line" : "bg-line"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-h-[7.5rem] flex-1 rounded-lg bg-ink/70 p-4 font-mono text-[13px] leading-6" aria-live="polite">
            {current < 0 && <p className="text-white/50">$ waiting for trigger... scroll here or press run to see how I ship.</p>}
            {doneStages.map((s) => (
              <p key={s.id} className="text-white/70">
                <span className="text-ok">[✓] {s.label.toLowerCase()}</span> {s.detail}
              </p>
            ))}
            {active && (
              <p className="text-info">
                [..] {active.label.toLowerCase()} {active.detail}
              </p>
            )}
            {finished && <p className="font-bold text-ok">✅ Deployed. Zero downtime. Dashboards green.</p>}
          </div>
          <button
            type="button"
            onClick={() => setCurrent(0)}
            disabled={running}
            className="shine inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-ok px-5 py-3 font-mono text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {finished ? <RotateCcw size={16} /> : <Play size={16} />}
            {finished ? "Run again" : running ? "Running..." : "Run pipeline"}
          </button>
        </div>
      </div>
    </Section>
  );
}
