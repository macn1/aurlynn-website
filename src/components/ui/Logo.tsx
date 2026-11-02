import Link from "next/link";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 2 28 24H4L16 2Z" fill="#111" />
      <path d="M16 2 22 13 10 13 16 2Z" fill="#3a332e" />
      <path d="M4 24 16 14l12 10" stroke="#B77A48" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="16" cy="19" r="2.2" fill="#E7C6A4" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Aurlynn home"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <LogoMark />
      <span className="text-[15px] font-medium tracking-[0.34em] text-foreground">AURLYNN</span>
    </Link>
  );
}
