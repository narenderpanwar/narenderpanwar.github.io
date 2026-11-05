import { FileDown } from "lucide-react";
import { profile } from "../data/profile";

interface Props {
  className?: string;
  label?: string;
}

// Renders nothing until `profile.resume` is set, so there is never a dead link.
export function ResumeLink({ className = "", label = "Download resume" }: Props) {
  if (!profile.resume) return null;
  return (
    <a
      href={profile.resume}
      download
      className={`inline-flex items-center gap-2 font-semibold transition-colors ${className}`}
    >
      <FileDown size={18} /> {label}
    </a>
  );
}
