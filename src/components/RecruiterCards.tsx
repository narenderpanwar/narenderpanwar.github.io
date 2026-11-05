import { motion } from "framer-motion";
import { Award, Briefcase, Clock, Layers, MapPin, Timer, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { availability } from "../data/profile";
import { isPlaceholder } from "../lib/helpers";

type Tone = "ok" | "info" | "tf" | "warn";

// Literal class strings so Tailwind can see them.
const tone: Record<Tone, { tile: string; chip: string; hover: string }> = {
  ok: { tile: "bg-ok/10 text-ok ring-ok/30", chip: "bg-ok/10 text-ok ring-ok/30", hover: "hover:border-ok/50" },
  info: { tile: "bg-info/10 text-info ring-info/30", chip: "bg-info/10 text-info ring-info/30", hover: "hover:border-info/50" },
  tf: { tile: "bg-tf/10 text-tf ring-tf/30", chip: "bg-tf/10 text-tf ring-tf/30", hover: "hover:border-tf/50" },
  warn: { tile: "bg-warn/10 text-warn ring-warn/30", chip: "bg-warn/10 text-warn ring-warn/30", hover: "hover:border-warn/50" },
};
const chipTones: Tone[] = ["info", "tf", "warn", "ok"];

interface CardSpec {
  Icon: LucideIcon;
  tone: Tone;
  wide?: boolean;
  render: (value: string) => ReactNode;
}

const Chips = ({ value }: { value: string }) => (
  <span className="flex flex-wrap gap-1.5">
    {value.split(" · ").map((item, i) => (
      <span key={item} className={`rounded-md px-2 py-1 font-mono text-[11px] font-bold ring-1 ${tone[chipTones[i % chipTones.length]].chip}`}>
        {item}
      </span>
    ))}
  </span>
);

const cards: Record<string, CardSpec> = {
  "Current role": {
    Icon: Briefcase,
    tone: "ok",
    wide: true,
    render: (v) => {
      const [role, ...company] = v.split(", ");
      return (
        <span className="block">
          <span className="flex items-center gap-2 text-lg leading-tight font-bold text-white">
            {role}
            <span className="inline-flex items-center gap-1 rounded-full bg-ok/10 px-2 py-0.5 font-mono text-[10px] font-bold text-ok ring-1 ring-ok/30">
              <span className="size-1.5 animate-pulse rounded-full bg-ok" />
              Present
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-white/55">{company.join(", ")}</span>
        </span>
      );
    },
  },
  Experience: {
    Icon: Timer,
    tone: "info",
    render: (v) => {
      const m = v.match(/^(\d+\+?)\s*(.*)$/);
      return m ? (
        <span className="flex items-baseline gap-1.5">
          <span className="text-gradient font-mono text-4xl leading-none font-extrabold">{m[1]}</span>
          <span className="text-sm text-white/55">{m[2]}</span>
        </span>
      ) : (
        <span className="text-sm font-semibold text-white/90">{v}</span>
      );
    },
  },
  Location: {
    Icon: MapPin,
    tone: "warn",
    render: (v) => <span className="text-[15px] leading-snug font-bold text-white">{v}</span>,
  },
  Certified: { Icon: Award, tone: "tf", wide: true, render: (v) => <Chips value={v} /> },
  "Core stack": { Icon: Layers, tone: "info", wide: true, render: (v) => <Chips value={v} /> },
  "Notice period": {
    Icon: Clock,
    tone: "ok",
    render: (v) => <span className="text-[15px] font-bold text-white">{v}</span>,
  },
};

const fallback: CardSpec = { Icon: Layers, tone: "info", render: (v) => <span className="text-sm font-semibold text-white/90">{v}</span> };

// Recruiter TL;DR as a bento grid. Facts still marked TODO are hidden so the page never looks unfinished.
export function RecruiterCards() {
  const facts = availability.facts.filter((f) => !isPlaceholder(f.value));
  return (
    <motion.dl
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { delayChildren: 1.25, staggerChildren: 0.08 } } }}
      aria-label="Recruiter summary"
      className="mt-8 grid grid-cols-2 gap-3"
    >
      {facts.map((f) => {
        const spec = cards[f.label] ?? fallback;
        const t = tone[spec.tone];
        return (
          <motion.div
            key={f.label}
            variants={{ hidden: { opacity: 0, y: 18, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }}
            whileHover={{ y: -3 }}
            className={`panel group flex items-start gap-3 rounded-2xl p-3.5 transition-colors ${t.hover} ${spec.wide ? "col-span-2" : ""}`}
          >
            <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110 ${t.tile}`}>
              <spec.Icon size={18} strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <dt className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">{f.label}</dt>
              <dd>{spec.render(f.value)}</dd>
            </div>
          </motion.div>
        );
      })}
    </motion.dl>
  );
}
