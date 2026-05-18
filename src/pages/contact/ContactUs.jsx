import React from "react";
import ContactPage from "../../components/ContcatPage";
import { usePageData } from "../../components/hooks/usePageData"; // adjust path if needed
import abtbann01Fallback from "../../assets/images/abtbann01.jpg";
import { SiteDataProvider } from "../../components/SiteDataContext";

export default function ContactUs() {
  const { data, loading } = usePageData("contact");

  // ── Field resolution (backend → UI, with fallbacks) ───────────────────────
  const bannerBg = data?.banner_image?.url || abtbann01Fallback;
  const bannerTitle =
    data?.banner_title || "Contact Ever North Property Management";
  const bannerSub =
    data?.banner_subtitle ||
    "We're here to help with leasing, property management, maintenance coordination, and owner support.";
  const sectionHead = data?.section_heading || "Get In Touch";
  const sectionDesc =
    data?.section_description ||
    "Whether you're a property owner looking for expert management or a tenant needing assistance, our team is ready to respond with professionalism, care, and transparency.";

  return (
    <div>
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${bannerBg})` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5">
          {loading ? (
            <div className="text-center space-y-4 animate-pulse">
              <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto" />
              <div className="h-6 bg-white/20 rounded w-2/3 mx-auto" />
            </div>
          ) : (
            <div className="text-center">
              <h1 className="mb-5 text-4xl font-bold md:text-5xl">
                {bannerTitle}
              </h1>
              <p className="mx-auto mb-10 max-w-4xl text-xl text-white/90">
                {bannerSub}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact Form Section ─────────────────────────────────────────── */}
      <section className="bg-[#faf8f3] pt-20" id="contact-form">
        <div className="mx-auto">
          <div className="mb-12 text-center px-4">
            {loading ? (
              <div className="space-y-3 animate-pulse max-w-2xl mx-auto">
                <div className="h-10 bg-slate-200 rounded w-1/2 mx-auto" />
                <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto" />
                <div className="h-5 bg-slate-200 rounded w-2/3 mx-auto" />
              </div>
            ) : (
              <>
                <h2 className="mb-[10px] text-4xl leading-none text-[#1a1a1a] md:text-[2.5rem]">
                  {sectionHead}
                </h2>
                <p className="mx-auto max-w-3xl text-lg leading-8 text-[#555555]">
                  {sectionDesc}
                </p>
              </>
            )}
          </div>

          {/* ContactPage handles the form + submission to /api/content/contact */}
          <SiteDataProvider>
            <ContactPage />
          </SiteDataProvider>
        </div>
      </section>
    </div>
  );
}
