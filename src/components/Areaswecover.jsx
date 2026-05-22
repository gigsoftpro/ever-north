import { useEffect, useMemo, useRef, useState } from "react";

import areaBg from "../assets/images/vector_smart_object_copy.png";
import saubleBeach from "../assets/images/rectangle_178.png";
import left from "../assets/images/left.png";
import right from "../assets/images/right.png";
import lakeHuron1 from "../assets/images/rectangle_178_copy_6.png";
import grandBen from "../assets/images/rectangle_178_copy_4.png";
import { useSiteData } from "./SiteDataContext";

// ── Fallback area data ─────────────────────────────────────────────────────────
const FALLBACK_AREAS = [
  { img: grandBen, label: "Grand Ben" },
  { img: saubleBeach, label: "Sauble Beach" },
  { img: lakeHuron1, label: "Lake Huron" },
  { img: lakeHuron1, label: "Lake Huron" },
];

export default function AreasWeCover() {
  const { siteData, loading } = useSiteData();

  const meta = siteData?.areas?.meta;
  const areas = siteData?.areas?.areas;

  // ── Section copy ───────────────────────────────────────────────────────────
  const heading = meta?.title || "Areas We Cover";
  const subtitle =
    meta?.subtitle ||
    "A selection of the properties we proudly manage across the Greater Toronto Area.";

  // ── Build display areas ────────────────────────────────────────────────────
  const displayAreas = useMemo(() => {
    return areas?.length
      ? areas.map((area, i) => ({
          img:
            area.image?.url ||
            FALLBACK_AREAS[i % FALLBACK_AREAS.length]?.img ||
            grandBen,
          label: area.name,
        }))
      : FALLBACK_AREAS;
  }, [areas]);

  // ── Infinite slider setup ──────────────────────────────────────────────────
  const duplicatedAreas = [...displayAreas, ...displayAreas, ...displayAreas];

  const [currentIndex, setCurrentIndex] = useState(displayAreas.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const sliderRef = useRef(null);

  // ── Responsive cards count ─────────────────────────────────────────────────
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Auto infinite scroll ───────────────────────────────────────────────────
  useEffect(() => {
    if (loading || displayAreas.length <= cardsToShow) return;

    const interval = setInterval(() => {
      handleNext();
    }, 1500);

    return () => clearInterval(interval);
  }, [currentIndex, cardsToShow, loading, displayAreas.length]);

  // ── Infinite loop correction ───────────────────────────────────────────────
  useEffect(() => {
    if (!displayAreas.length) return;

    if (currentIndex >= displayAreas.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(displayAreas.length);

        setTimeout(() => {
          setIsTransitioning(true);
        }, 50);
      }, 700);
    }

    if (currentIndex <= 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(displayAreas.length);

        setTimeout(() => {
          setIsTransitioning(true);
        }, 50);
      }, 700);
    }
  }, [currentIndex, displayAreas.length]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // ── Card width calculations ────────────────────────────────────────────────
  const cardWidth = 100 / cardsToShow;

  return (
    <section
      className="w-full bg-[#303030] pb-16 sm:pb-20 lg:pb-28 py-20 overflow-hidden"
      style={{
        backgroundImage: `url(${areaBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Heading */}
      <div className="px-4 max-w-[1440px] mx-auto">
        <div className="mb-10">
          {loading ? (
            <>
              <div className="h-14 bg-white/20 rounded animate-pulse w-80 mb-3" />
              <div className="h-5 bg-white/20 rounded animate-pulse w-96" />
            </>
          ) : (
            <>
              <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light mb-2">
                {heading}
              </h2>

              <p className="text-white text-base sm:text-lg text-center sm:text-left">
                {subtitle}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="px-4 max-w-[1440px] mx-auto overflow-hidden px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-[20px] sm:rounded-[40px] h-48 sm:h-56 lg:h-64 bg-white/20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <div
                ref={sliderRef}
                className="flex gap-5 sm:gap-5"
                style={{
                  transform: `translateX(-${currentIndex * cardWidth}%)`,
                  transition: isTransitioning
                    ? "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)"
                    : "none",
                }}
              >
                {duplicatedAreas.map(({ img, label }, i) => (
                  <div
                    key={`${label}-${i}`}
                    className="relative rounded-t-[20px] sm:rounded-t-[40px] overflow-hidden flex-shrink-0"
                    style={{
                      width: `calc(${cardWidth}% - 20px)`,
                      minHeight: "200px",
                    }}
                  >
                    <img
                      src={img}
                      alt={label}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#303030] via-[#303030]/95 to-transparent py-5 rounded-b-[20px] sm:rounded-b-[0px]">
                      <p className="text-white font-semibold text-center uppercase tracking-wide text-sm sm:text-base">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="flex justify-center items-center gap-5 mt-10">
              <button
                onClick={handlePrev}
                className="group"
              >
                <img
                  src={left}
                  alt="scroll left"
                  className="h-2.5"
                />
              </button>

              <button
                onClick={handleNext}
                className="group"
              >
                <img
                  src={right}
                  alt="scroll right"
                  className="h-2.5"
                />
              </button>
            </div> */}
          </>
        )}
      </div>
    </section>
  );
}
