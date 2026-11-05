import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { aiConfessionLines, availability, credentials, engineerYaml, navLinks, profile, projects, skillGroups, stages } from "./data/profile";
import { isPlaceholder } from "./lib/helpers";

describe("App", () => {
  it("shows the name, role and every real recruiter fact above the fold", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    const summary = screen.getByLabelText("Recruiter summary");
    const real = availability.facts.filter((f) => !isPlaceholder(f.value));
    expect(real.length).toBeGreaterThanOrEqual(5);
    for (const f of real) {
      expect(summary).toHaveTextContent(f.label);
      // values are rendered as chips / split spans, so check each token
      for (const token of f.value.split(/\s*[·,]\s*|\s+/).filter(Boolean)) expect(summary).toHaveTextContent(token);
    }
    expect(screen.getByText(availability.status)).toBeInTheDocument();
  });

  it("hides facts that are still TODO placeholders instead of showing them", () => {
    render(<App />);
    const hidden = availability.facts.filter((f) => isPlaceholder(f.value));
    expect(hidden.length).toBeGreaterThan(0);
    for (const f of hidden) expect(screen.getByLabelText("Recruiter summary")).not.toHaveTextContent(f.label);
    expect(document.body).not.toHaveTextContent(/TODO/);
  });

  it("orders the sections Skills, Pipeline, Work, Certifications, Contact, numbered 01 to 05, matching the navbar", () => {
    render(<App />);
    const ids = [...document.querySelectorAll("main > section[id]")].map((s) => s.id);
    expect(ids).toEqual(["top", "skills", "pipeline", "work", "certifications", "contact"]);

    const numbered = ids.slice(1).map((id) => document.getElementById(id)?.textContent?.match(/\b0[1-5]\b/)?.[0]);
    expect(numbered).toEqual(["01", "02", "03", "04", "05"]);

    expect(navLinks.map((l) => l.label)).toEqual(["Skills", "Pipeline", "Work", "Certifications", "Contact"]);
    expect(navLinks.map((l) => l.href.slice(1))).toEqual(ids.slice(1));
  });

  it("renders every nav link, project and skill", () => {
    render(<App />);
    for (const l of navLinks) {
      expect(screen.getAllByRole("link", { name: l.label }).length).toBeGreaterThan(0);
    }
    for (const p of projects) {
      expect(screen.getByRole("heading", { name: p.title })).toBeInTheDocument();
    }
    for (const g of skillGroups) {
      for (const s of g.items) {
        expect(screen.getAllByText(s.name).length).toBeGreaterThan(0);
      }
    }
  });

  it("lists certifications as verified credential cards linking to Credly", () => {
    render(<App />);
    for (const c of credentials.certifications) {
      const card = screen.getByRole("link", { name: new RegExp(c.name.replace(/[()]/g, "\\$&")) });
      expect(card).toHaveAttribute("href", c.href);
      expect(card).toHaveTextContent(c.issuer);
      expect(card).toHaveTextContent(c.level);
      expect(card).toHaveTextContent(c.date);
      expect(card).toHaveTextContent("Verified on Credly");
    }
    expect(screen.getByText(`${credentials.certifications.length} verified`)).toBeInTheDocument();
  });

  it("has a certifications-only section: no experience timeline, no education, no job history", () => {
    render(<App />);
    const section = within(document.getElementById("certifications") as HTMLElement);
    expect(section.getByRole("heading", { level: 2 })).toHaveTextContent("Certifications, with receipts.");
    expect(section.getAllByRole("listitem")).toHaveLength(credentials.certifications.length);
    expect(section.queryByRole("list", { name: /career|experience/i })).not.toBeInTheDocument();
    expect(document.getElementById("certifications")?.querySelector("ol")).toBeNull();
    expect(document.getElementById("experience")).toBeNull();
    expect(screen.queryByRole("heading", { name: /education/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Experience & credentials|git log --oneline --career/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Experience" })).not.toBeInTheDocument();
    expect(Object.keys(credentials)).toEqual(["certifications"]);
  });

  it("hides resume buttons when no resume is configured", () => {
    render(<App />);
    expect(profile.resume).toBe("");
    expect(screen.queryByRole("link", { name: /resume/i })).not.toBeInTheDocument();
  });

  it("shows a download link once a resume is configured", () => {
    const original = profile.resume;
    profile.resume = "/resume.pdf";
    render(<App />);
    const links = screen.getAllByRole("link", { name: /resume/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links[0]).toHaveAttribute("href", "/resume.pdf");
    profile.resume = original;
  });

  it("offers LinkedIn once (in the contact section, not beside the hero button) and hides GitHub until set", () => {
    render(<App />);
    const linkedin = screen.getAllByRole("link", { name: /linkedin/i });
    expect(linkedin).toHaveLength(1);
    expect(linkedin[0]).toHaveAttribute("href", profile.linkedin);
    expect(within(document.getElementById("top") as HTMLElement).queryByRole("link", { name: /linkedin|github/i })).not.toBeInTheDocument();
    expect(profile.github).toBe("");
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });

  it("does not expose a phone number, call link or WhatsApp link anywhere", () => {
    const { container } = render(<App />);
    expect(container.querySelector('a[href^="tel:"], a[href*="wa.me"], a[href*="whatsapp"]')).toBeNull();
    expect(screen.queryByText(/whatsapp|call me/i)).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\+91|\b\d{10}\b/);
    expect(JSON.stringify(profile)).not.toMatch(/phone|whatsapp|\b\d{10}\b/i);
  });

  it("copies the email to the clipboard from the Copy email card and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));
    await screen.findByText("Copied. Now go send it.");
    expect(writeText).toHaveBeenCalledWith(profile.email);
  });

  it("shows the footer as three centred lines: copyright + stack, the AI confession, then the sign-off", () => {
    render(<App />);
    const norm = (el: HTMLElement) => el.textContent?.replace(/\s+/g, " ").trim();

    const line1 = screen.getByText(/Built with React, Tailwind/);
    const line2 = screen.getByText(/All prompted into existence/);
    const line3 = screen.getByText("No cap. :D");

    expect(norm(line1)).toBe(`© ${new Date().getFullYear()} ${profile.name} · Built with React, Tailwind & a green pipeline ✅`);
    expect(norm(line2)).toBe("All prompted into existence by AI in a few minutes and took the credit.");
    expect(norm(line3)).toBe("No cap. :D");
    expect(aiConfessionLines).toEqual(["All prompted into existence by AI in a few minutes and took the credit.", "No cap. :D"]);

    // each is its own block line, inside one centred paragraph, in order
    const para = line1.parentElement as HTMLElement;
    expect(para).toHaveClass("text-center");
    expect([...para.children]).toEqual([line1, line2, line3]);
    for (const l of [line1, line2, line3]) expect(l).toHaveClass("block");
  });

  it("has no Save contact card or downloadable contact file", () => {
    const { container } = render(<App />);
    expect(screen.queryByRole("link", { name: /save contact/i })).not.toBeInTheDocument();
    expect(container.querySelector("a[download]")).toBeNull();
    expect(container.querySelector('a[href^="data:text/vcard"]')).toBeNull();
  });

  it("provides a mailto contact link", () => {
    render(<App />);
    expect(screen.getAllByRole("link", { name: new RegExp(profile.email) })[0]).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("toggles the mobile menu", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  });

  it("runs the pipeline to completion", () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /run pipeline/i }));
    for (let i = 0; i <= stages.length; i++) {
      act(() => {
        vi.advanceTimersByTime(900);
      });
    }
    expect(screen.getByText(/Deployed\. Zero downtime/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /run again/i })).toBeEnabled();
    vi.useRealTimers();
  });

  it("types out the engineer.yaml terminal", () => {
    vi.useFakeTimers();
    render(<App />);
    const chars = engineerYaml.join("\n").length;
    for (let i = 0; i <= chars; i++) {
      act(() => {
        vi.advanceTimersByTime(22);
      });
    }
    expect(screen.getByLabelText("Terminal animation")).toHaveTextContent("ready: true");
    vi.useRealTimers();
  });
});
