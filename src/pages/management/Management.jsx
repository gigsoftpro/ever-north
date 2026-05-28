import img1 from "../../assets/images/ellipse_22_copy.png";
import img2 from "../../assets/images/ellipse_22_copy_2_2.png";
import img3 from "../../assets/images/ellipse_22_copy_3_2.png";
import abtBanner from "../../assets/images/About-banner.jpg";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSiteData } from "../../components/SiteDataContext";

const FALLBACK_IMAGES = [img1, img2, img3];

const FALLBACK_ITEMS = [
  {
    label: "Deep Cleaning",
    title: "Cleaning Services",
    para: "Professional deep cleaning services keeping your properties spotless and guest-ready at all times.",
  },
  {
    label: "Regular Maintenance",
    title: "Glass Repair",
    para: "Expert glass and window repair services handled quickly to keep your properties in perfect condition.",
  },
  {
    label: "Move-In Cleaning",
    title: "Lawn Care & Landscaping",
    para: "Complete outdoor care solutions maintaining curb appeal and property value throughout every season.",
  },
];

const INITIAL_LOAD = 8;
const LOAD_MORE_COUNT = 4;

// ─── Gold Button ──────────────────────────────────────────────────────────────
const GoldButton = ({ children, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap font-semibold text-white px-5 sm:px-6 py-3 text-sm sm:text-base hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="w-full flex flex-col items-center text-center min-w-0">
    <div
      className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-slate-200 animate-pulse shrink-0"
      style={{ boxShadow: "0 0 36px 0 rgba(151,126,68,0.12)" }}
    />
    <div className="mt-6 w-full flex flex-col items-center gap-3">
      <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-56 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
    </div>
    <div className="mt-5 h-10 w-28 bg-slate-200 rounded animate-pulse" />
  </div>
);

// ─── Page Skeleton (full page loading state) ──────────────────────────────────
const PageSkeleton = () => (
  <>
    {/* Banner skeleton */}
    <section className="relative flex min-h-[600px] items-center overflow-hidden bg-slate-300 animate-pulse">
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5">
        <div className="flex flex-col items-center gap-5">
          <div className="h-12 w-2/3 bg-slate-400 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-slate-400 rounded animate-pulse" />
          <div className="h-10 w-36 bg-slate-400 rounded animate-pulse" />
        </div>
      </div>
    </section>

    {/* Grid skeleton */}
    <section className="w-full bg-[#f7f2e8] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto py-16 lg:py-24 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
          {Array.from({ length: INITIAL_LOAD }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Management() {
  const { siteData, loading, error, refetch } = useSiteData();

  /* ── Build the full resolved list ── */
  const rawItems = siteData?.cleaning?.items;

  const allItems = rawItems?.length
    ? rawItems.map((item, i) => ({
        img:
          item.image?.url ||
          FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] ||
          img1,
        label:
          item.label ||
          FALLBACK_ITEMS[i % FALLBACK_ITEMS.length]?.label ||
          `Service ${i + 1}`,
        title:
          item.title ||
          item.label ||
          FALLBACK_ITEMS[i % FALLBACK_ITEMS.length]?.title ||
          "",
        para:
          item.description ||
          FALLBACK_ITEMS[i % FALLBACK_ITEMS.length]?.para ||
          "",
      }))
    : FALLBACK_ITEMS.map((fb, i) => ({
        img: FALLBACK_IMAGES[i],
        label: fb.label,
        title: fb.title,
        para: fb.para,
      }));

  /* ── Infinite-scroll state ── */
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef(null);
  const hasMore = visibleCount < allItems.length;

  // ── Reset visible count when data changes (after re-fetch) ────────────────
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [siteData]);

  /* Simulate async "fetch" delay for skeleton effect */
  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + LOAD_MORE_COUNT, allItems.length),
      );
      setIsFetchingMore(false);
    }, 800);
  }, [isFetchingMore, hasMore, allItems.length]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const displayedItems = allItems.slice(0, visibleCount);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) return <PageSkeleton />;

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="min-h-screen w-full bg-[#f7f2e8] flex flex-col items-center justify-center gap-5">
        <p className="text-red-500 text-lg font-medium text-center px-4">
          {error}
        </p>
        <GoldButton onClick={refetch}>Try Again</GoldButton>
      </section>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Banner ── */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${abtBanner})` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5">
          <div className="text-center">
            <h1 className="mb-5 text-4xl font-bold md:text-5xl">
              Personal Property Management in{" "}
              <span className="text-[#b7a170] italic font-bold">Ontario</span>
            </h1>
            <p className="mx-auto mb-10 max-w-4xl text-xl text-white/90">
              Delivering trusted property management solutions with innovation,
              transparency, and long-term value.
            </p>
            <a
              href="/contact-us"
              className="inline-block bg-gradient-to-t from-[#8f7334] to-[#b7a170] px-[35px] py-[10px] text-lg font-medium text-white transition duration-300 hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="w-full bg-[#f7f2e8] overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto py-16 lg:py-24 px-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-10 sm:gap-x-8 sm:gap-y-10 justify-center">
            {displayedItems.map(({ img, label, title, para }, idx) => (
              <div
                key={`${label}-${idx}`}
                className="w-full md:max-w-[47.5%] mx-auto sm:w-[calc((100%-2rem)/2)] flex flex-col items-center justify-between text-center bg-[#f1f1f16b] p-4 md:p-8 border border-[#dddddd91] rounded-xl"
              >
                <div className="w-full">
                  <div
                    className="w-full bg-white flex items-center justify-center overflow-hidden rounded-xl"
                    style={{ boxShadow: "0 0 36px 0 rgba(151,126,68,0.22)" }}
                  >
                    <img
                      src={img}
                      alt={label}
                      className="h-[350px] w-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Text */}
                  <div className="mt-6 w-full min-w-0">
                    <h3 className="text-[#000000] text-xl sm:text-[22px] font-semibold mb-4">
                      {title}
                    </h3>
                    {para && (
                      <p className="text-[#000000] font-medium leading-7 sm:leading-8 text-base sm:text-lg w-full md:max-w-[74ch] mx-auto">
                        {para}
                      </p>
                    )}
                  </div>
                </div>

                <GoldButton className="mt-5">Contact Us</GoldButton>
              </div>
            ))}

            {/* Skeleton placeholders while loading more */}
            {isFetchingMore &&
              Array.from({
                length: Math.min(
                  LOAD_MORE_COUNT,
                  allItems.length - visibleCount,
                ),
              }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
          </div>

          {/* Intersection sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="h-10 mt-4" aria-hidden="true" />
          )}
        </div>
      </section>
    </>
  );
}
