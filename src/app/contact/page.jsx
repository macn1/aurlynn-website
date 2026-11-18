import { Suspense } from "react";
import Contact from "@/views/Contact";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-hidden />}>
      <Contact />
    </Suspense>
  );
}
