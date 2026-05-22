import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import { BaseUrl } from "../../components/Config/BaseUrl";

// ── Fallback images ────────────────────────────────────────────────────────────
import ServiceRenovationFallback from "../../assets/images/service-renovation.webp";
import ConstructionFallback from "../../assets/images/construction-img.jpg";
import RenovationFallback from "../../assets/images/renovation-done.jpg";
import WhoWeAreFallback from "../../assets/images/who-we-are.jpg";

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skel({ className = "h-5 w-full rounded" }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

// ── Why bullet list ────────────────────────────────────────────────────────────
function WhyList({ items, loading }) {
  if (loading) {
    return (
      <div className="space-y-2.5 animate-pulse">
        {[...Array(7)].map((_, i) => (
          <Skel key={i} className="h-5 w-full rounded" />
        ))}
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="flex items-start gap-3">
          <CheckCircle
            size={18}
            className="shrink-0 mt-0.5"
            style={{ color: "#b7a170" }}
          />
          <span className="text-gray-600 text-base leading-snug">
            {item.text ?? item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ── FAQ accordion item ─────────────────────────────────────────────────────────
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
          className={`shrink-0 ml-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "#b7a170" }}
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
function useServicesData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}services`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // silently fall through to fallbacks
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading };
}

// ── Fallback why-bullet datasets ───────────────────────────────────────────────
const FB_SHORT_WHY = [
  "Guest-focused property preparation and coordination",
  "Reliable maintenance and rapid issue resolution",
  "Consistent property presentation standards",
  "Support designed for higher guest satisfaction",
  "Professional communication and operational oversight",
  "Dependable assistance for remote and overseas owners",
  "Solutions focused on long-term property performance",
].map((text, i) => ({ id: i, text }));

const FB_LONG_WHY = [
  "Proactive property maintenance coordination",
  "Ongoing inspections and property oversight",
  "Faster response times for maintenance concerns",
  "Professional support for landlords and investors",
  "Long-term property care focused on value protection",
  "Reliable communication and transparent coordination",
  "Consistent service standards across every property",
].map((text, i) => ({ id: i, text }));

const FB_AIRBNB_WHY = [
  "Guest-ready property presentation support",
  "Faster turnover coordination and preparation",
  "Professional hosting and guest communication assistance",
  "Property oversight designed for smoother operations",
  "Better guest experiences that support stronger reviews",
  "Dependable support for remote Hybrid owners",
  "Consistent standards that improve booking confidence",
].map((text, i) => ({ id: i, text }));

const FB_FAQ = [
  {
    id: 1,
    question: "What types of properties does EverNorth manage?",
    answer:
      "EverNorth manages a wide range of residential properties across Canada, including condos, single-family homes, and multi-unit investment properties. We support short-term rentals, long-term leases, and Hybrid co-hosting arrangements.",
  },
  {
    id: 2,
    question: "Do you manage properties remotely for NRI and overseas owners?",
    answer:
      "Yes. We provide full remote management for NRI and overseas property owners, including regular photo and video updates, transparent reporting, and complete operational oversight — with no requirement for you to be on-site.",
  },
  {
    id: 3,
    question: "How does EverNorth handle maintenance issues?",
    answer:
      "We coordinate all maintenance on your behalf, using our network of reliable tradespeople. Issues are addressed promptly and you are kept informed throughout the process. For long-term rentals, we conduct regular inspections to identify and address concerns before they become larger problems.",
  },
  {
    id: 4,
    question:
      "What is the difference between short-term and long-term property management?",
    answer:
      "Short-term management focuses on guest turnover, preparation, and occupancy performance — ideal for Hybrid and vacation rental properties. Long-term management focuses on tenant stability, ongoing maintenance coordination, and protecting the long-term value of your investment property.",
  },
];

// ── Shared styles ──────────────────────────────────────────────────────────────
const GOLD_BTN = { background: "linear-gradient(0deg,#8f7334,#b7a170)" };

export default function OurServices() {
  const { data, loading } = useServicesData();

  const meta = data?.meta || {};

  const shortWhy = (data?.short_term_why || []).filter((i) => i.is_active !== 0)
    .length
    ? data.short_term_why.filter((i) => i.is_active !== 0)
    : FB_SHORT_WHY;

  const longWhy = (data?.long_term_why || []).filter((i) => i.is_active !== 0)
    .length
    ? data.long_term_why.filter((i) => i.is_active !== 0)
    : FB_LONG_WHY;

  const airbnbWhy = (data?.airbnb_why || []).filter((i) => i.is_active !== 0)
    .length
    ? data.airbnb_why.filter((i) => i.is_active !== 0)
    : FB_AIRBNB_WHY;

  const faqItems = (data?.faq || []).filter((i) => i.is_active !== 0).length
    ? data.faq.filter((i) => i.is_active !== 0)
    : FB_FAQ;

  // ── Text fallbacks ─────────────────────────────────────────────────────────
  const introTitle =
    meta.intro_title || "Property Services Built to Support Performance";
  const introPara1 =
    meta.intro_para_1 ||
    "Properties that are consistently maintained and professionally presented perform better over time. Whether improving guest experiences, preparing a home for sale, managing a rental property, or modernizing outdated interiors, EverNorth helps property owners make confident decisions backed by reliable support and practical property expertise.";
  const introPara2 =
    meta.intro_para_2 ||
    "We combine maintenance, presentation, renovation, staging, and operational support under one roof to simplify modern property ownership across Canada.";
  const introImg = meta.intro_image?.url || ServiceRenovationFallback;

  const shortTitle = meta.short_term_title || "Short-Term Property Management";
  const shortSubtitle =
    meta.short_term_subtitle ||
    "Better Guest Experiences. Stronger Rental Performance.";
  const shortDesc =
    meta.short_term_desc ||
    "Managing a short-term rental takes more than simply handing over the keys. Cleanliness, guest communication, property presentation, maintenance coordination, and fast issue resolution all play a critical role in keeping your property performing consistently.\n\nEverNorth helps property owners across Canada manage short-term rentals with dependable operational support designed to improve guest satisfaction, occupancy rates, and long-term property value. From guest-ready preparation to ongoing property oversight, we help simplify the day-to-day demands of short-term property ownership.";
  const shortCtaText = meta.short_term_cta_text || "Book a Free Consultation";
  const shortCtaHref = meta.short_term_cta_href || "#consultation";
  const shortWhyTitle =
    meta.short_term_why_title ||
    "Why EverNorth for Short-Term Property Management";
  const shortImg = meta.short_term_image?.url || ConstructionFallback;

  const longTitle = meta.long_term_title || "Long-Term Property Management";
  const longSubtitle =
    meta.long_term_subtitle ||
    "Reliable Property Oversight Built for Long-Term Value.";
  const longDesc =
    meta.long_term_desc ||
    "Owning a rental property should create long-term opportunities, not ongoing stress. Consistent maintenance, dependable oversight, and professional coordination are essential to protecting your investment and keeping your property operating smoothly year-round.\n\nEverNorth provides long-term property management services across Canada designed to help landlords and property owners maintain professionally managed, tenant-ready properties that support long-term value and stability.";
  const longCtaText = meta.long_term_cta_text || "Schedule a Consultation";
  const longCtaHref = meta.long_term_cta_href || "#consultation";
  const longWhyTitle =
    meta.long_term_why_title ||
    "Why EverNorth for Long-Term Property Management";
  const longImg = meta.long_term_image?.url || RenovationFallback;

  const airbnbTitle = meta.airbnb_title || "Hybrid PM";
  const airbnbSubtitle =
    meta.airbnb_subtitle ||
    "Hosting Support Designed for Better Reviews and Repeat Bookings.";
  const airbnbDesc =
    meta.airbnb_desc ||
    "A successful Hybrid experience depends on more than location alone. Guests expect clean, organized, comfortable, and professionally managed spaces from the moment they arrive.\n\nEverNorth helps Hybrid hosts across Canada improve guest experiences through professional hosting support, property coordination, presentation management, and day-to-day operational assistance designed to keep properties guest-ready at all times.";
  const airbnbCtaText = meta.airbnb_cta_text || "Get Hosting Support";
  const airbnbCtaHref = meta.airbnb_cta_href || "#consultation";
  const airbnbWhyTitle =
    meta.airbnb_why_title || "Why EverNorth for Hybrid PM & Co-Hosting";
  const airbnbImg = meta.airbnb_image?.url || WhoWeAreFallback;

  const faqTitle = meta.faq_title || "Frequently Asked Questions";
  const faqImg = meta.faq_image?.url || ServiceRenovationFallback;

  // ── Reusable section-label ─────────────────────────────────────────────────
  const Tag = () => (
    <span
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: "#b7a170" }}
    >
      Our Services
    </span>
  );

  return (
    <>
      {/* ── 1. Intro Hero ───────────────────────────────────────────────── */}
      <section
        className="flex items-center text-white py-24 px-5 min-h-[520px]"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${introImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-5">
          <div className="text-center max-w-[900px] mx-auto">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <Skel className="h-12 w-2/3 mx-auto rounded-lg" />
                <Skel className="h-5 w-full mx-auto rounded" />
                <Skel className="h-5 w-5/6 mx-auto rounded" />
                <Skel className="h-5 w-3/4 mx-auto rounded" />
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl leading-normal mb-7 font-bold">
                  {introTitle}
                </h1>
                <p className="text-lg mb-5 opacity-90 leading-relaxed">
                  {introPara1}
                </p>
                <p className="text-lg opacity-80 leading-relaxed">
                  {introPara2}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Short-Term Property Management ───────────────────────────── */}
      <section className="py-24 bg-white max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-4 w-28 rounded" />
                  <Skel className="h-10 w-3/4 rounded" />
                  <Skel className="h-6 w-2/3 rounded" />
                  <Skel className="h-20 w-full rounded" />
                  <Skel className="h-20 w-full rounded" />
                  {[...Array(7)].map((_, i) => (
                    <Skel key={i} className="h-5 w-full rounded" />
                  ))}
                  <Skel className="h-12 w-44 rounded-sm" />
                </div>
              ) : (
                <>
                  <Tag />
                  <h2 className="text-3xl md:text-4xl leading-normal mt-2 mb-2 text-gray-900 font-semibold">
                    {shortTitle}
                  </h2>
                  <p
                    className="text-lg mb-5 font-medium italic"
                    style={{ color: "#8f7334" }}
                  >
                    {shortSubtitle}
                  </p>
                  {shortDesc.split("\n\n").map((p, i) => (
                    <p key={i} className="text-gray-500 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                  <div className="mt-6 mb-8">
                    <p className="text-base font-semibold text-gray-800 mb-4">
                      {shortWhyTitle}
                    </p>
                    <WhyList items={shortWhy} loading={false} />
                  </div>
                  <a
                    href={shortCtaHref}
                    className="inline-block text-white py-3.5 px-9 rounded-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={GOLD_BTN}
                  >
                    {shortCtaText}
                  </a>
                </>
              )}
            </div>
            {/* Image */}
            <div>
              <img
                src={shortImg}
                alt="Short-Term Property Management"
                className="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto h-[3px] w-full max-w-[1200px] border-0 bg-[#b8a070]" />

      {/* ── 3. Long-Term Property Management ────────────────────────────── */}
      <section className="py-24 bg-gray-50/60 max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image (left) */}
            <div>
              <img
                src={longImg}
                alt="Long-Term Property Management"
                className="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
              />
            </div>
            {/* Content (right) */}
            <div>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-4 w-28 rounded" />
                  <Skel className="h-10 w-3/4 rounded" />
                  <Skel className="h-6 w-2/3 rounded" />
                  <Skel className="h-20 w-full rounded" />
                  <Skel className="h-20 w-full rounded" />
                  {[...Array(7)].map((_, i) => (
                    <Skel key={i} className="h-5 w-full rounded" />
                  ))}
                  <Skel className="h-12 w-44 rounded-sm" />
                </div>
              ) : (
                <>
                  <Tag />
                  <h2 className="text-3xl md:text-4xl leading-normal mt-2 mb-2 text-gray-900 font-semibold">
                    {longTitle}
                  </h2>
                  <p
                    className="text-lg mb-5 font-medium italic"
                    style={{ color: "#8f7334" }}
                  >
                    {longSubtitle}
                  </p>
                  {longDesc.split("\n\n").map((p, i) => (
                    <p key={i} className="text-gray-500 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                  <div className="mt-6 mb-8">
                    <p className="text-base font-semibold text-gray-800 mb-4">
                      {longWhyTitle}
                    </p>
                    <WhyList items={longWhy} loading={false} />
                  </div>
                  <a
                    href={longCtaHref}
                    className="inline-block text-white py-3.5 px-9 rounded-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={GOLD_BTN}
                  >
                    {longCtaText}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto h-[3px] w-full max-w-[1200px] border-0 bg-[#b8a070]" />

      {/* ── 4. Hybrid PM & Co-Hosting ──────────────────────────────── */}
      <section className="py-24 bg-white max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Content (left) */}
            <div>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-4 w-28 rounded" />
                  <Skel className="h-10 w-3/4 rounded" />
                  <Skel className="h-6 w-2/3 rounded" />
                  <Skel className="h-20 w-full rounded" />
                  <Skel className="h-20 w-full rounded" />
                  {[...Array(7)].map((_, i) => (
                    <Skel key={i} className="h-5 w-full rounded" />
                  ))}
                  <Skel className="h-12 w-44 rounded-sm" />
                </div>
              ) : (
                <>
                  <Tag />
                  <h2 className="text-3xl md:text-4xl leading-normal mt-2 mb-2 text-gray-900 font-semibold">
                    {airbnbTitle}
                  </h2>
                  <p
                    className="text-lg mb-5 font-medium italic"
                    style={{ color: "#8f7334" }}
                  >
                    {airbnbSubtitle}
                  </p>
                  {airbnbDesc.split("\n\n").map((p, i) => (
                    <p key={i} className="text-gray-500 leading-relaxed mb-4">
                      {p}
                    </p>
                  ))}
                  <div className="mt-6 mb-8">
                    <p className="text-base font-semibold text-gray-800 mb-4">
                      {airbnbWhyTitle}
                    </p>
                    <WhyList items={airbnbWhy} loading={false} />
                  </div>
                  <a
                    href={airbnbCtaHref}
                    className="inline-block text-white py-3.5 px-9 rounded-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={GOLD_BTN}
                  >
                    {airbnbCtaText}
                  </a>
                </>
              )}
            </div>
            {/* Image (right) */}
            <div>
              <img
                src={airbnbImg}
                alt="Hybrid PM"
                className="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <hr className="mx-auto h-[3px] w-full max-w-[1200px] border-0 bg-[#b8a070]" />

      {/* ── 5. FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white max-w-[1440px] mx-auto">
        <div className="mx-auto px-5">
          {loading ? (
            <Skel className="h-10 w-1/2 mx-auto rounded mb-12" />
          ) : (
            <h2 className="text-center text-4xl leading-normal mb-12 text-gray-900 font-semibold">
              {faqTitle}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
            {/* Image */}
            <div className="h-full">
              <img
                src={faqImg}
                alt="FAQ"
                className="w-full h-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] object-cover"
              />
            </div>
            {/* Accordion */}
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
