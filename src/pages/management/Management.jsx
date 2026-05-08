import img1 from "../../assets/images/ellipse_22_copy.png";
import img2 from "../../assets/images/ellipse_22_copy_2_2.png";
import img3 from "../../assets/images/ellipse_22_copy_3_2.png";

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

const GoldButton = ({ children, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap font-semibold text-white px-5 sm:px-6 py-3 text-sm sm:text-base hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

/* Skeleton card — same sizing as real card */
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

export default function Management() {
  const { siteData, loading } = useSiteData();

  const meta = siteData?.cleaning?.meta;
  const rawItems = siteData?.cleaning?.items;

  const sectionTitle = meta?.title || "Property Management & Maintenance";
  const words = sectionTitle.split(" ");
  const middle = Math.ceil(words.length / 2);
  const titleLines = [
    words.slice(0, middle).join(" "),
    words.slice(middle).join(" "),
  ];

  /* ── Build the full resolved list ── */
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

  /* Simulate async "fetch" delay for skeleton effect */
  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + LOAD_MORE_COUNT, allItems.length),
      );
      setIsFetchingMore(false);
    }, 800); // 800 ms skeleton window
  }, [isFetchingMore, hasMore, allItems.length]);

  /* IntersectionObserver on the sentinel div */
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

  /* ── Section-level skeleton (data still loading) ── */
  if (loading) {
    return (
      <section className="w-full bg-[#f7f2e8] overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="h-10 w-56 sm:w-72 lg:w-80 bg-slate-300 rounded animate-pulse mb-10 md:mb-12" />
          <hr className="border-[#8f7334] mb-12 lg:mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
            {Array.from({ length: INITIAL_LOAD }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f7f2e8] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto py-16 lg:py-24 px-4">
        {/* ── Header ── */}
        {/* <div className="flex flex-col md:flex-row md:items-end lg:items-center justify-between gap-6 mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-[#000000] text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.25] max-w-[760px]">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i !== titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <GoldButton
            className="self-start md:self-auto shrink-0"
            onClick={() => {
              window.location.href = "/property-management";
            }}
          >
            More Services
          </GoldButton>
        </div> */}

        {/* <hr className="border-[#b7a170] mb-10 lg:mb-12" /> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
          {displayedItems.map(
            ({ img, label, title, para, description }, idx) => (
              <div
                key={`${label}-${idx}`}
                className="flex flex-col items-center text-center min-w-0"
              >
                <div
                  className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 0 36px 0 rgba(151,126,68,0.22)" }}
                >
                  <img
                    src={img}
                    alt={label}
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover"
                  />
                </div>

                <div className="mt-6 w-full min-w-0">
                  <h3 className="text-[#000000] text-xl sm:text-[22px] font-semibold mb-4">
                    {title}
                  </h3>
                  {description && para && (
                    <p className="text-[#000000] font-medium leading-7 sm:leading-8 text-base sm:text-lg max-w-[34ch] mx-auto">
                      {description || para}
                    </p>
                  )}
                </div>

                <GoldButton className="mt-5">Contact Us</GoldButton>
              </div>
            ),
          )}

          {/* Skeleton cards shown while fetching next batch */}
          {isFetchingMore &&
            Array.from({
              length: Math.min(LOAD_MORE_COUNT, allItems.length - visibleCount),
            }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
        </div>

        {/* ── Sentinel: triggers IntersectionObserver ── */}
        {hasMore && (
          <div ref={sentinelRef} className="h-10 mt-4" aria-hidden="true" />
        )}

        {/* ── End-of-list message ── */}
        {/* {!hasMore && allItems.length > INITIAL_LOAD && (
          <p className="text-center text-[#8f7334] font-medium mt-10 text-sm tracking-wide">
            All {allItems.length} services loaded
          </p>
        )} */}
      </div>
    </section>
  );
}
