export type StageStatus = "idle" | "running" | "done";

// `current` is the index of the running stage; -1 = not started, >= total = finished.
export function stageStatus(index: number, current: number): StageStatus {
  if (index < current) return "done";
  if (index === current) return "running";
  return "idle";
}

// Characters of `lines` visible after `tick` keystrokes; lines are joined with "\n".
export function typedText(lines: string[], tick: number): string {
  const full = lines.join("\n");
  return full.slice(0, Math.max(0, Math.min(tick, full.length)));
}

export function totalChars(lines: string[]): number {
  return lines.join("\n").length;
}

export type LineKind = "prompt" | "key" | "text";

// Values still marked TODO in the content file; such facts are hidden from the public page.
export function isPlaceholder(value: string): boolean {
  return /^\s*todo\b/i.test(value);
}

// Smooth horizontal bezier between two points, used for graph edges.
export function edgePath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mid = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
}

// Last section (in document order) whose top edge has scrolled past `offset`.
export function activeSection(sections: { id: string; top: number }[], offset: number): string {
  let active = "";
  for (const s of sections) if (s.top <= offset) active = s.id;
  return active;
}

// Used to syntax-colour terminal / YAML lines.
export function lineKind(line: string): LineKind {
  if (line.startsWith("$")) return "prompt";
  if (/^\s*[\w.-]+:/.test(line)) return "key";
  return "text";
}
