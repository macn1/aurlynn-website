import { Route, Routes } from "react-router-dom";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Home } from "./Home";
import { ScrollManager } from "./ScrollManager";
function App() {
  return <>
      <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-dark focus:px-4 focus:py-2 focus:text-sm focus:text-white"
  >
        Skip to content
      </a>
      <SmoothScroll />
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>;
}
export {
  App
};
