import heroBg from "../assets/images/rectangle_9_copy.jpg";
import heroOverlay from "../assets/images/rectangle_189.png";
import { useAppStore } from "../adminStore.jsx";

export default function Hero() {
  const { content } = useAppStore();
  const title = content.hero.title.split("\n");
  return (
    <section
      className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[808px] flex flex-col"
      style={{
        backgroundImage: `url(${content.images.heroBg || heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${heroOverlay})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 lg:py-28">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight drop-shadow-md mb-6">
          {title.map((l, i) => (
            <span key={i}>
              {l}
              <br />
            </span>
          ))}
        </h1>
        <button
          className="font-semibold text-white px-8 py-3 rounded-sm"
          style={{
            background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
          }}
        >
          {content.hero.cta}
        </button>
      </div>
    </section>
  );
}
