import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { availability, engineerYaml, profile } from "../data/profile";
import { FloatingTokens } from "./FloatingTokens";
import { InfraGraph } from "./InfraGraph";
import { Magnetic } from "./Magnetic";
import { RecruiterCards } from "./RecruiterCards";
import { ResumeLink } from "./ResumeLink";
import { RoleRotator } from "./RoleRotator";
import { Terminal } from "./Terminal";
import { TiltCard } from "./TiltCard";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section ref={ref} id="top" data-anim className="relative overflow-hidden pt-28 pb-16 md:pt-36">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div style={{ y: blobY }} className="glow-blue pointer-events-none absolute -top-56 -left-56 size-[44rem] rounded-full" />
      <motion.div style={{ y: blobY }} className="glow-green pointer-events-none absolute -right-48 -bottom-20 size-[40rem] rounded-full" />
      <FloatingTokens />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="panel inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-ok" />
            </span>
            <span className="text-ok">{availability.status}</span>
            <span className="text-white/40">|</span>
            <span className="inline-flex items-center gap-1 text-white/60">
              <MapPin size={12} /> {profile.location}
            </span>
          </motion.span>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 font-mono text-sm text-white/50">
            <span className="text-ok">$</span> whoami
          </motion.p>

          <h1 className="mt-2 text-4xl leading-[1.05] font-extrabold sm:text-6xl">
            {profile.name.split(" ").map((w, i) => (
              <Fragment key={w}>
                {i > 0 && " "}
                <span className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    initial={{ y: "110%", rotate: 6 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease }}
                    className="inline-block"
                  >
                    {w}
                  </motion.span>
                </span>
              </Fragment>
            ))}
          </h1>
          <div className="mt-2 overflow-hidden pb-1">
            <motion.h2
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease }}
              className="text-gradient text-2xl font-bold sm:text-4xl"
            >
              {profile.role}
            </motion.h2>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <RoleRotator />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            {profile.summary}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                className="group shine inline-flex items-center gap-2 rounded-lg bg-ok px-5 py-3 font-mono text-sm font-bold text-ink hover:shadow-[0_10px_40px_-8px_rgb(46_229_157/0.6)]"
              >
                Contact me
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <ResumeLink className="panel rounded-lg px-5 py-3 text-sm hover:border-ok hover:text-ok" />
          </motion.div>

          <RecruiterCards />
        </motion.div>

        <motion.div style={{ y: rightY }} className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 40, rotate: 3 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.5, duration: 0.9, ease }}>
            <TiltCard max={5} className="rounded-xl">
              <Terminal lines={engineerYaml} title="kubectl get engineer narender -o yaml" />
            </TiltCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease }}>
            <InfraGraph />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
