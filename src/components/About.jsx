import aboutImg from "../assets/images/rectangle_178_copy.png";
import missionBg from "../assets/images/rectangle_178_copy_2.png";
import { useSiteData } from "./SiteDataContext";

export default function About() {
  const { siteData, loading } = useSiteData();

  const about = siteData?.about;

  const aboutImageUrl = about?.about_image?.url || aboutImg;
  const missionBadge = about?.mission_badge || "Our Mission";
  const missionText1 = about?.mission_text_1 || "";
  const missionText2 = about?.mission_text_2 || "";

  const aboutBadge = about?.about_badge || "About Us";
  const aboutText1 = about?.about_text_1 || "";

  const aboutText2 =
    about?.about_text_2 ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";

  const aboutText3 =
    about?.about_text_3 ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";

  if (loading) {
    return (
      <section className="w-full mt-16 sm:mt-20 lg:mt-28 px-4 sm:px-8 lg:px-16 xl:px-20">
        <div className="max-w-[1586px] mx-auto">
          <div className="flex flex-wrap justify-between gap-6 lg:gap-7">

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full md:w-[48%] xl:w-[32%] rounded-[20px] h-[400px] bg-slate-200 animate-pulse"
              />
            ))}

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-[1260px] mx-auto py-12 ">
      <div className="">

        {/* Cards Row */}
        <div className="flex flex-wrap justify-between gap-6 items-stretch">

          {/* Image Card */}
          <div className="xl:block xl:w-[31.9%] rounded-[20px] overflow-hidden">
            <img
              src={aboutImageUrl}
              alt="Property"
              className=" object-cover rounded-[20px] h-full"
            />
          </div>

          {/* Mission Card */}
          <div
            className="w-full md:w-[48%] xl:w-[31.9%] rounded-[20px] p-5 sm:p-10 flex flex-col justify-start"
            style={{
              backgroundImage: `url(${missionBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="inline-block bg-[#303030] text-white text-sm rounded-full px-6 py-2 self-start mb-8">
              {missionBadge}
            </span>

            <p className="text-white text-lg leading-9 mb-5">
              {missionText1}
            </p>

            <p className="text-white text-lg leading-9 opacity-80">
              {missionText2}
            </p>
          </div>

          {/* About Card */}
          <div className="w-full md:w-[48%] xl:w-[31.9%] rounded-[20px] bg-[#f7f2e8] p-5 sm:p-10">

            <span
              className="inline-block text-white text-sm rounded-full px-8 py-2 self-start mb-10"
              style={{
                background:
                  "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
              }}
            >
              {aboutBadge}
            </span>

            <p className="text-[#303030] text-lg leading-9 mb-10">
              {aboutText1}
            </p>

            <p className="text-[#b7a170] text-base sm:text-lg leading-8">
              {aboutText2}
            </p>

            <hr className="border-[#b7a170] my-5" />

            <p className="text-[#b7a170] text-base sm:text-lg leading-8">
              {aboutText3}
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}