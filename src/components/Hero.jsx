import { useState, useEffect, useRef, useCallback } from "react";
import { useSiteData } from "./SiteDataContext";
import { BaseUrl } from "./Config/BaseUrl";

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
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [carouselData, setCarouselData] = useState(null); // ← FIX: was false
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  const dragStart = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${BaseUrl}content/hero`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        // ← FIX: guard — only store if actually an array
        setCarouselData(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch content:", err);
        setCarouselData([]); // ← FIX: don't leave null forever on error
      }
    };
    fetchContent();
  }, []);

  // ← FIX: always guarantee an array, null falls through to siteData or []
  const raw = carouselData ?? siteData?.hero ?? [];
  const slides = Array.isArray(raw) ? raw : [];
  const count = slides.length;

  const goTo = useCallback(
    (idx) => {
      if (transitioning) return;
      const safeIdx = (idx + count) % count;
      setTransitioning(true);
      setCurrent(safeIdx);
      setTimeout(() => setTransitioning(false), 700);
    },
    [count, transitioning],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // ── Auto-advance ──────────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (count > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((p) => (p + 1) % count);
      }, SLIDE_INTERVAL);
    }
  }, [count]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const handleDot = (idx) => {
    goTo(idx);
    resetTimer();
  };
  const handlePrev = () => {
    prev();
    resetTimer();
  };
  const handleNext = () => {
    next();
    resetTimer();
  };

  // ── Touch ─────────────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    const t = e.touches[0];
    dragStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    isDragging.current = true;
  };
  const onTouchEnd = (e) => {
    if (!isDragging.current || !dragStart.current) return;
    isDragging.current = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = Math.abs(t.clientY - dragStart.current.y);
    const dt = Date.now() - dragStart.current.time;
    if (Math.abs(dx) > 40 && dy < 80 && dt < 500)
      dx < 0 ? handleNext() : handlePrev();
    dragStart.current = null;
  };

  // ── Mouse drag ────────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isDragging.current = true;
  };
  const onMouseUp = (e) => {
    if (!isDragging.current || !dragStart.current) return;
    isDragging.current = false;
    const dx = e.clientX - dragStart.current.x;
    const dt = Date.now() - dragStart.current.time;
    if (Math.abs(dx) > 50 && dt < 500) dx < 0 ? handleNext() : handlePrev();
    dragStart.current = null;
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    dragStart.current = null;
  };

  // ── Wheel ─────────────────────────────────────────────────────────────────
  const wheelLock = useRef(false);
  const onWheel = (e) => {
    if (wheelLock.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 30) return;
    wheelLock.current = true;
    delta > 0 ? handleNext() : handlePrev();
    setTimeout(() => {
      wheelLock.current = false;
    }, 900);
  };

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, transitioning]); // eslint-disable-line

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="space-y-4 w-full max-w-lg text-center px-4">
          <div className="h-12 bg-gray-300 rounded-lg mx-auto w-3/4" />
          <div className="h-12 bg-gray-300 rounded-lg mx-auto w-1/2" />
          <div className="h-10 bg-gray-300 rounded mx-auto w-32 mt-6" />
        </div>
      </section>
    );
  }

  // ── No slides fallback ────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[600px] bg-gray-900 flex items-center justify-center">
        <p className="text-white/60 text-sm">No hero slides configured.</p>
      </section>
    );
  }

  // ── Carousel ──────────────────────────────────────────────────────────────
  return (
    <section
      className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[600px] overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
    >
      {/* ── Slide track ──────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          willChange: "transform",
        }}
      >
        {slides.map((slide, i) => {
          const bgImg = slide.bg_image?.url;

          return (
            <div
              key={slide.id ?? i}
              className="relative flex-shrink-0 w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[600px] flex flex-col"
              style={{
                backgroundImage: bgImg ? `url(${bgImg})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden={i !== current}
            >
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 lg:py-28">
                {/* {(slide.title || slide.highlighted_word) && (
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg max-w-3xl">
                    {slide.title && <span>{slide.title} </span>}
                    {slide.highlighted_word && (
                      <span style={{ color: "#b7a170" }}>
                        {slide.highlighted_word}
                      </span>
                    )}
                  </h1>
                )} */}

                {/* {slide.cta_text && (
                  <button className="mt-2 px-8 py-3 text-base font-semibold text-white rounded-full border-2 border-white/80 hover:bg-white hover:text-gray-900 transition-all duration-200 backdrop-blur-sm">
                    {slide.cta_text}
                  </button>
                )} */}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Prev / Next arrows ───────────────────────────────────────────── */}
      {count > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* ── Dot indicators ───────────────────────────────────────────────── */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full border-2 border-white transition-all duration-300 focus:outline-none"
              style={{
                width: i === current ? "28px" : "14px",
                height: "14px",
                backgroundColor: i === current ? "#b7a170" : "rgba(0,0,0,0.6)",
                borderRadius: i === current ? "7px" : "50%",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
