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
    className={`inline-flex items-center justify-center whitespace-nowrap font-semibold text-white px-5 sm:px-6 py-3 text-sm sm:text-base hover:opacity-90 transition-opacity ${className}`}
    style={{
      background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
    }}
  >
    {children}
  </button>
);

// ── Shared Service Card ────────────────────────────────────────────────────────
const ServiceCard = ({ service, image, className = "" }) => (
  <div className={`w-full min-w-0 ${className}`}>
    <div
      className="group relative overflow-hidden rounded-[20px] min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-end"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] sm:h-[52%] group-hover:h-[100%] transform transition-all duration-700 ease-in-out  bg-gradient-to-t from-black/90 via-black/40 group-hover:bg-black/15" />

      {/* Title */}
      <div className="relative z-10 transform transition-all duration-700 ease-in-out md:group-hover:-translate-y-4 min-w-0">
        <h3 className="text-white text-xl sm:text-2xl lg:text-[25px] font-semibold leading-tight sm:leading-10 break-words">
          {service.title}
        </h3>
      </div>

      {/* 
        On mobile/tablet: content stays visible
        On md+ hover devices: content animates in on hover
      */}
      <div className="relative z-10 mt-3 max-h-[400px] opacity-100 translate-y-0 overflow-hidden transition-all duration-700 ease-in-out md:mt-0 md:max-h-0 md:opacity-0 md:translate-y-10 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:max-h-[300px] md:group-hover:mt-2 min-w-0">
        <div className="h-px w-full bg-[#b7a170] mb-4" />

        {service.description && (
          <p className="text-white text-sm sm:text-base lg:text-lg leading-7 sm:leading-8 opacity-90 mb-4 break-words">
            {service.description}
          </p>
        )}

        <GoldButton className="w-full sm:w-auto sm:min-w-[180px] max-w-full">
          Contact Us
        </GoldButton>
      </div>
    </div>
  </div>
);

export default function Services() {
  const { siteData, loading } = useSiteData();

  const services = siteData?.services?.length
    ? siteData.services
    : FALLBACK_SERVICES;

  const getImage = (service, index) =>
    service?.image?.url || FALLBACK_IMAGES[index] || shortTermBg;

  const sectionTitle = "Our Services";
  const consultationCta = "Book a Consultation";
  const callCta = "Call Us Today";

  if (loading) {
    return (
      <section className="w-full overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto py-12 sm:py-16 lg:py-20 px-6">
          <div className="h-10 bg-slate-200 rounded animate-pulse w-52 sm:w-64 mx-auto mb-12" />

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full sm:basis-[calc((100%-1.5rem)/2)] sm:max-w-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-4rem)/3)] lg:max-w-[calc((100%-4rem)/3)] min-w-0"
              >
                <div className="rounded-[20px] min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto py-12 px-4">

        {/* Section Title */}
        <h2 className="text-[#000000] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-center mb-10 lg:mb-12">
          {sectionTitle}
        </h2>

        {/* Service Cards - FLEX ONLY */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service?.id || index}
              service={service || FALLBACK_SERVICES[index]}
              image={getImage(service, index)}
              className="w-full sm:basis-[calc((100%-1.5rem)/2)] sm:max-w-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-4rem)/3)] lg:max-w-[calc((100%-4rem)/3)]"
            />
          ))}
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 my-10 lg:my-12">
          <GoldButton>{consultationCta}</GoldButton>

          <button className="inline-flex items-center justify-center whitespace-nowrap font-semibold text-white px-5 sm:px-6 py-3 text-sm sm:text-base bg-[#303030] hover:bg-[#444] transition-colors w-full sm:w-auto">
            {callCta}
          </button>
        </div>
      </div>
    </section>
  );
}
