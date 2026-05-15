import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { BaseUrl } from "../../components/Config/BaseUrl";

// ── Local fallback images ──────────────────────────────────────────────────────
import ServiceRenovationFallback from "../../assets/images/service-renovation.webp";
import TypeOwnerFallback from "../../assets/images/type-owner.jpg";
import ConstructionFallback from "../../assets/images/construction-img.jpg";
import RenovationFallback from "../../assets/images/renovation-done.jpg";
import WhoWeAreFallback from "../../assets/images/who-we-are.jpg";

// ── Skeleton block ─────────────────────────────────────────────────────────────
function Skel({ className = "h-5 w-full rounded" }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

// ── Accordion FAQ item ─────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-50 mb-4 rounded-lg overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full py-4 px-5 flex justify-between items-center font-semibold text-gray-900 text-left transition-colors hover:bg-gray-200"
      >
        <span>{question}</span>
        <ChevronDown
          size={20}
          className={`text-amber-500 shrink-0 ml-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-500 leading-relaxed text-sm border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

// ── Data hook ──────────────────────────────────────────────────────────────────
function useRenovationData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BaseUrl}renovation`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.message || "Failed to load page data");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);
  return { data, loading };
}

// ── Fallback datasets ──────────────────────────────────────────────────────────
const FB_CARDS = [
  {
    id: 1,
    emoji: "🍳",
    title: "Kitchen Upgrades",
    description:
      "The kitchen sells the property. We modernize kitchens with updated cabinetry, countertops, fixtures, and finishes that appeal to today's buyers and tenants without over-capitalizing on the space.",
  },
  {
    id: 2,
    emoji: "🚿",
    title: "Bathroom Renovations",
    description:
      "Fresh, clean, and well-finished bathrooms consistently rank among the highest-ROI renovations. We upgrade bathrooms to a standard that feels premium without requiring a luxury budget.",
  },
  {
    id: 3,
    emoji: "🏠",
    title: "Flooring and Interior Finishes",
    description:
      "New flooring changes the entire feel of a property. We install and replace hardwood, laminate, tile, and vinyl options that are durable, attractive, and appropriate for the property's market positioning.",
  },
  {
    id: 4,
    emoji: "🎨",
    title: "Painting and Wall Finishes",
    description:
      "A fresh coat of paint is one of the highest-value renovations per dollar spent. We handle full interior and exterior repaints with color selections that appeal broadly to buyers and tenants.",
  },
  {
    id: 5,
    emoji: "🏗️",
    title: "Basement Finishing and Conversions",
    description:
      "Unfinished basements are untapped income. We convert and finish basement spaces to add livable square footage, create rental suites, or simply improve the property's overall value and appeal.",
  },
  {
    id: 6,
    emoji: "🔨",
    title: "Full Property Renovations",
    description:
      "For properties that need a complete transformation, we manage the entire process from planning and permits to execution and final finish. One team. One timeline. No juggling multiple contractors.",
  },
];
const FB_OWNERS = [
  {
    id: 1,
    title: "For investors preparing to sell",
    description:
      "We focus on upgrades that maximize sale price and minimize time on market. Every dollar spent is evaluated against the return it generates.",
  },
  {
    id: 2,
    title: "For landlords and rental owners",
    description:
      "We prioritize durable, attractive finishes that hold up over time, reduce ongoing maintenance, and justify higher rental rates.",
  },
  {
    id: 3,
    title: "For NRI and overseas owners",
    description:
      "We manage the entire renovation remotely on your behalf, with regular photo and video updates, transparent budgeting, and zero need for you to be on-site.",
  },
  {
    id: 4,
    title: "For luxury property owners",
    description:
      "We deliver high-specification finishes and premium craftsmanship that match the calibre of the property and the expectations of the market it serves.",
  },
];
const FB_WHY = [
  "ROI-focused planning before any work begins",
  "Experienced renovation team with close attention to detail",
  "Transparent budgeting with no hidden costs or surprise bills",
  "Full project management from start to finish",
  "Consistent quality standards across every property we work on",
  "Remote management available for NRI and overseas owners",
  "On-time delivery so your property gets back to market faster",
];
const FB_FAQ = [
  {
    id: 1,
    question: "How does EverNorth decide which renovations are worth doing?",
    answer:
      "We start every project by understanding your goal, whether that is maximizing sale price, increasing rental income, or improving long-term asset value. From there, we recommend upgrades based on what will deliver the strongest return for your specific property and market.",
  },
  {
    id: 2,
    question: "How long does a typical renovation take?",
    answer:
      "Timelines vary depending on the scope of work. A focused upgrade such as a kitchen or bathroom renovation typically takes two to four weeks. A full property renovation can take six to twelve weeks.",
  },
  {
    id: 3,
    question: "Do you handle permits and approvals?",
    answer:
      "Yes. For renovations that require permits or local authority approvals, we manage the entire process on your behalf. We know the requirements across Canadian jurisdictions and make sure all work is compliant, documented, and signed off correctly.",
  },
  {
    id: 4,
    question: "How is the renovation budget managed?",
    answer:
      "We provide a detailed cost breakdown before any work begins so you know exactly what you are paying for. Throughout the project, we track spending transparently and flag any changes before they happen.",
  },
];

export default function OurServices() {
  const { data, loading } = useRenovationData();

  const meta = data?.meta || {};
  const cards = (data?.cards?.length ? data.cards : FB_CARDS).filter(
    (i) => i.is_active !== 0,
  );
  const ownerTypes = (
    data?.owner_types?.length ? data.owner_types : FB_OWNERS
  ).filter((i) => i.is_active !== 0);
  const whyItems = (
    data?.why_items?.length
      ? data.why_items
      : FB_WHY.map((t, i) => ({ id: i, text: t }))
  ).filter((i) => i.is_active !== 0);
  const faqItems = (data?.faq?.length ? data.faq : FB_FAQ).filter(
    (i) => i.is_active !== 0,
  );

  // ── Image resolution with fallbacks ──────────────────────────────────────
  const heroImg = meta.hero_image?.url || ServiceRenovationFallback;
  const upgradesImg = meta.upgrades_image?.url || TypeOwnerFallback;
  const whyImg = meta.why_image?.url || ConstructionFallback;
  const doneImg = meta.done_image?.url || RenovationFallback;
  const faqImg = meta.faq_image?.url || WhoWeAreFallback;

  // ── Text with fallbacks ────────────────────────────────────────────────────
  const heroTitle = meta.hero_title || "Property Renovation";
  const heroTagline = meta.hero_tagline || "Renovate Smart. Profit More.";
  const heroPara1 = meta.hero_para_1 || "";
  const heroPara2 = meta.hero_para_2 || "";
  const heroPara3 = meta.hero_para_3 || "";
  const heroCtaText = meta.hero_cta_text || "Book a Renovation Consultation";
  const heroCtaHref = meta.hero_cta_href || "#consultation";

  const renovateTitle = meta.renovate_title || "What We Renovate";
  const renovateSub =
    meta.renovate_subtitle ||
    "We handle residential and investment property renovations across Canada.";
  const upgradesTitle =
    meta.upgrades_title || "Strategic Upgrades for Every Type of Owner";
  const upgradesSub = meta.upgrades_subtitle || "";
  const whyTitle = meta.why_title || "Why EverNorth for Property Renovation";
  const doneTitle =
    meta.done_title || "A Renovation Done Right Changes Everything";
  const donePara1 = meta.done_para_1 || "";
  const donePara2 = meta.done_para_2 || "";
  const doneBtn1Text = meta.done_btn1_text || "Book a Free Consultation";
  const doneBtn1Href = meta.done_btn1_href || "#consultation";
  const doneBtn2Text = meta.done_btn2_text || "Explore All Our Services";
  const doneBtn2Href = meta.done_btn2_href || "#services";
  const faqTitle = meta.faq_title || "Frequently Asked Questions";

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section
        className="flex items-center text-white py-20 px-5 min-h-[560px]"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.65),rgba(0,0,0,0.65)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-5">
          <div className="text-center max-w-[1200px] mx-auto">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <Skel className="h-12 w-2/3 mx-auto rounded-lg" />
                <Skel className="h-8 w-1/3 mx-auto rounded-lg" />
                <Skel className="h-6 w-3/4 mx-auto rounded" />
                <Skel className="h-6 w-2/3 mx-auto rounded" />
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl leading-normal mb-5 font-bold">
                  {heroTitle}
                </h1>
                <div
                  className="text-2xl mb-7 font-semibold"
                  style={{ color: "#b7a170" }}
                >
                  {heroTagline}
                </div>
                {heroPara1 && (
                  <p className="text-xl mb-10 opacity-90">{heroPara1}</p>
                )}
                {heroPara2 && (
                  <p className="text-xl mb-10 opacity-90">{heroPara2}</p>
                )}
                {heroPara3 && (
                  <p className="text-xl mb-10 opacity-90">{heroPara3}</p>
                )}
                <a
                  href={heroCtaHref}
                  className="inline-block text-white py-4 px-9 rounded-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(0deg,#8f7334,#b7a170)",
                  }}
                >
                  {heroCtaText}
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. What We Renovate ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#faf8f3] mx-auto">
        <div className="mx-auto px-5 max-w-[1440px]">
          {loading ? (
            <div className="space-y-3 animate-pulse mb-14">
              <Skel className="h-10 w-1/2 mx-auto rounded" />
              <Skel className="h-5 w-2/3 mx-auto rounded" />
            </div>
          ) : (
            <>
              <h2 className="text-center text-4xl leading-normal mb-4 text-gray-900">
                {renovateTitle}
              </h2>
              <p className="text-center text-lg text-gray-500 mb-14 max-w-[780px] mx-auto">
                {renovateSub}
              </p>
            </>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-10 rounded-lg shadow-sm space-y-3 animate-pulse"
                  >
                    <Skel className="h-12 w-12 mx-auto rounded" />
                    <Skel className="h-6 w-3/4 mx-auto rounded" />
                    <Skel className="h-16 w-full rounded" />
                  </div>
                ))
              : cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white p-10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-center transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="text-5xl mb-5">{card.emoji}</div>
                    <h3 className="text-xl leading-7 mb-2.5 text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ── 3. Strategic Upgrades (Owner Types) ─────────────────────────── */}
      <section className="py-24 bg-white max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          {loading ? (
            <div className="space-y-3 animate-pulse mb-14">
              <Skel className="h-10 w-2/3 mx-auto rounded" />
              <Skel className="h-5 w-3/4 mx-auto rounded" />
            </div>
          ) : (
            <>
              <h2 className="text-center text-4xl leading-normal mb-4 text-gray-900">
                {upgradesTitle}
              </h2>
              {upgradesSub && (
                <p className="text-lg text-gray-500 mb-14 leading-loose max-w-[940px] mx-auto text-center">
                  {upgradesSub}
                </p>
              )}
            </>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 p-7 rounded-lg space-y-2 animate-pulse"
                    >
                      <Skel className="h-6 w-3/4 rounded" />
                      <Skel className="h-14 w-full rounded" />
                    </div>
                  ))
                : ownerTypes.map((ot) => (
                    <div
                      key={ot.id}
                      className="bg-gray-50 p-7 rounded-lg border-l-4"
                      style={{ borderColor: "#b7a170" }}
                    >
                      <h4 className="text-xl leading-normal mb-2.5 text-gray-900">
                        {ot.title}
                      </h4>
                      <p className="text-gray-500 leading-relaxed text-base">
                        {ot.description}
                      </p>
                    </div>
                  ))}
            </div>
            <div>
              <img
                src={upgradesImg}
                alt="Renovation Strategy"
                className="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Why EverNorth ────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50/50 max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={whyImg}
                alt="Why EverNorth"
                className="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
              />
            </div>
            <div>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <Skel className="h-10 w-3/4 rounded" />
                  {[...Array(7)].map((_, i) => (
                    <Skel key={i} className="h-6 w-full rounded" />
                  ))}
                </div>
              ) : (
                <>
                  <h2 className="text-4xl leading-normal mb-5 text-gray-900">
                    {whyTitle}
                  </h2>
                  <ul className="pl-5 list-disc space-y-1.5">
                    {whyItems.map((item) => (
                      <li key={item.id} className="text-lg text-gray-700">
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Done Right section ────────────────────────────────────────── */}
      <section className="py-24 bg-white max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <Skel className="h-10 w-3/4 rounded" />
                  <Skel className="h-20 w-full rounded" />
                  <Skel className="h-20 w-full rounded" />
                  <div className="flex gap-4 mt-8">
                    <Skel className="h-12 w-40 rounded-sm" />
                    <Skel className="h-12 w-40 rounded-sm" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl leading-normal mb-5 text-gray-900">
                    {doneTitle}
                  </h2>
                  {donePara1 && (
                    <p className="text-lg text-gray-500 mb-5 leading-loose">
                      {donePara1}
                    </p>
                  )}
                  {donePara2 && (
                    <p className="text-lg text-gray-500 mb-5 leading-loose">
                      {donePara2}
                    </p>
                  )}
                  <div className="flex flex-col md:flex-row gap-5 mt-10">
                    <a
                      href={doneBtn1Href}
                      className="py-3 px-9 rounded-sm font-semibold transition-all duration-300 text-white text-center hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(0deg,#8f7334,#b7a170)",
                      }}
                    >
                      {doneBtn1Text}
                    </a>
                    <a
                      href={doneBtn2Href}
                      className="py-3 px-9 rounded-sm font-semibold transition-all duration-300 bg-transparent text-center hover:-translate-y-0.5"
                      style={{ color: "#8f7334", border: "2px solid #8f7334" }}
                    >
                      {doneBtn2Text}
                    </a>
                  </div>
                </>
              )}
            </div>
            <div>
              <img
                src={doneImg}
                alt="Renovation Impact"
                className="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ──────────────────────────────────────────────────────── */}
      <hr className="mx-auto h-[3px] w-full max-w-[1200px] px-2.5 border-0 bg-[#b8a070]" />
      <section className="py-20 bg-white max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          {loading ? (
            <Skel className="h-10 w-1/2 mx-auto rounded mb-12" />
          ) : (
            <h2 className="text-center text-4xl leading-normal mb-12 text-gray-900">
              {faqTitle}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
            <div className="h-full">
              <img
                src={faqImg}
                alt="FAQ"
                className="w-full h-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
              />
            </div>
            <div>
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 mb-4 rounded-lg p-4 animate-pulse space-y-2"
                    >
                      <Skel className="h-6 w-3/4 rounded" />
                    </div>
                  ))
                : faqItems.map((item) => (
                    <FaqItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
