import { fireEvent, render, screen, within } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { skillGroups, skillsDisclaimer, tierMeta, type Level } from "../data/profile";
import { skillIcons } from "../lib/skillIcons";
import { Skills } from "./Skills";

// The filtering logic is under test, not framer's enter/exit animations (which need real frames in jsdom).
vi.mock("framer-motion", () => {
  type Props = { children?: ReactNode; className?: string; style?: object; title?: string; role?: string } & Record<string, unknown>;
  // One stable component per tag. A fresh function per access would remount the subtree on every render.
  const cache: Record<string, (p: Props) => ReactNode> = {};
  const passthrough = new Proxy(
    {},
    {
      get: (_t, tag: string) =>
        (cache[tag] ??= ({ children, className, style, title, role, ...rest }: Props) =>
          createElement(tag, { className, style, title, role, "aria-label": rest["aria-label"] }, children)),
    },
  );
  return { motion: passthrough, AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</> };
});

const levelsInData = [...new Set(skillGroups.flatMap((g) => g.items.map((s) => s.level)))].sort((a, b) => b - a) as Level[];
const tier = (letter: string) => within(screen.getByRole("region", { name: new RegExp(`^${letter} tier`) }));

describe("Skills tier list", () => {
  it("keeps the honestly-rated headline and the self-roast intro", () => {
    render(<Skills />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Tech stack, honestly rated.");
    expect(screen.getByText(skillsDisclaimer, { exact: false })).toBeInTheDocument();
  });

  it("never claims to be an expert or proficient", () => {
    render(<Skills />);
    const text = document.getElementById("skills")?.textContent ?? "";
    expect(text).not.toMatch(/expert|proficient|master|guru|ninja/i);
    expect(JSON.stringify(tierMeta)).not.toMatch(/expert|proficient/i);
  });

  it("rates itself humbly and in meme: MID at best, then NGL, then F", () => {
    expect(Object.values(tierMeta).map((t) => t.letter)).toEqual(["F", "NGL", "MID"]);
    expect(JSON.stringify(tierMeta)).not.toMatch(/\bC\+|"D"/);
  });

  it("places every skill in the tier that matches its level", () => {
    render(<Skills />);
    for (const g of skillGroups) {
      for (const s of g.items) expect(tier(tierMeta[s.level].letter).getByText(s.name)).toBeInTheDocument();
    }
  });

  it("describes each visible tier by how often the tools are used, with a caption", () => {
    render(<Skills />);
    expect(levelsInData.length).toBeGreaterThan(0);
    for (const level of levelsInData) {
      expect(screen.getByText(tierMeta[level].usage)).toBeInTheDocument();
      expect(screen.getByText(tierMeta[level].caption)).toBeInTheDocument();
    }
  });

  it("only renders tiers that actually contain skills", () => {
    render(<Skills />);
    for (const level of [1, 2, 3] as Level[]) {
      const present = levelsInData.includes(level);
      const region = screen.queryByRole("region", { name: new RegExp(`^${tierMeta[level].letter} tier`) });
      expect(Boolean(region)).toBe(present);
    }
  });

  it("filters by category, marks the active pill, and drops tiers the category does not use", () => {
    render(<Skills />);
    const group = skillGroups.find((g) => g.title === "Observability")!;
    const pill = screen.getByRole("button", { name: group.title });
    fireEvent.click(pill);

    expect(pill).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Terraform")).not.toBeInTheDocument();
    for (const s of group.items) expect(screen.getAllByText(s.name).length).toBeGreaterThan(0);

    // Observability is all level 2, so the level 3 tier disappears
    expect(group.items.every((s) => s.level === 2)).toBe(true);
    expect(screen.queryByRole("region", { name: new RegExp(`^${tierMeta[3].letter} tier`) })).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: new RegExp(`^${tierMeta[2].letter} tier`) })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Terraform")).toBeInTheDocument();
  });

  it("has no unranked toolbox list (AWS services, Nginx, Jira and friends are not shown)", () => {
    render(<Skills />);
    expect(screen.queryByText(/Also in the toolbox/)).not.toBeInTheDocument();
    for (const name of ["EC2", "VPC", "Lambda", "API Gateway", "CloudFront", "Security Hub", "Nginx", "IIS", "Jira", "Confluence", "Slack"]) {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    }
  });

  it("has a real brand icon for the main tools", () => {
    for (const name of ["Terraform", "Kubernetes", "Docker", "Ansible", "Jenkins", "Grafana", "Python"]) {
      expect(skillIcons[name]?.path.length).toBeGreaterThan(10);
    }
  });
});
