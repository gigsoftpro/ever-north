import aboutImg from "../assets/images/rectangle_178_copy.png";
import missionBg from "../assets/images/rectangle_178_copy_2.png";

import { useAppStore } from "../adminStore.jsx";

export default function About() {
  const { content } = useAppStore();
  return (
    <section className="w-full mt-16 sm:mt-20 lg:mt-28 px-4 sm:px-8 lg:px-16 xl:px-20">
      <div className="max-w-[1586px] mx-auto">
        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {/* Image */}
          <div className="hidden xl:block rounded-[20px] overflow-hidden">
            <img
              src={content.images.aboutMain || aboutImg}
              alt="Property"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          {/* Mission Card */}
          <div
            className="rounded-[20px] p-10 sm:p-14 min-h-[400px] flex flex-col justify-start"
            style={{
              backgroundImage: `url(${missionBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="inline-block bg-[#303030] text-white text-sm rounded-full px-6 py-2 self-start mb-8">
              {content.about.missionTitle}
            </span>
            <p className="text-white text-xl sm:text-2xl leading-9 mb-5">
              {content.about.missionText1}
            </p>
            <p className="text-white text-xl sm:text-2xl leading-9 opacity-80">
              {content.about.missionText2}
            </p>
          </div>

          {/* {content.about.aboutTitle} Card */}
          <div className="rounded-[20px] bg-[#f7f2e8] p-10 sm:p-14 min-h-[400px] flex flex-col justify-start">
            <span
              className="inline-block text-white text-sm rounded-full px-8 py-2 self-start mb-10"
              style={{
                background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
              }}
            >
              {content.about.aboutTitle}
            </span>
            <p className="text-[#303030] text-xl sm:text-2xl leading-9 mb-10">
              {content.about.aboutText}
            </p>
            <p className="text-[#b7a170] text-base sm:text-lg leading-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.
            </p>
            <hr className="border-[#b7a170] my-5" />
            <p className="text-[#b7a170] text-base sm:text-lg leading-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.
            </p>
          </div>
        </div>

        {/* Divider */}
      </div>
    </section>
  );
}
