import { Link } from "@/components/ui/Link";
import { ArrowRight } from "lucide-react";
const base = "group relative inline-flex h-[max(36px,calc(var(--u)*3.46))] items-center justify-center gap-[calc(var(--u)*0.95)] rounded-full px-[calc(var(--u)*1.95)] text-[max(12.5px,calc(var(--u)*1.17))] font-medium tracking-[0.005em] transition-[background-color,color,border-color,transform,box-shadow] duration-250 ease-[var(--ease-out-power3)] active:scale-[0.98]";
const variants = {
  dark: "bg-dark text-white shadow-[0_10px_30px_-12px_rgba(17,17,17,0.55)] hover:bg-[#2a2420] hover:shadow-[0_14px_34px_-12px_rgba(183,122,72,0.55)]",
  outline: "border border-border bg-glass text-foreground backdrop-blur-sm hover:border-accent/60 hover:bg-white"
};
function Button({ variant = "dark", icon, arrow, className = "", children, ...rest }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight
    aria-hidden
    size={15}
    className="transition-transform duration-250 ease-[var(--ease-out-power3)] group-hover:translate-x-0.5"
  />}
    </Link>;
}
export {
  Button
};
