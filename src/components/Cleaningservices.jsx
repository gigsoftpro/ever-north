import img1 from "../assets/images/ellipse_22_copy.png";
import img2 from "../assets/images/ellipse_22_copy_2_2.png";
import img3 from "../assets/images/ellipse_22_copy_3_2.png";
import { useSiteData } from "./SiteDataContext";

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

const GoldButton = ({ children, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`items-center justify-center whitespace-nowrap font-semibold text-white px-5 sm:px-6 py-3 text-sm sm:text-base hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

export default function CleaningServices() {
  const { siteData, loading } = useSiteData();

  const meta = siteData?.cleaning?.meta;
  const items = siteData?.cleaning?.items;

  const sectionTitle = meta?.title || "Property Management & Maintenance";

  const words = sectionTitle.split(" ");
  const middle = Math.ceil(words.length / 2);

  const titleLines = [
    words.slice(0, middle).join(" "),
    words.slice(middle).join(" "),
  ];

  const displayItems = items?.length
    ? items.slice(0, 4).map((item, i) => ({
        img: item.image?.url || FALLBACK_IMAGES[i] || img1,
        label: item.label || FALLBACK_ITEMS[i]?.label || `Service ${i + 1}`,
        title: item.title || item.label || FALLBACK_ITEMS[i]?.title || "",
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
      <section className="w-full bg-[#f7f2e8] overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="h-10 w-56 sm:w-72 lg:w-80 bg-slate-300 rounded animate-pulse mb-10 md:mb-12" />
          <hr className="border-[#8f7334] mb-12 lg:mb-16" />

          <div className="flex flex-col sm:flex-row sm:flex-wrap xl:flex-nowrap gap-y-10 sm:gap-x-8 sm:gap-y-10 xl:gap-x-10 justify-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full max-w-[400px] mx-auto sm:mx-0 sm:basis-[calc((100%-2rem)/2)] sm:max-w-[calc((100%-2rem)/2)] xl:basis-[calc((100%-5rem)/3)] xl:max-w-[calc((100%-5rem)/3)] flex flex-col items-center min-w-0"
              >
                <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-slate-300 animate-pulse" />
                <div className="h-6 w-40 bg-slate-300 rounded animate-pulse mt-5" />
                <div className="h-16 w-full max-w-[320px] bg-slate-300 rounded animate-pulse mt-2" />
                <div className="h-10 w-32 bg-slate-300 rounded animate-pulse mt-3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f7f2e8] overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto py-16 lg:py-24 px-4 flex justify-center items-center flex-col">
        <div className="w-full flex md:flex-row md:items-end lg:items-center justify-between gap-6 mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-[#000000] text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.25] text-center md:text-start w-full">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i !== titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <GoldButton
            className="shrink-0 mt-5 min-w-[180px] w-auto hidden md:inline-flex"
            onClick={() => {
              window.location.href = "/property-management";
            }}
          >
            More Services
          </GoldButton>
        </div>

        <hr className="border-[#b7a170] mb-10 lg:mb-12 w-full" />

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-10 sm:gap-x-8 sm:gap-y-10 justify-center">
          {displayItems.map(({ img, label, title, para }, idx) => (
            <div
              key={`${label}-${idx}`}
              className="w-full md:max-w-[47.5%] mx-auto sm:w-[calc((100%-2rem)/2)] flex flex-col items-center justify-between text-center bg-[#f1f1f16b] p-4 md:p-8 border border-[#dddddd91] rounded-xl"
            >
              <div>
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

                <div className="mt-6 w-full">
                  <h3 className="text-[#000000] text-xl sm:text-[22px] font-semibold mb-4">
                    {title}
                  </h3>

                  <p className="text-[#000000] font-medium leading-7 sm:leading-8 text-base sm:text-lg mx-auto">
                    {para}
                  </p>
                </div>
              </div>
              <GoldButton
                onClick={() => {
                  window.location.href = "/contact-us";
                }}
                className="mt-5 rounded"
              >
                Contact Us
              </GoldButton>
            </div>
          ))}
        </div>
        <GoldButton
          className="shrink-0 mt-10 min-w-[180px] w-auto mx-auto inline-flex md:hidden"
          onClick={() => {
            window.location.href = "/property-management";
          }}
        >
          More Services
        </GoldButton>
      </div>
    </section>
  );
}
