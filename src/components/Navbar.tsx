import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "../data/profile";
import { useActiveSection } from "../hooks/useActiveSection";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";
import { ResumeLink } from "./ResumeLink";

const sectionIds = navLinks.map((l) => l.href.slice(1));

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 18 }}
      className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2"
    >
      <nav
        aria-label="Primary"
        className={`panel panel-blur flex items-center justify-between rounded-xl px-4 py-2.5 transition-shadow ${
          scrolled ? "shadow-[0_8px_40px_-10px_rgb(46_229_157/0.3)]" : ""
        }`}
      >
        <a href="#top" aria-label={`${profile.handle}, back to top`} className="group flex items-center gap-2.5 font-mono text-sm font-bold">
          <Logo size={28} className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
          {profile.handle}
        </a>
        <ul className="hidden items-center gap-1 font-mono text-[13px] text-white/65 lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-md px-3 py-1.5 transition-colors hover:text-ok ${isActive ? "text-ok" : ""}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-md bg-ok/10 ring-1 ring-ok/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3">
          <ResumeLink label="Resume" className="hidden rounded-lg border border-line px-3 py-1.5 text-sm hover:border-ok hover:text-ok sm:inline-flex" />
          <Magnetic strength={0.2} className="hidden sm:inline-block">
            <a href="#contact" className="shine inline-block rounded-lg bg-ok px-3.5 py-1.5 font-mono text-sm font-bold text-ink">
              Let's talk
            </a>
          </Magnetic>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-mr-2 grid size-11 place-items-center rounded-lg active:bg-white/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="panel mt-2 flex flex-col gap-1 rounded-xl p-2 lg:hidden"
          >
            {[...navLinks, { href: "#contact", label: "Let's talk" }].map((l, i) => (
              <motion.li key={l.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 font-mono text-sm text-white/80 hover:bg-white/5 hover:text-ok"
                >
                  {l.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
