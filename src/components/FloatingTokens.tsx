const TOKENS = [
  { t: "{ }", x: "6%", y: "18%", d: 0 },
  { t: "</>", x: "86%", y: "12%", d: 1.2 },
  { t: "⎈", x: "47%", y: "8%", d: 2.4 },
  { t: "yaml", x: "92%", y: "58%", d: 0.6 },
  { t: "IaC", x: "40%", y: "88%", d: 3 },
  { t: "k8s", x: "72%", y: "90%", d: 0.9 },
];

// Decorative drifting DevOps glyphs behind the hero. will-change keeps each on its own compositor layer.
export function FloatingTokens() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {TOKENS.map((k) => (
        <span
          key={k.t}
          className="absolute animate-float font-mono text-sm text-ok/20 select-none will-change-transform sm:text-base"
          style={{ left: k.x, top: k.y, animationDelay: `${k.d}s` }}
        >
          {k.t}
        </span>
      ))}
    </div>
  );
}
