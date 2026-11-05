import { render, screen, within } from "@testing-library/react";
import { projects } from "../data/profile";
import { Projects } from "./Projects";

describe("Projects", () => {
  it("shows exactly six cards, each with problem, action, results and a stack", () => {
    render(<Projects />);
    expect(screen.getAllByRole("article")).toHaveLength(6);
    for (const p of projects) {
      const card = within(screen.getByRole("heading", { name: p.title }).closest("article") as HTMLElement);
      expect(card.getByText("Problem")).toBeInTheDocument();
      expect(card.getByText("What I did")).toBeInTheDocument();
      expect(card.getByText("Result")).toBeInTheDocument();
      expect(p.results.length).toBeGreaterThanOrEqual(3);
      for (const s of p.stack) expect(card.getAllByText(s).length).toBeGreaterThan(0);
    }
  });

  it("covers AWS, Kubernetes, CI/CD, IaC, observability and the Chef to Ansible migration, in order", () => {
    expect(projects.map((p) => p.title)).toEqual([
      "Scalable AWS Platform",
      "Containers on Kubernetes",
      "CI/CD Pipelines",
      "Infrastructure as Code & Automation",
      "Observability & Compliance",
      "Chef to Ansible Migration",
    ]);
  });

  it("describes the Chef to Ansible migration with the exact resume wording", () => {
    const m = projects.find((p) => p.title === "Chef to Ansible Migration");
    expect(m?.action).toBe(
      "Migrated legacy Chef cookbooks to Ansible playbooks, improving automation efficiency and reducing configuration drift across multi-cloud environments.",
    );
    expect(m?.stack).toEqual(expect.arrayContaining(["Ansible", "Chef"]));
  });

  it("never names an employer on the cards", () => {
    render(<Projects />);
    expect(document.getElementById("work")).not.toHaveTextContent(/TO THE NEW|HashedIn|Hashedin/i);
    expect(JSON.stringify(projects)).not.toMatch(/TO THE NEW|HashedIn|company/i);
  });

  it("does not include the claims that were removed from the page", () => {
    render(<Projects />);
    expect(document.getElementById("work")).not.toHaveTextContent(/golden image|image provisioning|60%/i);
  });
});
