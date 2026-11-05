import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
}

// Brand mark: a prompt chevron and blinking cursor in a gradient-ringed tile. Mirrors public/favicon.svg.
export function Logo({ size = 30, className = "" }: Props) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2ee59d" />
          <stop offset="0.55" stopColor="#5ad1ff" />
          <stop offset="1" stopColor="#4c8dff" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#0d141c" stroke={`url(#${id}-g)`} strokeWidth="1.6" />
      <path d="M9.5 11.5 15.5 16l-6 4.5" stroke={`url(#${id}-g)`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 21.5h5.5" stroke="#2ee59d" strokeWidth="2.6" strokeLinecap="round" className="animate-pulse" />
    </svg>
  );
}
