"use client";
import dynamic from "next/dynamic";

// Client-only heavy components (three.js scenes): never server-rendered.
function lazyClient(load) {
  return dynamic(load, { ssr: false, loading: () => null });
}

export { lazyClient };
