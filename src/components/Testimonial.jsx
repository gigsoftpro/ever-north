import { useState } from "react";
import starImg from "../assets/images/star_2.png";
import { useSiteData } from "./SiteDataContext";

// ── Fallback data ──────────────────────────────────────────────────────────────
const FALLBACK_TESTIMONIALS = [
  {
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    customer_name: "Customer Name",
    rating: 5,
  },
  {
    quote:
      "Working with Ever North has been an absolute pleasure. They manage our rental properties professionally and always communicate proactively. Our rental income has never been higher.",
    customer_name: "Sarah Johnson",
    rating: 5,
  },
  {
    quote:
      "The team at Ever North exceeded every expectation. From tenant screening to maintenance coordination, they handle it all with expertise and care. Highly recommended.",
    customer_name: "Michael Chen",
    rating: 5,
  },
];

// ── Star row — respects `rating` field ────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {[...Array(Math.min(Math.max(count, 1), 5))].map((_, i) => (
        <img key={i} src={starImg} alt="★" className="w-6 h-6 sm:w-7 sm:h-7" />
      ))}
    </div>
  );
}

export default function Testimonial() {
  const { siteData, loading } = useSiteData();
  const [active, setActive] = useState(0);

  const testimonials = siteData?.testimonials?.length
    ? siteData.testimonials
    : FALLBACK_TESTIMONIALS;

  // Keep active index in bounds if list length changes
  const safeActive = active < testimonials.length ? active : 0;
  const current = testimonials[safeActive];

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28 px-4">
      <div className="max-w-[1044px] mx-auto text-center">
        {loading ? (
          /* ── Skeleton ─────────────────────────────────────────────────── */
          <div className="space-y-4 animate-pulse">
            <div className="flex justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-slate-200 rounded"
                />
              ))}
            </div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
            <div className="h-6 bg-slate-200 rounded w-full mx-auto" />
            <div className="h-6 bg-slate-200 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-slate-200 rounded w-32 mx-auto mt-6" />
          </div>
        ) : (
          <>
            {/* Stars */}
            <Stars count={current.rating ?? 5} />

            {/* Quote */}
            <blockquote className="text-[#303030] text-lg sm:text-2xl lg:text-[28px] italic font-semibold leading-9 transition-all duration-500">
              "{current.quote}"
            </blockquote>

            {/* Reviewer name */}
            <p className="text-[#b7a170] text-sm sm:text-base font-normal tracking-[0.4em] uppercase mt-6">
              {current.customer_name}
            </p>

            {/* Dot navigation */}
            <div className="flex justify-center gap-5 mt-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="transition-all duration-300"
                  aria-label={`Testimonial ${i + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 w-2.5 h-2.5 ${
                      i === safeActive ? "bg-[#b7a170]" : "bg-[#303030]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
