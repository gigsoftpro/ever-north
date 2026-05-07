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
  {
    title: "Long-Term Rentals",
    description:
      "We handle everything from listing optimization to guest communication, ensuring maximum occupancy and revenue for your property.",
  },
  {
    title: "Airbnb Management",
    description:
      "We handle everything from listing optimization to guest communication, ensuring maximum occupancy and revenue for your property.",
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

// ── Shared Service Card ────────────────────────────────────────────────────────
const ServiceCard = ({ service, image }) => (
  <div
    className="group rounded-[20px] min-h-[400px] sm:min-h-[537px] p-10 sm:p-12 flex flex-col justify-end overflow-hidden relative"
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Subtle dark overlay on hover */}
    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-700 ease-in-out rounded-[20px]" />
    {/* Title — slides up on hover */}
    <div className="relative z-10 transform transition-all duration-700 ease-in-out group-hover:-translate-y-4">
      <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10">
        {service.title}
      </h3>
    </div>

    {/* Hover Content */}
    <div className="relative z-10 opacity-0 translate-y-10 max-h-0 overflow-hidden transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-[300px] mt-0 group-hover:mt-6">
      <div className="h-px w-full bg-[#b7a170] mb-6" />

      {service.description && (
        <p className="text-white text-base sm:text-lg leading-8 opacity-90 mb-4">
          {service.description}
        </p>
      )}

      <GoldButton className="w-[35%]">Contact Us</GoldButton>
    </div>
  </div>
);

export default function Services() {
  const { siteData, loading } = useSiteData();

  const services = siteData?.services?.length ? siteData.services : FALLBACK_SERVICES;

  // Resolve images: prefer backend URL, fall back to local assets
  const getImage = (service, index) =>
    service?.image?.url || FALLBACK_IMAGES[index] || shortTermBg;

  const sectionTitle = "Our Services";
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

  return (
    <section className="w-full px-4 sm:px-8 lg:px-16 xl:px-20">
      <hr className="border-[#e8e4db] mt-20 lg:mt-28 mb-16 lg:mb-20" />

      {/* Section Title */}
      <h2 className="text-[#000000] text-4xl sm:text-5xl lg:text-6xl font-light text-center mb-12 lg:mb-16">
        {sectionTitle}
      </h2>

      <div className="max-w-[1585px] mx-auto">
        {/* Service Cards — mapped */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service?.id || index}
              service={service || FALLBACK_SERVICES[index]}
              image={getImage(service, index)}
            />
          ))}
        </div>

        {/* CTA Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 my-10">
          <div className="flex flex-wrap gap-3 mx-auto">
            <GoldButton>{consultationCta}</GoldButton>
            <button className="font-semibold text-white px-6 py-3 text-base bg-[#303030] hover:bg-[#444] transition-colors">
              {callCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}