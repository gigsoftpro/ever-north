import heroBg from "../assets/images/rectangle_9_copy.jpg";
import heroOverlay from "../assets/images/rectangle_189.png";
import { useSiteData } from "./SiteDataContext";

export default function Hero() {
  const { siteData, loading } = useSiteData();

  // ── Fallback while loading ─────────────────────────────────────────────────
  const hero = siteData?.hero;
  const bgImage = hero?.bg_image?.url || heroBg;
  const overlayImage = hero?.overlay_image?.url || heroOverlay;

  const splitTitle = (title) => {
    if (!title) return ["", ""];

    const words = title.trim().split(/\s+/);
    const mid = Math.ceil(words.length / 2); // ensures balanced split

    const firstPart = words.slice(0, mid).join(" ");
    const secondPart = words.slice(mid).join(" ");

    return [firstPart, secondPart];
  };
  const titleLines = splitTitle(hero?.title);

  const ctaText = hero?.cta_text || "Get Started";

  return (
    <section
      className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[808px] flex flex-col"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${overlayImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 lg:py-28">
        {loading ? (
          /* Skeleton while loading */
          <div className="space-y-4 w-full max-w-lg">
            <div className="h-12 bg-white/20 rounded-lg animate-pulse mx-auto w-3/4" />
            <div className="h-12 bg-white/20 rounded-lg animate-pulse mx-auto w-1/2" />
            <div className="h-10 bg-white/20 rounded animate-pulse mx-auto w-32 mt-6" />
          </div>
        ) : (
          <>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight drop-shadow-md mb-6">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
              {hero?.highlighted_word && (
                <span className="text-[#929074] font-black">
                  {" "}
                  {hero?.highlighted_word || ""}
                </span>
              )}
            </h1>

            <button
              className="font-semibold text-white px-8 py-3 rounded-sm hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
              }}
            >
              {ctaText}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
