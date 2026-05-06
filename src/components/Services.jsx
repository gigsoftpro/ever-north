import shortTermBg from "../assets/images/rectangle_184_copy_7.png";
import longTermBg from "../assets/images/rectangle_184_copy_8.png";
import airbnbBg from "../assets/images/rectangle_184_copy_9.png";
import { useSiteData } from "./SiteDataContext";

// ── Local fallback images per slot ────────────────────────────────────────────
const FALLBACK_IMAGES = [shortTermBg, longTermBg, airbnbBg];

// ── Default fallback service data ─────────────────────────────────────────────
const FALLBACK_SERVICES = [
  {
    title: "Short-Term Rentals",
    description:
      "We handle everything from listing optimization to guest communication, ensuring maximum occupancy and revenue for your property.",
  },
  { title: "Long-Term Rentals", description: "" },
  { title: "Airbnb Management", description: "" },
];

const GoldButton = ({ children, className = "" }) => (
  <button
    className={`font-semibold text-white px-6 py-3 text-sm rounded-sm hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

export default function Services() {
  const { siteData, loading } = useSiteData();

  const services = siteData?.services?.length
    ? siteData.services
    : FALLBACK_SERVICES;

  // Resolve images: prefer backend URL, fall back to local assets
  const getImage = (service, index) =>
    service?.image?.url || FALLBACK_IMAGES[index] || shortTermBg;

  // Section title: not a standalone DB field, derive from first service context
  const sectionTitle = "Our Services";

  // CTA copy (these live in the admin content editor, serve from there eventually)
  const consultationCta = "Book a Consultation";
  const callCta = "Call Us Today";

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-8 lg:px-16 xl:px-20">
        <hr className="border-[#e8e4db] mt-20 lg:mt-28 mb-16 lg:mb-20" />
        <div className="max-w-[1585px] mx-auto">
          <div className="h-10 bg-slate-200 rounded animate-pulse w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-[20px] min-h-[400px] sm:min-h-[537px] bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const card0 = services[0] || FALLBACK_SERVICES[0];
  const card1 = services[1] || FALLBACK_SERVICES[1];
  const card2 = services[2] || FALLBACK_SERVICES[2];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 xl:px-20">
      <hr className="border-[#e8e4db] mt-20 lg:mt-28 mb-16 lg:mb-20" />

      {/* Section Title */}
      <h2 className="text-[#000000] text-4xl sm:text-5xl lg:text-6xl font-light text-center mb-12 lg:mb-16">
        {sectionTitle}
      </h2>

      <div className="max-w-[1585px] mx-auto">
        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 — Full detail (style: full-text) */}
          <div
            className="rounded-[20px] min-h-[400px] sm:min-h-[537px] p-10 sm:p-12 flex flex-col justify-start"
            style={{
              backgroundImage: `url(${getImage(card0, 0)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10 mb-8">
              {card0.title}
            </h3>
            <div className="h-px w-full bg-[#b7a170] mb-6" />
            {card0.description && (
              <p className="text-white text-base sm:text-lg leading-8 opacity-90">
                {card0.description}
              </p>
            )}
            <GoldButton className="w-[35%] mt-4">Contact Us</GoldButton>
          </div>

          {/* Card 2 — Title only */}
          <div
            className="rounded-[20px] min-h-[400px] sm:min-h-[537px] flex items-end p-10 sm:p-12"
            style={{
              backgroundImage: `url(${getImage(card1, 1)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10">
              {card1.title}
            </h3>
          </div>

          {/* Card 3 — Title only */}
          <div
            className="rounded-[20px] min-h-[400px] sm:min-h-[537px] flex items-end p-10 sm:p-12"
            style={{
              backgroundImage: `url(${getImage(card2, 2)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10">
              {card2.title}
            </h3>
          </div>
        </div>

        {/* CTA Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-10">
          <div className="flex flex-wrap gap-3 mx-auto">
            <GoldButton>{consultationCta}</GoldButton>
            <button className="font-semibold text-white px-6 py-3 text-sm bg-[#303030] hover:bg-[#444] transition-colors rounded-sm">
              {callCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
