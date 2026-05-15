import React from "react";
import About from "../../components/About";
import Testimonial from "../../components/Testimonial";
import { usePageData } from "../../components/hooks/usePageData"; // adjust path if needed
import { SiteDataProvider } from "../../components/SiteDataContext";

// ── Local fallbacks (used only when backend has no image yet) ─────────────────
import abtbann01Fallback from "../../assets/images/abtbann01.jpg";
import ctabgFallback from "../../assets/images/cta-bg.jpg";
import abtBannerFallback from "../../assets/images/About-banner.jpg";
import ModImgFallback from "../../assets/images/Modern-image.jpg";
import WhoWeAreFallback from "../../assets/images/who-we-are.jpg";

// ── Skeleton block ────────────────────────────────────────────────────────────
function Skel({ className = "h-6 w-full" }) {
  return <div className={`bg-slate-200 rounded animate-pulse ${className}`} />;
}

export default function AboutUs() {
  const { data, loading } = usePageData("about");

  const meta = data?.meta || {};
  const why = data?.why_choose_items || [];
  const stats = data?.stats || { who_we_are: [], banner: [] };
  const values = data?.core_values || [];

  // ── Field helpers with fallbacks ──────────────────────────────────────────
  const bannerBg = meta.banner_image?.url || abtBannerFallback;
  const bannerTitle =
    meta.banner_title || "About Ever North Property Management";
  const bannerSub =
    meta.banner_subtitle ||
    "Delivering trusted property management solutions with innovation, transparency, and long-term value.";
  const bannerCtaText = meta.banner_cta_text || "Contact Us";
  const bannerCtaHref = meta.banner_cta_href || "#contact";

  const whyTitle =
    meta.why_choose_title || "Why Property Owners Choose Ever North";
  const whyImage = meta.why_choose_image?.url || ModImgFallback;

  const whoHeading = meta.who_we_are_heading || "Who We Are";
  const whoText =
    meta.who_we_are_text ||
    "Ever North Property Management was founded with a vision to simplify property ownership and deliver exceptional experiences for both owners and tenants.";
  const whoImage = meta.who_we_are_image?.url || WhoWeAreFallback;

  const coreValuesHead = meta.core_values_heading || "Our Core Values";

  const ctaBg = meta.cta_bg_image?.url || abtbann01Fallback;
  const ctaHeading =
    meta.cta_heading || "Ready to Simplify Property Management?";
  const ctaDesc =
    meta.cta_description ||
    "Let Ever North handle your property with professionalism, care, and expertise.";
  const ctaBtn1Text = meta.cta_btn1_text || "Get Started";
  const ctaBtn1Href = meta.cta_btn1_href || "#get-started";
  const ctaBtn2Text = meta.cta_btn2_text || "Contact Us";
  const ctaBtn2Href = meta.cta_btn2_href || "#contact";

  // ── "Who We Are" stat cards (3 boxes, right column) ───────────────────────
  const whoStats = stats.who_we_are.length
    ? stats.who_we_are
    : [
        { value: "10+", label: "Years Experience" },
        { value: "500+", label: "Managed Properties" },
        { value: "98%", label: "Client Satisfaction" },
      ];

  // ── Stats banner (full-width strip) ───────────────────────────────────────
  const bannerStats = stats.banner.length
    ? stats.banner
    : [
        { value: "500+", label: "Properties Managed" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "10+", label: "Years Experience" },
        { value: "24/7", label: "Support Available" },
      ];

  // ── Core values cards ─────────────────────────────────────────────────────
  const coreValues = values.length
    ? values
    : [
        {
          emoji: "🔍",
          title: "Transparency",
          description: "Clear communication and honest service.",
        },
        {
          emoji: "🛡️",
          title: "Reliability",
          description: "Consistent management and support.",
        },
        {
          emoji: "⭐",
          title: "Excellence",
          description: "High standards in every property we manage.",
        },
        {
          emoji: "💡",
          title: "Innovation",
          description: "Modern solutions for modern property needs.",
        },
      ];

  // ── Why Choose bullet items ───────────────────────────────────────────────
  const whyItems = (
    why.length
      ? why
      : [
          { text: "Experienced property professionals" },
          { text: "24/7 responsive support" },
          { text: "Tenant screening process" },
          { text: "Property maintenance coordination" },
          { text: "Financial reporting transparency" },
          { text: "Maximized rental value" },
        ]
  ).filter((i) => i.is_active !== 0);

  return (
    <>
      {/* ── 1. Hero Banner ──────────────────────────────────────────────── */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${bannerBg})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5">
          {loading ? (
            <div className="text-center space-y-4 animate-pulse max-w-3xl mx-auto">
              <Skel className="h-14 w-3/4 mx-auto" />
              <Skel className="h-6 w-2/3 mx-auto" />
              <Skel className="h-10 w-32 mx-auto rounded-sm" />
            </div>
          ) : (
            <div className="text-center">
              <h1 className="mb-5 text-4xl font-bold md:text-5xl">
                {bannerTitle}
              </h1>
              <p className="mx-auto mb-10 max-w-4xl text-xl text-white/90">
                {bannerSub}
              </p>
              <a
                href={bannerCtaHref}
                className="inline-block rounded-[2px] bg-gradient-to-t from-[#8f7334] to-[#b7a170] px-[35px] py-[10px] text-lg font-medium text-white transition duration-300 hover:-translate-y-0.5"
              >
                {bannerCtaText}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── 2. About component (home page section — uses SiteDataContext) ── */}
      <SiteDataProvider>
        <About />
      </SiteDataProvider>

      {/* ── 3. Why Choose ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-[100px]">
        <div className="mx-auto max-w-[1440px] px-5">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-[60px]">
            <div>
              <img
                src={whyImage}
                alt="Why Choose Ever North"
                className="w-full rounded-[10px]"
              />
            </div>
            <div>
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-10 w-3/4" />
                  {[...Array(6)].map((_, i) => (
                    <Skel key={i} className="h-7 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <h2 className="mb-[25px] text-4xl leading-none text-[#1a1a1a]">
                    {whyTitle}
                  </h2>
                  <ul className="space-y-5">
                    {whyItems.map((item, i) => (
                      <li
                        key={item.id || i}
                        className="flex items-center text-lg"
                      >
                        <span className="mr-[15px] text-xl text-[#d4af37]">
                          ✓
                        </span>
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

      {/* ── 4. Who We Are ────────────────────────────────────────────────── */}
      <section className="bg-[#faf8f3] py-20 md:py-[100px]">
        <div className="mx-auto max-w-[1440px] px-5">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <Skel className="h-10 w-1/3 mx-auto" />
              <Skel className="h-5 w-2/3 mx-auto" />
              <Skel className="h-5 w-3/5 mx-auto" />
            </div>
          ) : (
            <>
              <h2 className="mb-[10px] text-center text-4xl leading-none text-[#1a1a1a] md:text-[2.5rem]">
                {whoHeading}
              </h2>
              <div className="mx-auto mb-0 max-w-4xl text-center text-lg leading-8 text-[#555555] md:max-w-[80%]">
                <p>{whoText}</p>
              </div>
            </>
          )}

          <div className="mt-[50px] grid grid-cols-1 items-center gap-[30px] md:grid-cols-3">
            <div className="h-full md:col-span-2">
              <img
                src={whoImage}
                alt={whoHeading}
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <div className="grid gap-5">
              {whoStats
                .filter((s) => s.is_active !== 0)
                .map((stat, i) => (
                  <div
                    key={stat.id || i}
                    className="rounded-[10px] bg-white p-[30px] text-center shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                  >
                    <div className="mb-[10px] text-[2.5rem] font-bold text-[#b7a170]">
                      {stat.value}
                    </div>
                    <div className="text-[#666666]">{stat.label}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Core Values ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-[100px]">
        <div className="mx-auto max-w-[1440px] px-5">
          {loading ? (
            <Skel className="h-10 w-1/3 mx-auto mb-10" />
          ) : (
            <h2 className="mb-10 text-center text-4xl text-[#1a1a1a] md:text-[2.5rem]">
              {coreValuesHead}
            </h2>
          )}
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-4">
            {coreValues
              .filter((v) => v.is_active !== 0)
              .map((val, i) => (
                <div
                  key={val.id || i}
                  className="rounded-[10px] border border-[#bfab76] bg-[#d4af3724] p-[30px] text-center transition duration-300 hover:-translate-y-[5px]"
                >
                  <div className="mb-5 text-[2.5rem] text-[#d4af37]">
                    {val.emoji}
                  </div>
                  <h3 className="mb-[5px] text-[1.3rem] text-[#1a1a1a]">
                    {val.title}
                  </h3>
                  <p className="text-[0.95rem] text-[#666666]">
                    {val.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── 6. Stats banner ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 text-white md:py-[100px]"
        style={{ backgroundImage: `url(${ctaBg})` }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${abtbann01Fallback})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto max-w-[1440px] px-5">
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-2 xl:grid-cols-4">
            {bannerStats
              .filter((s) => s.is_active !== 0)
              .map((stat, i) => (
                <div key={stat.id || i} className="p-[30px]">
                  <div className="mb-[5px] text-5xl font-bold text-[#d4af37]">
                    {stat.value}
                  </div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── 7. Testimonials ──────────────────────────────────────────────── */}
      <SiteDataProvider>
        <Testimonial />
      </SiteDataProvider>

      {/* ── 8. CTA Section ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 text-center text-white md:py-[100px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${ctaBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#b19969]/70 to-black/80" />
        <div className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-b from-transparent to-[#2c2c2c]" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-5">
          {loading ? (
            <div className="space-y-4 animate-pulse max-w-lg mx-auto">
              <Skel className="h-10 mx-auto w-3/4" />
              <Skel className="h-6 mx-auto w-2/3" />
            </div>
          ) : (
            <>
              <h2 className="mb-5 text-4xl md:text-[2.5rem]">{ctaHeading}</h2>
              <p className="mb-10 text-xl text-white/90">{ctaDesc}</p>
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
                <a
                  href={ctaBtn1Href}
                  className="rounded-[3px] bg-gradient-to-t from-[#8f7334] to-[#b7a170] px-[35px] py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5"
                >
                  {ctaBtn1Text}
                </a>
                <a
                  href={ctaBtn2Href}
                  className="rounded-[3px] bg-black px-[35px] py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5"
                >
                  {ctaBtn2Text}
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
