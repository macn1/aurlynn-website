import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules") && /[\\/](three|@react-three)[\\/]/.test(id)) return "three";
          if (id.includes("node_modules") && /[\\/](framer-motion|motion-dom|motion-utils|gsap|lenis)[\\/]/.test(id)) return "motion";
        },
      },
    },
  },
});
