import shortTermBg from "../assets/images/rectangle_184_copy_7.png";
import longTermBg from "../assets/images/rectangle_184_copy_8.png";
import airbnbBg from "../assets/images/rectangle_184_copy_9.png";

const GoldButton = ({ children, className = "" }) => (
  <button
    className={`font-semibold text-white px-6 py-3 text-sm rounded-sm hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

import { useAppStore } from "../adminStore.jsx";

export default function Services() {
  const { content } = useAppStore();
  return (
    <section className="w-full  px-4 sm:px-8 lg:px-16 xl:px-20">
      <hr className="border-[#e8e4db] mt-20 lg:mt-28 mb-16 lg:mb-20" />

      {/* {content.services.sectionTitle} Title */}
      <h2 className="text-[#000000] text-4xl sm:text-5xl lg:text-6xl font-light text-center mb-12 lg:mb-16">
        {content.services.sectionTitle}
      </h2>
      <div className="max-w-[1585px] mx-auto">
        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Short Term */}
          <div
            className="rounded-[20px] min-h-[400px] sm:min-h-[537px] p-10 sm:p-12 flex flex-col justify-start"
            style={{
              backgroundImage: `url(${content.images.service1 || shortTermBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10 mb-8">
              {content.services.cards[0].title}
            </h3>
            <div className="h-px w-full bg-[#b7a170] mb-6" />
            <p className="text-white text-base sm:text-lg leading-8 opacity-90">
              {content.services.cards[0].description}
            </p>
            <GoldButton className="w-[35%] mt-4">Contact Us</GoldButton>
          </div>

          {/* Long Term */}
          <div
            className="rounded-[20px] min-h-[400px] sm:min-h-[537px] flex items-end p-10 sm:p-12"
            style={{
              backgroundImage: `url(${content.images.service2 || longTermBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10">
              {content.services.cards[1].title}
            </h3>
          </div>

          {/* Airbnb */}
          <div
            className="rounded-[20px] min-h-[400px] sm:min-h-[537px] flex items-end p-10 sm:p-12"
            style={{
              backgroundImage: `url(${content.images.service3 || airbnbBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h3 className="text-white text-2xl sm:text-3xl font-semibold leading-10">
              {content.services.cards[2].title}
            </h3>
          </div>
        </div>

        {/* CTA Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-10">
          <div className="flex flex-wrap gap-3 mx-auto">
            <GoldButton>{content.services.consultationCta}</GoldButton>
            <button className="font-semibold text-white px-6 py-3 text-sm bg-[#303030] hover:bg-[#444] transition-colors rounded-sm">
              {content.services.callCta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
