import React from "react";
import { Link } from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react";

// ── Section data ──────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          We may collect information that you voluntarily provide, including:
        </p>

        <ul className="space-y-2 mb-2 ml-4">
          {[
            "Full name",
            "Email address",
            "Phone number",
            "Property details",
            "Service inquiries",
            "Contact form submissions",
            "Any additional information submitted through our website",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#b7a170" }}
              />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pb-2 mt-4">
          We may also collect limited technical information automatically,
          including:
        </p>

        <ul className="space-y-2 ml-4">
          {[
            "IP address",
            "Browser type",
            "Device information",
            "Website usage data",
            "Cookies and analytics information",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#b7a170" }}
              />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },

  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          We use the collected information to:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Respond to inquiries and requests",
            "Provide property management services",
            "Improve website performance and user experience",
            "Communicate updates or service-related information",
            "Schedule consultations and appointments",
            "Maintain website security and functionality",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#b7a170" }}
              />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pb-2">
          We only collect information necessary to support our business
          operations.
        </p>
      </>
    ),
  },

  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          Our website may use cookies and similar technologies to improve
          functionality and understand website usage.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Cookies may help us:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Analyze website traffic",
            "Improve site performance",
            "Enhance browsing experience",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#b7a170" }}
              />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pb-2">
          Users can adjust browser settings to disable cookies if preferred.
        </p>
      </>
    ),
  },

  {
    id: "information-sharing",
    title: "Information Sharing",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          EverNorth does not sell or rent personal information.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          We may share information only when necessary with:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Service providers supporting our operations",
            "Contractors involved in service delivery",
            "Legal authorities where required by law",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#b7a170" }}
              />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pb-2">
          Any third-party support providers are expected to handle information
          responsibly.
        </p>
      </>
    ),
  },

  {
    id: "data-protection",
    title: "Data Protection",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          We take reasonable administrative and technical measures to protect
          personal information from unauthorized access, disclosure, or misuse.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          However, no internet transmission or storage system can be guaranteed
          as completely secure.
        </p>
      </>
    ),
  },

  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          Our website may contain links to external websites. EverNorth is not
          responsible for the content, security, or privacy practices of
          external websites.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Users should review external privacy policies separately.
        </p>
      </>
    ),
  },

  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <p className="text-slate-600 leading-relaxed pb-2">
        We retain information only as long as necessary for business,
        operational, and legal purposes. When information is no longer required,
        we take reasonable steps to securely remove or delete it.
      </p>
    ),
  },

  {
    id: "your-rights",
    title: "Your Rights",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          Depending on applicable Canadian privacy laws, you may have the right
          to:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Request access to your personal information",
            "Request corrections to inaccurate information",
            "Withdraw consent where applicable",
            "Request deletion where legally permitted",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: "#b7a170" }}
              />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-slate-600 leading-relaxed pb-2">
          Requests may be submitted through our contact information.
        </p>
      </>
    ),
  },

  {
    id: "policy-updates",
    title: "Policy Updates",
    content: (
      <p className="text-slate-600 leading-relaxed pb-2">
        EverNorth may update this Privacy Policy periodically. Updates will
        become effective upon publication on this website.
      </p>
    ),
  },
];

const GOLD_GRADIENT =
  "linear-gradient(0deg, rgb(143,115,52), rgb(183,161,112))";

export default function PrivacyPolicy() {
  return (
    <main>
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <section
        className="relative h-[280px] md:h-[360px] bg-cover bg-center flex items-end"
        style={{
          background: `linear-gradient(135deg, #1a1a1a 0%, #2d2416 50%, #1a1a1a 100%)`,
        }}
      >
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 pb-12">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 text-sm mb-4"
            style={{ color: "rgba(183,161,112,0.8)" }}
          >
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white">Privacy Policy</span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: GOLD_GRADIENT }}
            >
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Privacy Policy
              </h1>
              <p
                className="text-base mt-1"
                style={{ color: "rgba(183,161,112,0.9)" }}
              >
                EverNorth Property Management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro card ────────────────────────────────────────────────────── */}
      <section className="bg-white pt-14 pb-0">
        <div className="max-w-[1440px] mx-auto px-5">
          <div
            className="rounded-2xl p-8 border-l-4"
            style={{
              backgroundColor: "rgba(212,175,55,0.08)",
              borderColor: "#b7a170",
            }}
          >
            <p className="text-slate-700 leading-relaxed mb-3">
              At EverNorth Property Management, we value your privacy and are
              committed to protecting the personal information you share with
              us.
            </p>
            <p className="text-slate-700 leading-relaxed mb-3">
              This Privacy Policy explains how we collect, use, store, and
              protect information when you visit our website or use our property
              management services.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              By accessing this website, you agree to the practices described in
              this Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-[1440px] mx-auto px-5">
          {/* Sections */}
          <div className="space-y-5">
            {SECTIONS.map((section, index) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                {/* Section divider */}
                {index > 0 && <div className="h-px w-full bg-slate-100 mb-6" />}

                {/* Heading */}
                <div className="flex items-start gap-3 mb-5">
                  {/* <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-white"
                    style={{ background: GOLD_GRADIENT }}
                  >
                    {index + 1}
                  </div> */}
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    {section.title}
                  </h2>
                </div>

                {/* Content */}
                <div>{section.content}</div>
              </div>
            ))}
          </div>

          {/* ── Contact block ───────────────────────────────────────────── */}
          <div className="mt-14 h-px w-full bg-slate-100" />
          <div
            className="mt-10 rounded-2xl p-8 text-center"
            style={{ background: GOLD_GRADIENT }}
          >
            <h3 className="text-3xl font-bold text-white mb-2">Contact Us</h3>
            <p className="text-white/90 mb-5 leading-relaxed">
              If you have questions regarding this Privacy Policy, please don't
              hesitate to reach out.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-3 items-center">
              <Link
                to="/contact-us"
                className="bg-white px-7 py-3 rounded-lg font-semibold transition-colors hover:bg-gray-100 shadow text-sm"
                style={{ color: "rgb(143,115,52)" }}
              >
                Contact EverNorth
              </Link>
            </div>
            <p className="text-white/70 text-xs mt-5">
              EverNorth Property Management
            </p>
          </div>

          {/* ── Related link ────────────────────────────────────────────── */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Also read our{" "}
            <Link
              to="/terms-and-conditions"
              className="font-medium transition-colors hover:underline"
              style={{ color: "rgb(143,115,52)" }}
            >
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
