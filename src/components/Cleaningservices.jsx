import img1 from "../assets/images/ellipse_22_copy.png";
import img2 from "../assets/images/ellipse_22_copy_2_2.png";
import img3 from "../assets/images/ellipse_22_copy_3_2.png";

const cleaners = [
  {
    img: img1,
    label: "Deep Cleaning",
    title: "Cleaning Services",
    para: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: img2,
    label: "Regular Maintenance",
    title: "Glass Repair",
    para: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    img: img3,
    label: "Move-In Cleaning",
    title: "Lawn Care & Landscaping",
    para: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const GoldButton = ({ children, className = "" }) => (
  <button
    className={`font-semibold text-white px-6 py-3 rounded-sm hover:opacity-90 transition-opacity ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

export default function CleaningServices() {
  return (
    <section className="w-full bg-[#f7f2e8] mt-16 lg:mt-28 py-16 lg:py-24 px-4 sm:px-8 lg:px-16 xl:px-32">
      <div className="flex items-center justify-between">
        <h2 className="text-[#000000] text-4xl sm:text-5xl lg:text-5xl font-light leading-18 mb-12 lg:mb-16">
          Property Management & <br />
          Maintenance
        </h2>
        <GoldButton className="mt-4 text-base">More Services</GoldButton>
      </div>

      <hr className="border-[#8f7334] mb-16" />

      <div className="max-w-[1333px] mx-auto">
        <div className="flex flex-wrap justify-center  mb-10">
          {cleaners.map(({ img, label, title, para }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-4 w-[30%]"
            >
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
              <div className="text-center mt-6">
                <h3 className="text-[#000000] text-lg sm:text-lg font-semibold mb-4">
                  {title}
                </h3>
                <p className="text-[#000000] font-medium leading-8 max-w-[506px] mx-auto text-base sm:text-lg">
                  {para}
                </p>
              </div>
              <GoldButton className="mt-4 text-sm">Contact Us</GoldButton>
            </div>
          ))}
        </div>

        {/* Text */}
      </div>
    </section>
  );
}
