import { logLines } from "../data/profile";

const levelStyle = { OK: "text-ok", INFO: "text-info", WARN: "text-warn" } as const;

// Endless scrolling log stream between hero and content.
export function LogTicker() {
  const items = [...logLines, ...logLines];
  return (
    <div data-anim className="overflow-hidden border-y border-line bg-panel/70 py-3" aria-hidden="true">
      <div className="flex w-max animate-log pause-hover gap-10 font-mono text-[13px] whitespace-nowrap">
        {items.map((l, i) => (
          <span key={i} className="text-white/55">
            <span className={`font-bold ${levelStyle[l.level]}`}>[{l.level}]</span> {l.text}
          </span>
        ))}
      </div>
    </div>
  );
}
