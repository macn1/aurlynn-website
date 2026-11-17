import { Check, Minus } from "lucide-react";

/** Two-column comparison. rows: [[left, right]]. Semantic table for accessibility and answer engines. */
export function ComparisonTable({ caption, left, right, rows, dark = false }) {
  const line = dark ? "border-white/10" : "border-border";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-collapse text-left text-[0.95rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className={`border-b ${line}`}>
            <th scope="col" className="w-1/2 py-4 pr-4 font-[family-name:var(--font-sora)] text-lg font-medium text-accent">
              {left}
            </th>
            <th scope="col" className={`w-1/2 py-4 font-[family-name:var(--font-sora)] text-lg font-medium ${dark ? "text-white/60" : "text-secondary"}`}>
              {right}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a} className={`border-b ${line}`}>
              <td className="py-3.5 pr-4 align-top">
                <span className="flex gap-2.5">
                  <Check aria-hidden size={16} className="mt-1 shrink-0 text-accent" />
                  {a}
                </span>
              </td>
              <td className={`py-3.5 align-top ${dark ? "text-white/60" : "text-secondary"}`}>
                <span className="flex gap-2.5">
                  <Minus aria-hidden size={16} className="mt-1 shrink-0 opacity-50" />
                  {b}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
