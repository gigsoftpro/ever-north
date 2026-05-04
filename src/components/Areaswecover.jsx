import areaBg from "../assets/images/vector_smart_object_copy.png";
import saubleBeach from "../assets/images/rectangle_178.png";
import lakeHuron1 from "../assets/images/rectangle_178_copy_6.png";
import grandBen from "../assets/images/rectangle_178_copy_4.png";

const areas = [
  { img: grandBen, label: "Grand Ben" },
  { img: saubleBeach, label: "Sauble Beach" },
  { img: lakeHuron1, label: "Lake Huron" },
  { img: lakeHuron1, label: "Lake Huron" },
];

export default function AreasWeCover() {
  return (
    <section
      className="w-full bg-[#303030] pb-16 sm:pb-20 lg:pb-28 py-20"
      style={{
        backgroundImage: `url(${areaBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="px-4 max-w-[1640px] mx-auto">
        <div className="mb-6">
          <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-light mb-2">
            Areas We Cover
          </h2>
          <p className="text-white text-base sm:text-lg text-center sm:text-left">
            A selection of the properties we proudly manage across the Greater
            Toronto Area.
          </p>
        </div>
      </div>

      <div className="px-4 max-w-[1640px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {areas.map(({ img, label }, i) => (
            <div
              key={`${label}-${i}`}
              className="relative rounded-[20px] sm:rounded-[40px] overflow-hidden"
              style={{ minHeight: "200px" }}
            >
              <img
                src={img}
                alt={label}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-[20px] sm:rounded-[40px]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#303030] to-transparent py-4 rounded-b-[20px] sm:rounded-b-[40px]">
                <p className="text-white font-semibold text-center uppercase tracking-wide text-sm sm:text-base">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-8">
          <span className="w-14 h-2 rounded-full bg-[#b7a170] block" />
          <span className="w-14 h-2 rounded-full bg-white/40 block" />
        </div>
      </div>
    </section>
  );
}
