import { useEffect, useState } from "react";

/**
 * ✅ Animated background:
 *  - OUTER div → scroll parallax (translateY from scrollY)
 *  - INNER div → idle "blob" float animation
 *    (kept separate so the CSS animation never fights the inline transform)
 *  - dark mode → darker base + softer blobs via dark: classes
 */
export default function Background() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* base color follows the theme */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500" />

      {/* blob 1 — slow parallax down */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      >
        <div className="w-full h-full rounded-full bg-purple-400/30 dark:bg-purple-600/15 blur-[120px] animate-blob" />
      </div>

      {/* blob 2 — moves opposite direction */}
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
      >
        <div className="w-full h-full rounded-full bg-blue-400/30 dark:bg-blue-600/15 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* blob 3 — faster parallax */}
      <div
        className="absolute top-[20%] right-[15%] w-[40%] h-[40%] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="w-full h-full rounded-full bg-pink-400/20 dark:bg-pink-600/10 blur-[120px] animate-blob animation-delay-4000" />
      </div>
    </div>
  );
}
