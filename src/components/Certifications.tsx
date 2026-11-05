import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays } from "lucide-react";
import { siCredly, siKubernetes, siTerraform } from "simple-icons";
import { credentials, type CertBrand, type Certification } from "../data/profile";
import { Section } from "./Section";
import { TiltCard } from "./TiltCard";

// Accent per issuer, matching the site palette (terraform purple, kubernetes blue, aws orange).
const BRAND_COLOR: Record<CertBrand, string> = { terraform: "#a371ff", kubernetes: "#4c8dff", aws: "#ff9830" };

function CertGlyph({ brand }: { brand: CertBrand }) {
  if (brand === "aws") {
    // simple-icons no longer ships AWS, so this is a minimal original wordmark with a smile arc
    return (
      <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden="true">
        <text x="12" y="13" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="800" fontSize="8.5" fill="currentColor">
          aws
        </text>
        <path d="M5 16.2c4.2 2.6 9.8 2.6 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="m17.4 15.2 2 .9-.7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  const path = brand === "terraform" ? siTerraform.path : siKubernetes.path;
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function CertCard({ cert, index }: { cert: Certification; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40, rotate: 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: index * 0.12 }}
      className="h-full"
    >
      <TiltCard max={5} className="h-full rounded-2xl">
        <a
          href={cert.href}
          target="_blank"
          rel="noreferrer"
          style={{ "--cert": BRAND_COLOR[cert.brand] } as CSSProperties}
          className="cert-card group panel relative flex h-full items-center gap-4 overflow-hidden rounded-2xl p-4 pr-5"
        >
          <span aria-hidden="true" className="cert-glow pointer-events-none absolute -top-10 -right-10 size-32 rounded-full" />

          {/* hexagonal credential badge */}
          <span aria-hidden="true" className="cert-hex relative grid size-[4.25rem] shrink-0 place-items-center transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105">
            <span className="cert-hex-inner grid place-items-center text-[color:var(--cert)]">
              <CertGlyph brand={cert.brand} />
            </span>
          </span>

          <span className="relative min-w-0 flex-1">
            <span className="block font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase">{cert.issuer}</span>
            <span className="mt-0.5 block text-[15px] leading-snug font-bold text-white">{cert.name}</span>
            <span className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="rounded-md px-2 py-0.5 font-bold text-[color:var(--cert)] ring-1 ring-[color:var(--cert)]/40 bg-[color:var(--cert)]/10">{cert.level}</span>
              <span className="inline-flex items-center gap-1 text-white/45">
                <CalendarDays size={12} aria-hidden="true" />
                {cert.date}
              </span>
              <span className="inline-flex items-center gap-1 text-ok/80 transition-colors group-hover:text-ok">
                <BadgeCheck size={13} aria-hidden="true" />
                Verified on Credly ↗
              </span>
            </span>
          </span>
        </a>
      </TiltCard>
    </motion.li>
  );
}

export function Certifications() {
  const { certifications } = credentials;
  return (
    <Section
      id="certifications"
      num="04"
      command="credly --verify"
      title={
        <>
          Certifications, <span className="text-gradient">with receipts.</span>
        </>
      }
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-ok/10 px-2.5 py-1 font-mono text-[11px] font-bold text-ok ring-1 ring-ok/30">{certifications.length} verified</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/40">
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
            <path d={siCredly.path} />
          </svg>
          credly
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <CertCard key={c.name} cert={c} index={i} />
        ))}
      </ul>
    </Section>
  );
}
