import { activeSection, edgePath, isPlaceholder, lineKind, stageStatus, typedText, totalChars } from "./helpers";

describe("isPlaceholder", () => {
  it("detects values still marked TODO", () => {
    expect(isPlaceholder("TODO (e.g. 30 days)")).toBe(true);
    expect(isPlaceholder("  todo")).toBe(true);
  });

  it("does not flag real values", () => {
    expect(isPlaceholder("30 days")).toBe(false);
    expect(isPlaceholder("Todos app engineer")).toBe(false);
  });
});

describe("edgePath", () => {
  it("builds a horizontal bezier with a shared midpoint control", () => {
    expect(edgePath({ x: 100, y: 20 }, { x: 200, y: 80 })).toBe("M 100 20 C 150 20, 150 80, 200 80");
  });
});

describe("activeSection", () => {
  const sections = [
    { id: "a", top: -400 },
    { id: "b", top: 50 },
    { id: "c", top: 600 },
  ];

  it("returns the last section that has reached the offset", () => {
    expect(activeSection(sections, 140)).toBe("b");
    expect(activeSection(sections, 700)).toBe("c");
  });

  it("returns empty string when no section has been reached", () => {
    expect(activeSection([{ id: "a", top: 300 }], 140)).toBe("");
    expect(activeSection([], 140)).toBe("");
  });
});

describe("stageStatus", () => {
  it("marks earlier stages done, current running, later idle", () => {
    expect(stageStatus(0, 2)).toBe("done");
    expect(stageStatus(2, 2)).toBe("running");
    expect(stageStatus(3, 2)).toBe("idle");
  });

  it("is all idle before start and all done after finish", () => {
    expect([0, 1, 2].map((i) => stageStatus(i, -1))).toEqual(["idle", "idle", "idle"]);
    expect([0, 1, 2].map((i) => stageStatus(i, 3))).toEqual(["done", "done", "done"]);
  });
});

describe("typedText", () => {
  const lines = ["ab", "cd"];

  it("reveals characters progressively across lines", () => {
    expect(typedText(lines, 0)).toBe("");
    expect(typedText(lines, 2)).toBe("ab");
    expect(typedText(lines, 4)).toBe("ab\nc");
  });

  it("clamps out-of-range ticks", () => {
    expect(typedText(lines, -5)).toBe("");
    expect(typedText(lines, 999)).toBe("ab\ncd");
  });

  it("totalChars counts the joined length", () => {
    expect(totalChars(lines)).toBe(5);
  });
});

describe("lineKind", () => {
  it("classifies prompts, yaml keys and plain text", () => {
    expect(lineKind("$ whoami")).toBe("prompt");
    expect(lineKind("  name: narender")).toBe("key");
    expect(lineKind("kind: Engineer")).toBe("key");
    expect(lineKind("just some output")).toBe("text");
  });
});
