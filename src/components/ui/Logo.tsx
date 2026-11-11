import Image from "next/image";
import Link from "next/link";

export function LogoMark({ size = 34 }: { size?: number }) {
  // Brand emblem, cut out of the light-theme logo with a transparent background.
  return <Image src="/brand/aurlynn-mark.png" alt="" aria-hidden width={size} height={Math.round(size * 0.868)} priority style={{ width: size, height: "auto" }} />;
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
