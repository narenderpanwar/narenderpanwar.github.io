import { useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { BackToTop } from "./components/BackToTop";
import { Boot, BOOT_KEY } from "./components/Boot";
import { Contact } from "./components/Contact";
import { CursorGlow } from "./components/CursorGlow";
import { Certifications } from "./components/Certifications";
import { Hero } from "./components/Hero";
import { LogTicker } from "./components/LogTicker";
import { Navbar } from "./components/Navbar";
import { Pipeline } from "./components/Pipeline";
import { Projects } from "./components/Projects";
import { ScrollProgress } from "./components/ScrollProgress";
import { Skills } from "./components/Skills";
import { usePauseOffscreen } from "./hooks/usePauseOffscreen";

// Show the intro once per session, and never for reduced-motion users.
function shouldBoot(): boolean {
  return !sessionStorage.getItem(BOOT_KEY) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const [booting, setBooting] = useState(shouldBoot);
  usePauseOffscreen();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{booting && <Boot key="boot" onDone={() => setBooting(false)} />}</AnimatePresence>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <LogTicker />
        <Skills />
        <Pipeline />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <BackToTop />
    </MotionConfig>
  );
}
