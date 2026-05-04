const GoldButton = ({ children, className = "" }) => (
  <button
    className={`font-semibold text-white text-sm px-6 py-3 hover:opacity-90 transition-opacity rounded-sm ${className}`}
    style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
  >
    {children}
  </button>
);

export default function Maintenance() {
  return (
    <section className="w-full py-16 lg:py-20 px-4 sm:px-8 lg:px-16 xl:px-20">
      <div className="max-w-[1587px] mx-auto">
        {/* Heading Row */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="text-[#000000] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight max-w-[741px]">
            Property Management &amp;
            <br className="hidden sm:block" />
            Maintenance
          </h2>
          <GoldButton>More Services</GoldButton>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#b7a170] mb-10" />

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-[1042px] mx-auto mt-8">
          {/* Glass Repair */}
          <div className="text-center">
            <h3 className="text-[#000000] text-xl sm:text-2xl font-semibold mb-3">
              Glass Repair
            </h3>
            <p className="text-[#000000] font-medium leading-8 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-6 flex justify-center">
              <GoldButton>Contact Us</GoldButton>
            </div>
          </div>

          {/* Lawn Care */}
          <div className="text-center">
            <h3 className="text-[#000000] text-xl sm:text-2xl font-semibold mb-3">
              Lawn Care &amp; Landscaping
            </h3>
            <p className="text-[#000000] font-medium leading-8 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="mt-6 flex justify-center">
              <GoldButton>Contact Us</GoldButton>
            </div>
          </div>
        </div>

        {/* Bottom center button */}
        <div className="flex justify-center mt-10">
          <GoldButton>Contact Us</GoldButton>
        </div>
      </div>
    </section>
  );
}
