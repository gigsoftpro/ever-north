import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSiteData } from "./SiteDataContext";

const SLIDE_INTERVAL = 5000;

// ── Arrow icons ───────────────────────────────────────────────────────────────
function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function Hero() {
  const { siteData, loading } = useSiteData();

  // ── Optimized slides memo ────────────────────────────────────────────────
  const slides = useMemo(() => siteData?.hero ?? [], [siteData]);

  const [current, setCurrent] = useState(0);

  const timerRef = useRef(null);

  const count = slides.length;

  // ── Navigation ───────────────────────────────────────────────────────────
  const goTo = useCallback(
    (idx) => {
      if (count === 0) return;

      const safeIdx = (idx + count) % count;

      setCurrent(safeIdx);
    },
    [count],
  );

  const next = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  // ── Auto slider ──────────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);

    if (count > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % count);
      }, SLIDE_INTERVAL);
    }
  }, [count]);

  useEffect(() => {
    resetTimer();

    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  // ── Keyboard support ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  // ── Touch swipe ──────────────────────────────────────────────────────────
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;

    const diff = touchStartX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }

      resetTimer();
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative w-full h-[60vh] lg:h-[700px] bg-gray-200 animate-pulse" />
    );
  }

  // ── No slides ────────────────────────────────────────────────────────────
  if (!count) {
    return (
      <section className="relative w-full h-[60vh] lg:h-[700px] bg-black flex items-center justify-center">
        <p className="text-white">No slides found.</p>
      </section>
    );
  }

  // ── Current slide only (MAJOR PERFORMANCE BOOST) ────────────────────────
  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[700px] overflow-hidden select-none bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Image ─────────────────────────────────────────────── */}
      <img
        src={slide.bg_image?.url}
        alt={slide.title || "Hero Banner"}
        className="absolute inset-0 w-full h-full object-cover"
        loading={current === 0 ? "eager" : "lazy"}
        fetchPriority={current === 0 ? "high" : "auto"}
        decoding="async"
      />

      {/* ── Dark Overlay (FASTER than overlay image) ───────────────────── */}
      <div className="absolute inset-0 bg-black/25 z-[1]" />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* {slide.title && (
          <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-bold max-w-5xl leading-tight">
            {slide.title}
          </h1>
        )} */}

        {/* {slide.subtitle && (
          <p className="text-white/90 mt-5 text-base sm:text-lg max-w-2xl">
            {slide.subtitle}
          </p>
        )} */}

        {slide.button_text && slide.button_link && (
          <a
            href={slide.button_link}
            className="mt-8 inline-flex items-center justify-center px-7 py-3 bg-[#b7a170] hover:bg-[#9f8c60] text-white font-medium rounded-md transition-all duration-300"
          >
            {slide.button_text}
          </a>
        )}
      </div>

      {/* ── Prev Button ─────────────────────────────────────────────────── */}
      {count > 1 && (
        <button
          onClick={() => {
            prev();
            resetTimer();
          }}
          aria-label="Previous Slide"
          className="
            absolute left-4 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 rounded-full
            flex items-center justify-center
            bg-black/40 hover:bg-black/60
            text-white
            backdrop-blur-sm
            border border-white/20
            transition-all duration-200
            hover:scale-110
          "
        >
          <ChevronLeft />
        </button>
      )}

      {/* ── Next Button ─────────────────────────────────────────────────── */}
      {count > 1 && (
        <button
          onClick={() => {
            next();
            resetTimer();
          }}
          aria-label="Next Slide"
          className="
            absolute right-4 top-1/2 -translate-y-1/2 z-20
            w-11 h-11 rounded-full
            flex items-center justify-center
            bg-black/40 hover:bg-black/60
            text-white
            backdrop-blur-sm
            border border-white/20
            transition-all duration-200
            hover:scale-110
          "
        >
          <ChevronRight />
        </button>
      )}

      {/* ── Dots ────────────────────────────────────────────────────────── */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i);
                resetTimer();
              }}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full border-2 border-white transition-all duration-300"
              style={{
                width: i === current ? "28px" : "14px",
                height: "14px",
                backgroundColor:
                  i === current ? "#b7a170" : "rgba(255,255,255,0.3)",
                borderRadius: i === current ? "7px" : "50%",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
