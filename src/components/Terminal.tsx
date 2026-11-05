import { useEffect, useState } from "react";
import { lineKind, totalChars, typedText } from "../lib/helpers";

interface Props {
  lines: string[];
  title: string;
  speedMs?: number;
}

function Line({ text }: { text: string }) {
  const kind = lineKind(text);
  if (kind === "prompt") return <span className="text-ok">{text}</span>;
  if (kind === "key") {
    const i = text.indexOf(":");
    return (
      <>
        <span className="text-info">{text.slice(0, i + 1)}</span>
        <span className="text-white/85">{text.slice(i + 1)}</span>
      </>
    );
  }
  return <span className="text-white/70">{text}</span>;
}

export function Terminal({ lines, title, speedMs = 22 }: Props) {
  const [tick, setTick] = useState(0);
  const total = totalChars(lines);

  useEffect(() => {
    if (tick >= total) return;
    const t = setTimeout(() => setTick((n) => n + 1), speedMs);
    return () => clearTimeout(t);
  }, [tick, total, speedMs]);

  const shown = typedText(lines, tick).split("\n");

  return (
    <div className="panel w-full overflow-hidden rounded-xl shadow-2xl shadow-ok/5" aria-label="Terminal animation">
      <div className="flex items-center gap-2 border-b border-line bg-ink/60 px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-white/40">{title}</span>
      </div>
      <pre className="min-h-[26rem] p-5 font-mono text-[13px] leading-6 whitespace-pre-wrap">
        {shown.map((l, i) => (
          <div key={i}>
            <Line text={l} />
            {i === shown.length - 1 && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-ok" />}
          </div>
        ))}
      </pre>
    </div>
  );
}
