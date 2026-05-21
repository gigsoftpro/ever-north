import React, { useState, useEffect, useCallback } from "react";
import { Home, CheckCircle, MapPin } from "lucide-react";
import { BaseUrl } from "../../components/Config/BaseUrl";

import BannerFallback from "../../assets/images/service-renovation.webp";
import IntroFallback from "../../assets/images/construction-img.jpg";
import ManageFallback from "../../assets/images/who-we-are.jpg";
import { SiteDataProvider } from "../../components/SiteDataContext";
import ContactForm from "../../components/Contactform";

function Skel({ className = "h-5 w-full rounded" }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

function useAreasData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BaseUrl}areas`);
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
    load();
  }, [load]);
  return { data, loading, error };
}

// ── Gold gradient style ────────────────────────────────────────────────────────
const GOLD_GRADIENT =
  "linear-gradient(0deg, rgb(143,115,52), rgb(183,161,112))";

// ── Location card ──────────────────────────────────────────────────────────────
function LocationCard({ location }) {
  const iconUrl = location.icon_image?.url || null;

  return (
    <div
      className="rounded-[10px] border border-[#bfab76] p-[26px]
        transition-transform duration-300 hover:scale-[1.03] cursor-default"
      style={{ backgroundColor: "rgba(212,175,55,0.14)" }}
    >
      {/* Icon */}
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={location.name}
          className="w-10 h-10 mb-1 object-contain"
        />
      ) : (
        <div
          className="w-10 h-10 mb-1 rounded-lg flex items-center justify-center"
          style={{ background: GOLD_GRADIENT }}
        >
          <MapPin size={20} className="text-white" />
        </div>
      )}

      <h3 className="text-[22px] font-medium mb-2 mt-4 leading-7 text-gray-900">
        {location.name}
      </h3>
      <p className="text-gray-600 text-[15px] leading-6">
        {location.description}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AreasWeCover() {
  const { data, loading, error } = useAreasData();

  const meta = data?.meta || {};
  const locations = (data?.locations || []).filter((l) => l.is_active !== 0);
  const services = (data?.services || []).filter((s) => s.is_active !== 0);

  // ── Resolved values with fallbacks ──────────────────────────────────────────
  const bannerImg = meta.banner_image?.url || BannerFallback;
  const bannerTitle = meta.banner_title || "Areas We Cover";

  const introTitle =
    meta.intro_title ||
    "Professional Property Management Across Ontario's Top Vacation and Cottage Destinations";
  const introPara1 = meta.intro_para_1 || "";
  const introPara2 = meta.intro_para_2 || "";
  const introPara3 = meta.intro_para_3 || "";
  const introImg = meta.intro_image?.url || IntroFallback;

  const areasTitle = meta.areas_title || "Areas We Proudly Serve";

  const manageImg = meta.manage_image?.url || ManageFallback;
  const manageTitle =
    meta.manage_title || "Management Solutions Designed Around Your Property";
  const manageDesc = meta.manage_desc || "";
  const manageServHd = meta.manage_services_heading || "Our Services Include";
  const manageClosing = meta.manage_closing_para || "";

  return (
    <main>
      {/* ── 1. Banner ─────────────────────────────────────────────────────── */}
      <section
        className="relative h-[350px] md:h-[500px] lg:h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-5">
          {loading ? (
            <Skel className="h-14 w-64 md:w-96 mx-auto rounded-lg bg-white/20" />
          ) : (
            <h1 className="text-4xl md:text-7xl font-bold mb-5">
              {bannerTitle}
            </h1>
          )}
        </div>
      </section>

      {/* ── 2. Intro / Property Management Section ───────────────────────── */}
      <section
        className="py-20"
        style={{ backgroundColor: "rgba(245,245,245,0.48)" }}
      >
        <div className="max-w-[1440px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Left — text */}
            <div className="w-full lg:w-1/2 px-5">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-8 w-3/4 rounded" />
                  <Skel className="h-8 w-1/2 rounded" />
                  <Skel className="h-28 w-full rounded" />
                  <Skel className="h-24 w-full rounded" />
                  <Skel className="h-24 w-full rounded" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-medium mb-5 leading-[1.3em] text-gray-900">
                    {introTitle}
                  </h2>
                  {introPara1 && (
                    <p className="text-slate-800 text-base leading-8 mb-4">
                      {introPara1}
                    </p>
                  )}
                  {introPara2 && (
                    <p className="text-slate-800 text-base leading-8 mb-4">
                      {introPara2}
                    </p>
                  )}
                  {introPara3 && (
                    <p className="text-slate-800 text-base leading-8">
                      {introPara3}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Right — image */}
            <div className="w-full lg:w-1/2 overflow-hidden lg:h-[650px]">
              {loading ? (
                <Skel className="w-full h-[400px] lg:h-[650px] rounded-lg" />
              ) : (
                <img
                  src={introImg}
                  alt="Property Management"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Areas Grid Section ────────────────────────────────────────── */}
      <section className="pt-0 pb-20 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-5">
          {/* Heading */}
          <div className="text-center mb-14">
            {loading ? (
              <Skel className="h-10 w-64 mx-auto rounded" />
            ) : (
              <h2 className="text-3xl md:text-4xl font-medium leading-tight text-gray-900">
                {areasTitle}
              </h2>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[10px] border border-[#bfab76] p-[26px] space-y-3 animate-pulse"
                  style={{ backgroundColor: "rgba(212,175,55,0.14)" }}
                >
                  <Skel className="h-10 w-10 rounded-lg" />
                  <Skel className="h-6 w-3/4 rounded mt-4" />
                  <Skel className="h-20 w-full rounded" />
                </div>
              ))
            ) : locations.length > 0 ? (
              locations.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-400 py-12">
                No locations have been added yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* <SiteDataProvider>
        <AreasWeCover />
      </SiteDataProvider> */}

      <div className="h-[2px] w-full max-w-[1220px] mx-auto bg-[#b8a070]" />

      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Left — image */}
            <div className="w-full lg:w-1/2 shrink-0">
              {loading ? (
                <Skel className="w-full h-[400px] lg:h-[600px] rounded-lg" />
              ) : (
                <img
                  src={manageImg}
                  alt="Management Solutions"
                  className="w-full h-[600px] object-cover rounded-lg"
                />
              )}
            </div>

            {/* Right — content */}
            <div className="w-full lg:w-1/2">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <Skel className="h-8 w-3/4 rounded" />
                  <Skel className="h-5 w-full rounded" />
                  <Skel className="h-5 w-2/3 rounded" />
                  <Skel className="h-6 w-1/2 rounded mt-4" />
                  {[...Array(7)].map((_, i) => (
                    <Skel key={i} className="h-5 w-full rounded" />
                  ))}
                  <Skel className="h-5 w-full rounded mt-4" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-medium mb-5 leading-[1.2em] text-gray-900">
                    {manageTitle}
                  </h2>

                  {manageDesc && (
                    <p className="text-slate-800 text-base leading-7 mb-4">
                      {manageDesc}
                    </p>
                  )}

                  {manageServHd && (
                    <h3 className="text-xl font-normal mb-4 mt-4 text-gray-900">
                      {manageServHd}
                    </h3>
                  )}

                  {services.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {services.map((svc) => (
                        <li key={svc.id} className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6 mt-[2px] flex-shrink-0"
                            style={{ color: "#ab935e" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700 text-base">
                            {svc.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {manageClosing && (
                    <p className="text-slate-800 text-base leading-7 mt-4">
                      {manageClosing}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteDataProvider>
        <ContactForm />
      </SiteDataProvider>
      {error && (
        <div
          className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-600
          text-sm px-4 py-3 rounded-xl shadow-lg z-50 max-w-xs"
        >
          {error}
        </div>
      )}
    </main>
  );
}
