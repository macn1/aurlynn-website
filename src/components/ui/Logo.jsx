"use client";
import { Link } from "@/components/ui/Link";
function LogoMark({ size = 34 }) {
  return <img src="/brand/aurlynn-mark.png" alt="" aria-hidden width={size} height={Math.round(size * 0.868)} style={{ width: size, height: "auto" }} />;
}
function Logo({ className = "" }) {
  return <Link
    href="/"
    aria-label="Aurlynn home"
    className={`inline-flex items-center gap-2.5 ${className}`}
  >
      <LogoMark />
      <span className="text-[15px] font-medium tracking-[0.34em] text-foreground">AURLYNN</span>
    </Link>;
}
export {
  Logo,
  LogoMark
};
