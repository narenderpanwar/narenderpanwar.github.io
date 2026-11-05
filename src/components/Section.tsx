import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  id: string;
  num: string;
  command: string;
  title: ReactNode;
  children: ReactNode;
}

// `command` renders as a shell prompt above the heading; the heading slides up from a mask.
export function Section({ id, num, command, title, children }: Props) {
  return (
    <section id={id} data-anim className="relative mx-auto w-full max-w-6xl px-5 py-20 md:py-28">
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="font-mono text-sm text-ok"
      >
        <span className="mr-3 text-white/25">{num}</span>
        <span className="text-white/40">$ </span>
        {command}
      </motion.p>
      <div className="mt-3 mb-10 overflow-hidden pb-2">
        <motion.h2
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-3xl leading-tight font-extrabold md:text-5xl"
        >
          {title}
        </motion.h2>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
