import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const t = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 20) {
        clearInterval(t);
        el?.scrollIntoView();
      }
    }, 50);
    return () => clearInterval(t);
  }, [pathname, hash]);
  return null;
}
export {
  ScrollManager
};
