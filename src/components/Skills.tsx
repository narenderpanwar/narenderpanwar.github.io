import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Blocks, Boxes, Cloud, Server, Workflow, type LucideIcon } from "lucide-react";
import { skillGroups, skillsDisclaimer, tierMeta, type Level, type SkillIcon } from "../data/profile";
import { DEFAULT_FALLBACK_COLOR, fallbackColor, skillIcons } from "../lib/skillIcons";
import { Section } from "./Section";

const TIERS: Level[] = [3, 2, 1];
const ALL = "All";

const fallbackIcons: Record<SkillIcon, LucideIcon> = {
  cloud: Cloud,
  containers: Boxes,
  iac: Blocks,
  cicd: Workflow,
  observability: Activity,
  systems: Server,
};

const toneVar = { ok: "var(--color-ok)", warn: "var(--color-warn)", bad: "var(--color-bad)" } as const;

interface Entry {
  name: string;
  level: Level;
  group: string;
  icon: SkillIcon;
}

function ToolIcon({ name, icon }: { name: string; icon: SkillIcon }) {
  const brand = skillIcons[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d={brand.path} />
      </svg>
    );
  }
  const Icon = fallbackIcons[icon];
  return <Icon size={16} strokeWidth={1.9} aria-hidden="true" />;
}

function Chip({ entry }: { entry: Entry }) {
  const color = skillIcons[entry.name]?.hex ?? fallbackColor[entry.name] ?? DEFAULT_FALLBACK_COLOR;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      title={entry.group}
      style={{ "--brand": color } as CSSProperties}
      className="skill-chip panel inline-flex items-center gap-2 rounded-xl py-1.5 pr-3.5 pl-2 text-sm font-semibold text-white/90"
    >
      <span className="skill-icon grid size-7 place-items-center rounded-lg bg-white/5">
        <ToolIcon name={entry.name} icon={entry.icon} />
      </span>
      {entry.name}
    </motion.li>
  );
}

function TierRow({ level, entries, index }: { level: Level; entries: Entry[]; index: number }) {
  const t = tierMeta[level];
  const c = toneVar[t.tone];
  return (
    <motion.section
      layout
      aria-label={`${t.letter} tier: ${t.label}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      className="panel flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
    >
      <div className="flex shrink-0 items-center gap-4 sm:w-64">
        <span
          aria-hidden="true"
          className={`grid size-16 shrink-0 place-items-center rounded-2xl font-mono font-extrabold text-ink ${
            t.letter.length > 2 ? "text-xl tracking-tight" : t.letter.length > 1 ? "text-3xl" : "text-4xl"
          }`}
          style={{ background: `linear-gradient(140deg, ${c}, color-mix(in srgb, ${c} 45%, #5ad1ff))`, boxShadow: `0 12px 32px -12px ${c}` }}
        >
          {t.letter}
        </span>
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: c }}>
            {t.usage}
          </p>
          <h3 className="text-lg leading-tight font-extrabold">{t.label}</h3>
          <p className="mt-1 text-xs leading-snug text-white/45">{t.caption}</p>
        </div>
      </div>
      <ul className="flex flex-1 flex-wrap gap-2.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {entries.map((e) => (
            <Chip key={e.name} entry={e} />
          ))}
        </AnimatePresence>
      </ul>
    </motion.section>
  );
}

export function Skills() {
  const [active, setActive] = useState(ALL);

  const entries = useMemo<Entry[]>(
    () => skillGroups.flatMap((g) => g.items.map((s) => ({ name: s.name, level: s.level, group: g.title, icon: g.icon }))),
    [],
  );
  const visible = active === ALL ? entries : entries.filter((e) => e.group === active);

  return (
    <Section
      id="skills"
      num="01"
      command="cat skills.tierlist"
      title={
        <>
          Tech stack, <span className="text-gradient">honestly rated.</span>
        </>
      }
    >
      <p className="mb-6 max-w-2xl font-mono text-sm leading-relaxed text-white/55">
        <span className="text-ok">&gt;</span> {skillsDisclaimer}
      </p>
      <div role="group" aria-label="Filter skills by category" className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {[ALL, ...skillGroups.map((g) => g.title)].map((name) => {
          const on = active === name;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(name)}
              className={`shrink-0 rounded-full px-4 py-2 font-mono text-xs font-bold whitespace-nowrap ring-1 transition-all ${
                on ? "bg-ok text-ink shadow-[0_8px_24px_-10px_var(--color-ok)] ring-ok" : "bg-white/5 text-white/60 ring-line hover:text-white hover:ring-white/30"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {TIERS.map((level, i) => {
            const rows = visible.filter((e) => e.level === level);
            return rows.length > 0 ? <TierRow key={level} level={level} entries={rows} index={i} /> : null;
          })}
        </AnimatePresence>
      </div>
    </Section>
  );
}
