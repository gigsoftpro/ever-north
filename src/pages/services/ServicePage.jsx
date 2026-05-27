import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Clock,
  Smile,
  Wrench,
  Home,
  MessageCircle,
  BarChart2,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Building2,
  Calendar,
  Globe,
} from "lucide-react";
import { BaseUrl } from "../../components/Config/BaseUrl";

// ── Fallback images ────────────────────────────────────────────────────────────
import HeroFallback from "../../assets/images/service-renovation.webp";
import IntroFallback from "../../assets/images/construction-img.jpg";
import WhyFallback from "../../assets/images/who-we-are.jpg";
import { SiteDataProvider } from "../../components/SiteDataContext";
import ContactForm from "../../components/Contactform";

// ── URL slug → DB page_key mapping ────────────────────────────────────────────
const SLUG_TO_KEY = {
  "long-term-management": "long_term",
  "short-term-management": "short_term",
  "hybrid-management": "hybrid",
  // allow direct key pass-through too
  long_term: "long_term",
  short_term: "short_term",
  hybrid: "hybrid",
};

// ── Icon cycle for service cards ──────────────────────────────────────────────
const CARD_ICONS = [
  Clock,
  Smile,
  Wrench,
  Home,
  MessageCircle,
  BarChart2,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Building2,
  Calendar,
  Globe,
];

// ── Icon color map ─────────────────────────────────────────────────────────────
const COLOR_MAP = {
  gold: { bg: "rgba(183,161,112,0.2)", icon: "rgb(143,115,52)", cls: "" },
  green: { bg: "#dcfce7", icon: "#16a34a", cls: "" },
  purple: { bg: "#f3e8ff", icon: "#9333ea", cls: "" },
  yellow: { bg: "#fef9c3", icon: "#ca8a04", cls: "" },
  red: { bg: "#fee2e2", icon: "#dc2626", cls: "" },
  indigo: { bg: "#e0e7ff", icon: "#4f46e5", cls: "" },
  blue: { bg: "#dbeafe", icon: "#2563eb", cls: "" },
  amber: { bg: "rgba(183,161,112,0.2)", icon: "rgb(143,115,52)", cls: "" },
};

// ── Page-level defaults (shown when DB fields are empty) ───────────────────────
const PAGE_DEFAULTS = {
  long_term: {
    heroTitle: "Long-Term Property Management",
    heroSubtitle:
      "Reliable Long-Term Property Management Solutions Across Canada",
    introHeading: "Managing Your Investment with Confidence",
    servicesTitle: "Professional Management for Long-Term Rental Success",
    servicesSubtitle:
      "Long-term rental properties can provide stable and predictable income when managed properly.",
    servicesSubHeading: "We help property owners by:",
    whyTitle: "Why Choose EverNorth",
    whyDesc:
      "At EverNorth, we focus on professionalism, transparency, and long-term value.",
    whySubHeading: "Why property owners trust us:",
    ctaText:
      "We believe strong property management creates stronger investment performance over time.",
    ctaBtnText: "Get Started Today",
    ctaBtnHref: "/contact",
  },
  short_term: {
    heroTitle: "Short-Term Property Management",
    heroSubtitle:
      "Maximize Your Short-Term Rental Performance with Professional Management",
    introHeading: "Professional Support for Short-Term Rentals",
    servicesTitle: "Professional Management for Better Guest Experiences",
    servicesSubtitle:
      "In the short-term rental industry, guest satisfaction directly impacts occupancy rates, reviews, and long-term profitability.",
    servicesSubHeading: "Our short-term management services focus on:",
    whyTitle: "Why Choose EverNorth",
    whyDesc:
      "At EverNorth, we combine professional property oversight with investment-focused management strategies.",
    whySubHeading: "Why clients choose us:",
    ctaText:
      "We understand what modern guests expect and what property owners need to operate successfully.",
    ctaBtnText: "Book a Consultation",
    ctaBtnHref: "/contact",
  },
  hybrid: {
    heroTitle: "Hybrid Property Management",
    heroSubtitle: "Flexible Hybrid Rental Strategies Across Canada",
    introHeading: "The Best of Both Rental Worlds",
    servicesTitle: "Benefits of Hybrid Property Management",
    servicesSubtitle:
      "A properly managed hybrid rental strategy can provide both flexibility and strong revenue opportunities.",
    servicesSubHeading: "Benefits include:",
    whyTitle: "Why Choose EverNorth",
    whyDesc:
      "Hybrid property management requires organization, responsiveness, and experience managing multiple occupancy styles.",
    whySubHeading: "Why investors work with us:",
    ctaText:
      "We focus on creating smooth operations that support both guest satisfaction and long-term investment success.",
    ctaBtnText: "Get Started Today",
    ctaBtnHref: "/contact",
  },
};

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skel({ className = "h-5 w-full rounded" }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

// ── Data hook ──────────────────────────────────────────────────────────────────
function useServicePageData(pageKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!pageKey) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BaseUrl}service-pages/${pageKey}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.message || "Failed to load page");
    } catch {
      setError("Network error — showing default content");
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    load();
  }, [load]);
  return { data, loading, error };
}

// ── Gold button style ─────────────────────────────────────────────────────────
const GOLD_BTN = { background: "linear-gradient(0deg,#8f7334,#b7a170)" };
const GOLD_GRADIENT =
  "linear-gradient(0deg, rgb(143,115,52), rgb(183,161,112))";

export default function ServicePage({ pageKey: propKey }) {
  // Resolve pageKey from prop (static routes) or URL param (dynamic route)
  const { serviceType } = useParams();
  const pageKey =
    propKey || SLUG_TO_KEY[serviceType] || serviceType || "long_term";

  const { data, loading, error } = useServicePageData(pageKey);
  const defaults = PAGE_DEFAULTS[pageKey] || PAGE_DEFAULTS.long_term;

  const meta = data?.meta || {};
  const cards = (data?.cards || []).filter((c) => c.is_active !== 0);
  const whyItems = (data?.why_items || []).filter((i) => i.is_active !== 0);

  // ── Resolved values with fallbacks ──────────────────────────────────────────
  const heroImg = meta.hero_image?.url || HeroFallback;
  const heroTitle = meta.hero_title || defaults.heroTitle;
  const heroSubtitle = meta.hero_subtitle || defaults.heroSubtitle;

  const introImg = meta.intro_image?.url || IntroFallback;
  const introHeading = meta.intro_heading || defaults.introHeading;
  const introPara1 = meta.intro_para_1 || "";
  const introPara2 = meta.intro_para_2 || "";
  const introPara3 = meta.intro_para_3 || "";

  const servicesTitle = meta.services_title || defaults.servicesTitle;
  const servicesSubtitle = meta.services_subtitle || defaults.servicesSubtitle;
  const servicesDesc1 = meta.services_desc_1 || "";
  const servicesDesc2 = meta.services_desc_2 || "";
  const servicesSubHead =
    meta.services_sub_heading || defaults.servicesSubHeading;

  const whyImg = meta.why_image?.url || WhyFallback;
  const whyTitle = meta.why_title || defaults.whyTitle;
  const whyDesc = meta.why_desc || defaults.whyDesc;
  const whySubHead = meta.why_sub_heading || defaults.whySubHeading;

  const ctaText = meta.cta_text || defaults.ctaText;
  const ctaBtnText = meta.cta_btn_text || defaults.ctaBtnText;
  const ctaBtnHref = meta.cta_btn_href || defaults.ctaBtnHref;

  // ── Card icon helper ─────────────────────────────────────────────────────────
  function CardIcon({ card, index }) {
    const colors = COLOR_MAP[card.icon_color] || COLOR_MAP.gold;
    const Icon = CARD_ICONS[index % CARD_ICONS.length];
    return (
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 shrink-0"
        style={{ backgroundColor: colors.bg }}
      >
        <Icon size={22} style={{ color: colors.icon }} />
      </div>
    );
  }

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section
        className="flex items-center text-white py-24 px-5 min-h-[520px] bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full text-center justify-center pb-4">
          {loading ? (
            <div className="space-y-4 animate-pulse max-w-2xl mx-auto">
              <Skel className="h-12 w-3/4 mx-auto rounded-lg" />
              <Skel className="h-6 w-1/2 mx-auto rounded" />
            </div>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-md md:text-xl text-amber-50 max-w-3xl mx-auto">
                {heroSubtitle}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── 2. Introduction ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="bg-white rounded-2xl overflow-hidden">
              {loading ? (
                <Skel className="w-full h-72 rounded-2xl" />
              ) : (
                <img
                  src={introImg}
                  alt={heroTitle}
                  className="w-full h-auto rounded-2xl object-cover"
                />
              )}
            </div>

            {/* Text card */}
            <div
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 relative"
              style={{ borderTop: "4px solid rgb(143,115,52)" }}
            >
              {/* Icon header */}
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ background: GOLD_GRADIENT }}
                >
                  <Building2 size={22} className="text-white" />
                </div>
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-7 w-3/4 rounded" />
                  <Skel className="h-20 w-full rounded" />
                  <Skel className="h-16 w-full rounded" />
                  <Skel className="h-16 w-full rounded" />
                </div>
              ) : (
                <>
                  {introHeading && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-5">
                      {introHeading}
                    </h2>
                  )}
                  {introPara1 && (
                    <p className="text-lg text-gray-700 leading-relaxed mb-5">
                      {introPara1}
                    </p>
                  )}
                  {introPara2 && (
                    <p className="text-lg text-gray-700 leading-relaxed mb-5">
                      {introPara2}
                    </p>
                  )}
                  {introPara3 && (
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {introPara3}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Services / Features section ──────────────────────────────── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10">
            {loading ? (
              <div className="space-y-3 animate-pulse max-w-2xl mx-auto">
                <Skel className="h-10 w-3/4 mx-auto rounded" />
                <Skel className="h-5 w-full rounded" />
                <Skel className="h-5 w-5/6 mx-auto rounded" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {servicesTitle}
                </h2>
                {servicesSubtitle && (
                  <p className="text-md md:text-lg text-gray-600 max-w-4xl mx-auto mb-3">
                    {servicesSubtitle}
                  </p>
                )}
                {servicesDesc1 && (
                  <p className="text-md md:text-lg text-gray-600 max-w-4xl mx-auto mb-3">
                    {servicesDesc1}
                  </p>
                )}
                {servicesDesc2 && (
                  <p className="text-md md:text-lg text-gray-600 max-w-4xl mx-auto mb-4">
                    {servicesDesc2}
                  </p>
                )}
                {servicesSubHead && (
                  <h5 className="text-xl font-semibold text-gray-900">
                    {servicesSubHead}
                  </h5>
                )}
              </>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 shadow animate-pulse space-y-3"
                >
                  <Skel className="h-12 w-12 rounded-lg" />
                  <Skel className="h-6 w-3/4 rounded" />
                  <Skel className="h-14 w-full rounded" />
                </div>
              ))
            ) : cards.length > 0 ? (
              cards.map((card, idx) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardIcon card={card} index={idx} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              // Empty state — no cards added yet
              <p className="col-span-3 text-center text-gray-400 py-12">
                No service cards have been added yet.
              </p>
            )}
          </div>

          {/* Optional bottom note */}
          {!loading && servicesDesc2 && cards.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-md md:text-xl text-gray-700 font-medium">
                {servicesDesc2}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Why Choose EverNorth ──────────────────────────────────────── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1440px] mx-auto">
          {/* 2-col: image + bullets */}
          <div className="flex flex-col md:flex-row gap-10 mb-16">
            {/* Image */}
            <div className="md:w-5/12 shrink-0">
              {loading ? (
                <Skel className="w-full h-80 rounded-xl" />
              ) : (
                <img
                  src={whyImg}
                  alt="Why EverNorth"
                  className="w-full h-auto rounded-xl object-cover
                    shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-10 w-3/4 rounded" />
                  <Skel className="h-5 w-full rounded" />
                  <Skel className="h-5 w-5/6 rounded" />
                  <Skel className="h-5 w-2/3 rounded" />
                  {[...Array(7)].map((_, i) => (
                    <Skel key={i} className="h-6 w-full rounded" />
                  ))}
                </div>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    {whyTitle}
                  </h2>
                  {whyDesc && (
                    <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                      {whyDesc}
                    </p>
                  )}
                  {whySubHead && (
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">
                      {whySubHead}
                    </h5>
                  )}

                  {whyItems.length > 0 ? (
                    <div className="space-y-3">
                      {whyItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                            style={{ background: GOLD_GRADIENT }}
                          >
                            <CheckCircle size={14} className="text-white" />
                          </div>
                          <p className="text-gray-600 text-lg">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No bullet points added yet.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* CTA Banner */}
          {!loading && (ctaText || ctaBtnText) && (
            <div
              className="rounded-2xl p-8 sm:p-12 text-center"
              style={{ background: GOLD_GRADIENT }}
            >
              {ctaText && (
                <p className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
                  {ctaText}
                </p>
              )}
              {ctaBtnText && (
                <a
                  href={ctaBtnHref}
                  className="inline-block mt-6 bg-white px-8 py-4 font-semibold
                    hover:bg-gray-100 transition-colors shadow-lg"
                  style={{ color: "rgb(143,115,52)" }}
                >
                  {ctaBtnText}
                </a>
              )}
            </div>
          )}
          {loading && (
            <div
              className="rounded-2xl p-8 animate-pulse"
              style={{ background: GOLD_GRADIENT, opacity: 0.4 }}
            >
              <Skel className="h-8 w-2/3 mx-auto rounded mb-4 bg-white/30" />
              <Skel className="h-12 w-40 mx-auto rounded-lg bg-white/50" />
            </div>
          )}
        </div>
      </section>

      {/* Error banner (non-blocking) */}
      {error && (
        <div
          className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-600
          text-sm px-4 py-3 rounded-xl shadow z-50 max-w-xs"
        >
          {error}
        </div>
      )}

      <ContactForm />
    </>
  );
}
