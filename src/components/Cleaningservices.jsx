import img1 from "../assets/images/ellipse_22_copy.png";
import img2 from "../assets/images/ellipse_22_copy_2_2.png";
import img3 from "../assets/images/ellipse_22_copy_3_2.png";
import { useSiteData } from "./SiteDataContext";

// ── Fallback images per slot ───────────────────────────────────────────────────
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

const GoldButton = ({ children, className = "" }) => (
  <button
    className={`font-semibold text-white px-6 py-3 text-base hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

export default function CleaningServices() {
  const { siteData, loading } = useSiteData();

  const meta = siteData?.cleaning?.meta;
  const items = siteData?.cleaning?.items;

  // ── Section heading ────────────────────────────────────────────────────────
  const sectionTitle = meta?.title || "Property Management & Maintenance";

  // ── Build display items ────────────────────────────────────────────────────
  // Each backend item: { id, label, image: { url }, sort_order }
  // We map to a display card merging label + fallback title/para
  const displayItems = items?.length
    ? items.slice(0, 3).map((item, i) => ({
        img: item.image?.url || FALLBACK_IMAGES[i] || img1,
        label: item.label || FALLBACK_ITEMS[i]?.label || `Service ${i + 1}`,
        title: item.label || FALLBACK_ITEMS[i]?.title || "",
        para: item.description || FALLBACK_ITEMS[i]?.para || "",
      }))
    : FALLBACK_ITEMS.map((fb, i) => ({
        img: FALLBACK_IMAGES[i],
        label: fb.label,
        title: fb.title,
        para: fb.para,
      }));

  if (loading) {
    return (
      <section className="w-full bg-[#f7f2e8] py-16 lg:py-24 px-4 sm:px-8 lg:px-16 xl:px-32">
        <div className="h-10 bg-slate-300 rounded animate-pulse w-80 mb-12" />
        <hr className="border-[#8f7334] mb-16" />
        <div className="max-w-[1333px] mx-auto flex flex-wrap justify-center gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4 w-[30%]">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-slate-300 animate-pulse" />
              <div className="h-6 w-40 bg-slate-300 rounded animate-pulse mt-6" />
              <div className="h-16 w-full max-w-[320px] bg-slate-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f7f2e8] py-16 lg:py-24 px-4 sm:px-8 lg:px-16 xl:px-32">
      {/* Header row */}
      <div className="flex items-center justify-between mb-12 lg:mb-16">
        <h2 className="text-[#000000] text-4xl sm:text-5xl lg:text-5xl font-light leading-18">
          {sectionTitle.includes("\n")
            ? sectionTitle.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))
            : sectionTitle}
        </h2>
        <GoldButton className="mt-4 text-base">More Services</GoldButton>
      </div>

      <hr className="border-[#8f7334] mb-16" />

      <div className="max-w-[1333px] mx-auto">
        <div className="flex flex-wrap justify-between mb-10">
          {displayItems.map(({ img, label, title, para }, idx) => (
            <div
              key={`${label}-${idx}`}
              className="flex flex-col items-center gap-4 w-full sm:w-[45%] lg:w-[30%] mb-10 lg:mb-0"
            >
              {/* Circle image */}
              <div
                className="w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: "0 0 36px 0 rgba(151,126,68,0.22)" }}
              >
                <img
                  src={img}
                  alt={label}
                  className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="text-center mt-6">
                <h3 className="text-[#000000] text-[22px] font-semibold mb-4">
                  {title}
                </h3>
                {para && (
                  <p className="text-[#000000] font-medium leading-8 max-w-[506px] mx-auto text-base sm:text-lg">
                    {para}
                  </p>
                )}
              </div>

              <GoldButton className="mt-4">Contact Us</GoldButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
