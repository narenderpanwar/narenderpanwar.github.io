import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { siGithub } from "simple-icons";
import type { Contact, ContactId } from "../lib/contacts";

// LinkedIn is no longer shipped by simple-icons, so the "in" glyph is inlined (24x24 viewBox).
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z";

const BRAND_PATHS: Partial<Record<ContactId, string>> = {
  linkedin: LINKEDIN_PATH,
  github: siGithub.path,
};

export function ContactIcon({ id, size = 20, done = false }: { id: ContactId; size?: number; done?: boolean }) {
  const path = BRAND_PATHS[id];
  if (path) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    );
  }
  const props = { size, strokeWidth: 1.9, "aria-hidden": true } as const;
  if (id === "copy") return done ? <Check {...props} /> : <Copy {...props} />;
  return <Mail {...props} />;
}

const COPIED_MS = 2200;

// Copies `text` and flips `copied` on for a moment. Falls back to a hidden textarea where the async API is missing.
function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      try {
        const ta = Object.assign(document.createElement("textarea"), { value: text });
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {
        ok = false;
      }
    }
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  };

  return [copied, () => void copy()];
}

const cardClass = "brand-card group panel flex w-full items-center gap-3 rounded-xl p-3 pr-4 text-left";

function CardBody({ contact, value, done, trailing }: { contact: Contact; value: ReactNode; done?: boolean; trailing: ReactNode }) {
  return (
    <>
      <span className="brand-tile grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-ink/60">
        <ContactIcon id={contact.id} done={done} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] tracking-wider text-white/40 uppercase">{contact.label}</span>
        <span className="block truncate text-sm font-semibold text-white/90">{value}</span>
      </span>
      {trailing}
    </>
  );
}

const Arrow = () => (
  <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
);

// One card per channel: a link (LinkedIn, GitHub) or a click-to-copy email button.
export function ContactCard({ contact }: { contact: Contact }) {
  const [copied, copy] = useCopy(contact.value);

  if (contact.kind === "copy") {
    return (
      <button type="button" onClick={copy} data-brand={contact.id} className={cardClass}>
        <CardBody
          contact={contact}
          done={copied}
          value={<span aria-live="polite">{copied ? "Copied. Now go send it." : contact.value}</span>}
          trailing={copied ? <Check size={16} aria-hidden="true" className="shrink-0 text-ok" /> : <Copy size={15} aria-hidden="true" className="shrink-0 text-white/30 group-hover:text-white" />}
        />
      </button>
    );
  }

  return (
    <a href={contact.href} data-brand={contact.id} className={cardClass} {...(contact.external ? { target: "_blank", rel: "noreferrer" } : {})}>
      <CardBody contact={contact} value={contact.value} trailing={<Arrow />} />
    </a>
  );
}
