import React from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";

// ── Section data ──────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "website-use",
    title: "Website Use",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          This website is intended to provide information about our property
          management services.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Users agree not to:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Use the website unlawfully",
            "Attempt unauthorized access",
            "Interfere with website functionality",
            "Submit false or misleading information",
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
          We reserve the right to restrict access if misuse occurs.
        </p>
      </>
    ),
  },

  {
    id: "service-information",
    title: "Service Information",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          Information presented on this website is provided for general
          informational purposes.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Service availability, scope, and pricing may change without notice.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Submitting an inquiry does not create a contractual relationship.
        </p>
      </>
    ),
  },

  {
    id: "property-management-services",
    title: "Property Management Services",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          Specific services provided by EverNorth are governed by separate
          agreements between EverNorth and the client.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Service details, responsibilities, timelines, and fees will be
          outlined within those agreements.
        </p>
      </>
    ),
  },

  {
    id: "accuracy",
    title: "Accuracy of Information",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          We aim to keep website content accurate and updated; however, we do
          not guarantee completeness or uninterrupted availability.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          Users should confirm details directly with our team.
        </p>
      </>
    ),
  },

  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          All website content, including:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Text",
            "Branding",
            "Graphics",
            "Logos",
            "Images",
            "Layout design",
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
          is owned or licensed by EverNorth and may not be copied, reproduced,
          or distributed without written permission.
        </p>
      </>
    ),
  },

  {
    id: "third-party",
    title: "Third-Party Services and Links",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          Our website may reference third-party platforms or websites.
        </p>

        <p className="text-slate-600 leading-relaxed pb-2">
          EverNorth is not responsible for external content, policies, or
          availability.
        </p>
      </>
    ),
  },

  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed pb-2">
          EverNorth will not be liable for:
        </p>

        <ul className="space-y-2 mb-5 ml-4">
          {[
            "Website interruptions",
            "Technical issues",
            "Indirect damages",
            "Loss resulting from reliance on website content",
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
          Use of this website is at your own discretion.
        </p>
      </>
    ),
  },

  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <p className="text-slate-600 leading-relaxed pb-2">
        Users agree to indemnify and hold EverNorth harmless against claims,
        liabilities, damages, or expenses arising from misuse of the website or
        violation of these Terms.
      </p>
    ),
  },

  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <p className="text-slate-600 leading-relaxed pb-2">
        These Terms &amp; Conditions shall be governed by applicable laws of
        Canada and the Province where services are provided.
      </p>
    ),
  },

  {
    id: "changes",
    title: "Changes to Terms",
    content: (
      <p className="text-slate-600 leading-relaxed pb-2">
        EverNorth reserves the right to modify these Terms at any time.
        Continued use of the website indicates acceptance of updated terms.
      </p>
    ),
  },
];

const GOLD_GRADIENT =
  "linear-gradient(0deg, rgb(143,115,52), rgb(183,161,112))";

export default function TermsAndConditions() {
  return (
    <main>
      {/* ── Banner ────────────────────────────────────────────────────────── */}
      <section
        className="relative h-[280px] md:h-[360px] flex items-end"
        style={{
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #2d2416 50%, #1a1a1a 100%)",
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
            <span className="text-white">Terms &amp; Conditions</span>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: GOLD_GRADIENT }}
            >
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Terms &amp; Conditions
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
              Welcome to EverNorth Property Management.
            </p>
            <p className="text-slate-700 leading-relaxed">
              By accessing this website or using our services, you agree to
              these Terms &amp; Conditions. If you do not agree, please
              discontinue use of the website.
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
                {/* Divider */}
                {index > 0 && (
                  <div className="h-px w-full bg-slate-100 mb-4" />
                )}

                {/* Heading */}
                <div className="flex items-start gap-3 mb-4">
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
                <div className="">{section.content}</div>
              </div>
            ))}
          </div>

          {/* ── Contact block ───────────────────────────────────────────── */}
          <div className="mt-8 h-px w-full bg-slate-100" />
          <div
            className="mt-10 rounded-2xl p-8 text-center"
            style={{ background: GOLD_GRADIENT }}
          >
            <h3 className="text-3xl font-bold text-white mb-2">Contact Us</h3>
            <p className="text-white/90 mb-5 leading-relaxed">
              Questions regarding these Terms may be directed to EverNorth
              Property Management.
            </p>
            <div className="inline-flex flex-col sm:flex-row gap-3 items-center">
              <Link
                to="/contact-us"
                className="bg-white px-7 py-3 font-semibold transition-colors hover:bg-gray-100 shadow text-sm"
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
              to="/privacy-policy"
              className="font-medium transition-colors hover:underline"
              style={{ color: "rgb(143,115,52)" }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
