import { useState, useEffect, useRef, useCallback } from "react";
import heroBg from "../assets/images/rectangle_9_copy.jpg";
import heroOverlay from "../assets/images/rectangle_189.png";
import { useSiteData } from "./SiteDataContext";

const SLIDE_INTERVAL = 5000;

function splitTitle(title) {
  if (!title) return ["", ""];
  const words = title.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default function Hero() {
  const { siteData, loading } = useSiteData();
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  // siteData.hero is now an array of slides
  const slides = siteData?.hero ?? [];
  const count = slides.length;

  const goTo = useCallback(
    (idx) => {
      if (idx === current || transitioning) return;
      setTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setTransitioning(false), 700);
    },
    [current, transitioning],
  );

  const advance = useCallback(() => {
    setCurrent((prev) => {
      const next = (prev + 1) % count;
      return next;
    });
  }, [count]);

  // Auto-advance
  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [count, advance]);

  // Reset timer when user clicks a dot
  const handleDot = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    if (count > 1) {
      timerRef.current = setInterval(advance, SLIDE_INTERVAL);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <section
        className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[500px] flex flex-col"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${heroOverlay})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex-1 flex flex-col items-center justify-start text-center px-4 py-16">
          <div className="space-y-4 w-full max-w-lg animate-pulse">
            <div className="h-12 bg-white/20 rounded-lg mx-auto w-3/4" />
            <div className="h-12 bg-white/20 rounded-lg mx-auto w-1/2" />
            <div className="h-10 bg-white/20 rounded mx-auto w-32 mt-6" />
          </div>
        </div>
      </section>
    );
  }

  // ── No slides fallback ─────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <section
        className="relative w-full min-h-[30vh] sm:min-h-[70vh] lg:min-h-[808px] flex flex-col"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroOverlay})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <p className="text-white/60 text-sm">No hero slides configured.</p>
        </div>
      </section>
    );
  }

  // ── Carousel ───────────────────────────────────────────────────────────────
  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[600px] overflow-hidden">
      {/* Slide track */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          willChange: "transform",
        }}
      >
        {slides.map((slide, i) => {
          const bgImg = slide.bg_image?.url || heroBg;
          const ovImg = slide.overlay_image?.url || heroOverlay;
          const titleLines = splitTitle(slide.title);

          return (
            <div
              key={slide.id ?? i}
              className="relative flex-shrink-0 w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[600px] flex flex-col"
              style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden={i !== current}
            >
              {/* Overlay image */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${ovImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-start text-center px-4 py-16 sm:py-20 lg:py-28">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-normal leading-tight drop-shadow-md mb-6">
                  {titleLines.map((line, li) => (
                    <span key={li}>
                      {line}
                      {li < titleLines.length - 1 && <br />}
                    </span>
                  ))}
                  {slide.highlighted_word && (
                    <span className="text-[#b7a170] italic font-bold">
                      {" "}
                      {slide.highlighted_word}
                    </span>
                  )}
                </h1>

                {slide.cta_text && (
                  <button
                    className="font-semibold text-white px-8 py-3  hover:opacity-90 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
                    }}
                  >
                    {slide.cta_text}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot navigation */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="w-3 h-3 rounded-full border-2 border-white transition-all duration-300 focus:outline-none"
              style={{
                backgroundColor: i === current ? "#b7a170" : "rgba(0,0,0,0.75)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
