import { profile } from "../data/profile";

export type ContactId = "linkedin" | "github" | "email" | "copy";
export type ContactKind = "link" | "copy";

export interface Contact {
  id: ContactId;
  label: string;
  value: string;
  href: string;
  external: boolean;
  kind: ContactKind;
}

// "https://www.linkedin.com/in/narenderpnwr/" -> "narenderpnwr"
export function handleFromUrl(url: string): string {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).pop() ?? url;
  } catch {
    return url;
  }
}

type Source = Pick<typeof profile, "email" | "linkedin" | "github">;

// Single source for every contact surface. Link entries without a URL are dropped (e.g. GitHub until set).
export function getContacts(p: Source = profile): Contact[] {
  const all: Contact[] = [
    { id: "linkedin", label: "LinkedIn", value: handleFromUrl(p.linkedin), href: p.linkedin, external: true, kind: "link" },
    { id: "github", label: "GitHub", value: handleFromUrl(p.github), href: p.github, external: true, kind: "link" },
    { id: "email", label: "Email", value: p.email, href: `mailto:${p.email}`, external: false, kind: "link" },
    { id: "copy", label: "Copy email", value: p.email, href: "", external: false, kind: "copy" },
  ];
  return all.filter((c) => c.kind !== "link" || c.href);
}
