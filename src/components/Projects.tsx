import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "../data/profile";
import { Section } from "./Section";
import { TiltCard } from "./TiltCard";

const accents: Record<Project["accent"], { text: string; border: string; bar: string }> = {
  ok: { text: "text-ok", border: "hover:border-ok/60", bar: "bg-ok" },
  info: { text: "text-info", border: "hover:border-info/60", bar: "bg-info" },
  warn: { text: "text-warn", border: "hover:border-warn/60", bar: "bg-warn" },
  tf: { text: "text-tf", border: "hover:border-tf/60", bar: "bg-tf" },
};

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-wider text-white/40 uppercase">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-white/75">{children}</div>
    </div>
  );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const a = accents[p.accent];
  const inner = (
    <>
      <span className={`absolute inset-x-0 top-0 h-0.5 ${a.bar}`} />
      <div className="flex items-center justify-between">
        <span className={`font-mono text-xs tracking-widest uppercase ${a.text}`}>{p.tag}</span>
        {p.href && <ArrowUpRight className="text-white/30 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" size={18} />}
      </div>
      <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
      <div className="mt-5 flex flex-1 flex-col gap-4">
        <Block label="Problem">{p.problem}</Block>
        <Block label="What I did">{p.action}</Block>
        <Block label="Result">
          <ul className="space-y-1">
            {p.results.map((r) => (
              <li key={r} className="flex gap-2">
                <span className={a.text}>✓</span>
                {r}
              </li>
            ))}
          </ul>
        </Block>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {p.stack.map((s) => (
          <li key={s} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-white/70">
            {s}
          </li>
        ))}
      </ul>
    </>
  );
  const cls = `group panel relative flex h-full flex-col overflow-hidden rounded-xl p-6 transition-colors ${a.border}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="h-full"
    >
      <TiltCard max={6} className="h-full rounded-xl">
        {p.href ? (
          <a href={p.href} target="_blank" rel="noreferrer" className={cls}>
            {inner}
          </a>
        ) : (
          <div className={cls}>{inner}</div>
        )}
      </TiltCard>
    </motion.article>
  );
}

export function Projects() {
  return (
    <Section
      id="work"
      num="03"
      command="kubectl get projects -o wide"
      title={
        <>
          Selected <span className="text-gradient">work.</span>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
