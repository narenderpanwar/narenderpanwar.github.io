import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { aiConfessionLines, availability, lookingFor, profile } from "../data/profile";
import { getContacts } from "../lib/contacts";
import { isPlaceholder } from "../lib/helpers";
import { ContactCard } from "./ContactLinks";
import { Magnetic } from "./Magnetic";
import { ResumeLink } from "./ResumeLink";

// The primary email button covers email, so the cards show the other channels.
const cards = getContacts().filter((c) => c.id !== "email");

export function Contact() {
  const notice = availability.facts.find((f) => f.label === "Notice period")?.value;
  const showNotice = notice && !isPlaceholder(notice);
  return (
    <section id="contact" data-anim className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative overflow-hidden rounded-2xl p-px"
      >
        {/* rotating gradient border */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[250%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_55%,var(--color-ok)_78%,var(--color-info)_92%,transparent_100%)]"
        />
        <div className="panel-solid relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(46_229_157/0.18),transparent_60%)]" />
          <p className="relative font-mono text-sm text-ok">
            <span className="mr-3 text-white/25">05</span>
            <span className="text-white/40">$ </span>curl -X POST /hire-me
          </p>
          <div className="relative mt-4 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
            <div>
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl md:text-6xl">
                Hiring a <span className="text-gradient">DevOps Engineer?</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/65">
                I reply within one business day. {showNotice ? `Notice period: ${notice}.` : ""} Happy to share references and walk through any project in detail.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group shine inline-flex items-center gap-2 rounded-lg bg-ok px-6 py-3.5 font-mono text-sm font-bold text-ink"
                  >
                    {profile.email}
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Magnetic>
                <ResumeLink className="rounded-lg border border-line px-6 py-3.5 text-sm hover:border-ok hover:text-ok" />
              </div>
              <ul className="mt-7 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]">
                {cards.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 + i * 0.08 }}
                  >
                    <ContactCard contact={c} />
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-ink/70 p-6">
              <h3 className="font-mono text-sm font-bold text-white/80">What I'm looking for</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {lookingFor.map((l, i) => (
                  <motion.li
                    key={l}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="flex gap-3"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-ok" />
                    {l}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mt-10 space-y-1 text-center font-mono text-xs text-white/40">
        <span className="block">
          © {new Date().getFullYear()} {profile.name} · Built with React, Tailwind &amp; a green pipeline ✅
        </span>
        <span className="block">{aiConfessionLines[0]}</span>
        <span className="block">{aiConfessionLines[1]}</span>
      </p>
    </section>
  );
}
