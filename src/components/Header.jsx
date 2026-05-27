import { useEffect, useState, useRef } from "react";
import logo from "../assets/images/asset_10_4x_2.png";
import phoneIcon from "../assets/images/phone_copy.png";
import emailIcon from "../assets/images/email_2.png";
import searchIcon from "../assets/images/search_2.png";
import headerBg from "../assets/images/rectangle_188.jpg";
import { useSiteData } from "./SiteDataContext";
import { ChevronDown } from "lucide-react";

// ─── Fallback nav (used if backend hasn't loaded yet) ───────────────────────
const FALLBACK_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/our-services" },
  { label: "Area We Serve", href: "/area-we-serve" },
  { label: "Contact Us", href: "/contact-us" },
];

// ─── Services submenu data ───────────────────────────────────────────────────
const servicesSubMenu = [
  {
    title: "Short Term Management",
    href: "/our-services/short-term-management",
  },
  { title: "Long Term Management", href: "/our-services/long-term-management" },
  { title: "Hybrid Management", href: "/our-services/hybrid-management" },
];

const navShapeStyle = {
  background: "linear-gradient(to top, #8f7334 0%, #b7a170 100%)",
  clipPath: "polygon(3.5% 0, 100% 0%, 96.5% 100%, 0% 100%)",
  WebkitClipPath: "polygon(3.5% 0, 100% 0%, 96.5% 100%, 0% 100%)",
};

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <header
      className="relative w-full overflow-hidden animate-pulse"
      style={{
        background: "linear-gradient(135deg, #2c2c2c 0%, #3d3d3d 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-2 py-3">
        {/* Logo */}
        <div className="h-10 w-28 rounded bg-white/10 sm:h-14 lg:h-[60px] xl:h-[80px] xl:w-36" />

        <div className="ml-auto flex flex-1 flex-col items-end gap-3">
          {/* Contact row */}
          <div className="hidden items-center gap-5 min-[1180px]:flex xl:gap-7">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/10 xl:h-9 xl:w-9" />
              <div className="space-y-2">
                <div className="h-2 w-10 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
            </div>
            <div className="h-9 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="h-6 w-9 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-2 w-10 rounded bg-white/10" />
                <div className="h-3 w-40 rounded bg-white/10" />
              </div>
            </div>
          </div>

          {/* Nav bar */}
          <div className="hidden lg:block">
            <div
              className="overflow-hidden px-8 xl:px-12"
              style={navShapeStyle}
            >
              <div className="flex min-h-[40px] items-center py-4">
                {[72, 68, 60, 80, 74].map((w, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className="h-2.5 rounded bg-white/20"
                      style={{ width: w }}
                    />
                    {i < 4 && (
                      <div className="mx-6 h-5 w-px bg-white/10 xl:mx-8" />
                    )}
                  </div>
                ))}
                <div className="ml-6 h-5 w-px bg-white/10" />
                <div className="ml-6 h-2.5 w-20 rounded bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const { siteData, loading } = useSiteData(); // assumes context exposes `loading`
  const HeaderData = siteData?.header;

  // Use backend nav_links when available, otherwise fall back to static list
  const navLinks = HeaderData?.nav_links
    ? [...HeaderData.nav_links]
        .filter((l) => l.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
    : FALLBACK_NAV_LINKS;

  const servicesLinkRef = useRef(null);
  const hoverTimer = useRef(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  // ── Desktop dropdown helpers ──────────────────────────────────────────────
  const openDesktopDropdown = () => {
    clearTimeout(hoverTimer.current);
    if (servicesLinkRef.current) {
      const r = servicesLinkRef.current.getBoundingClientRect();
      // `position:fixed` is relative to viewport → no scrollY needed
      setDropdownPos({ top: r.bottom, left: r.left + r.width / 2 });
    }
    setDesktopDropdownOpen(true);
  };

  const closeDesktopDropdown = () => {
    hoverTimer.current = setTimeout(() => setDesktopDropdownOpen(false), 120);
  };

  // Show skeleton while data is loading
  if (loading) return <HeaderSkeleton />;

  return (
    <>
      {/* ════════════════════════ HEADER ════════════════════════ */}
      <header
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: `url(${headerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pt-2 mx-auto flex w-full max-w-[1440px] items-center lg:items-end xl:items-center gap-4 px-4">
          {/* Logo */}
          <a href="/" className="shrink-0 py-2 lg:py-4 xl:py-0 mb-1">
            <img
              src={HeaderData?.logo?.url || logo}
              alt="Ever North"
              className="h-10 w-auto sm:h-14 lg:h-[60px] xl:h-[80px]"
            />
          </a>

          <div className="ml-auto flex min-w-0 flex-1 flex-col items-end gap-2 mt-0 lg:mt-2">
            {/* ── Contact info row (desktop) ── */}
            <div className="hidden lg:flex w-full items-center justify-end gap-5 min-[1180px]:flex xl:gap-7">
              <div className="flex items-center gap-3">
                <img
                  src={phoneIcon}
                  alt="Phone"
                  className="h-8 w-8 shrink-0 xl:h-9 xl:w-9"
                />
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b7a170] xl:text-xs">
                    Call Us
                  </p>
                  <a
                    href={`tel:${HeaderData?.phone || "989-457-8596"}`}
                    className="text-sm font-semibold text-white xl:text-base"
                  >
                    {HeaderData?.phone || "989-457-8596"}
                  </a>
                </div>
              </div>

              <div className="h-9 w-px bg-white/20" />

              <div className="flex items-center gap-3">
                <img src={emailIcon} alt="Email" className="h-6 w-9 shrink-0" />
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b7a170] xl:text-xs">
                    Email
                  </p>
                  <a
                    href={`mailto:${HeaderData?.email || "demo@evernorth.com"}`}
                    className="text-sm font-semibold text-white xl:text-base"
                  >
                    {HeaderData?.email || "demo@evernorth.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="relative z-[60] flex flex-col gap-[5px] p-2 lg:hidden"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
            <div className="hidden lg:block">
              <div
                className="overflow-hidden px-8 xl:pl-8 xl:pr-12"
                style={navShapeStyle}
              >
                <nav className="flex min-h-[40px] items-center justify-center">
                  <div className="flex min-w-0 items-center">
                    {navLinks.map((link, i) => {
                      const isServices =
                        link.href === "/our-services" ||
                        link.label === "Services";
                      const isLast = i === navLinks.length - 1;
                      const sharedCls = `whitespace-nowrap py-4 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-[#fff1c7] xl:text-sm 2xl:text-[15px] px-4 xl:px-7 ${!isLast ? "border-r border-[#8b6f31]/70" : ""}`;

                      if (isServices) {
                        return (
                          <div
                            key={link.href || link.id}
                            onMouseEnter={openDesktopDropdown}
                            onMouseLeave={closeDesktopDropdown}
                          >
                            <a
                              ref={servicesLinkRef}
                              href={link.href}
                              className={`${sharedCls} flex items-center gap-1.5`}
                            >
                              {link.label}
                              <ChevronDown
                                className={`h-6 transition-transform duration-200 ${desktopDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </a>
                          </div>
                        );
                      }

                      return (
                        <a
                          key={link.href || link.id}
                          href={link.href}
                          className={sharedCls}
                        >
                          {link.label}
                        </a>
                      );
                    })}
                  </div>

                  {/* Search */}
                  <div className="ml-2 flex items-center gap-3 border-l border-[#8b6f31]/70 pl-[clamp(12px,22px,22px)]">
                    <div className="border-b border-gray-100 transition-colors duration-200 focus-within:border-white relative">
                      <input
                        placeholder="Search"
                        className="lg:w-[100px] xl:w-[120px] bg-transparent text-sm font-medium uppercase tracking-[0.18em] text-[#f1deb0] outline-none placeholder:text-[#f1deb0]"
                      />
                      <img
                        src={searchIcon}
                        alt="Search"
                        className="h-5 w-5 shrink-0 absolute top-0 right-0"
                      />
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-500 lg:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* ── Mobile sidebar ── */}
        <aside
          id="mobile-nav"
          className={`fixed left-0 top-0 z-[999] h-full w-[82vw] max-w-[320px] transform shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{
            background: "linear-gradient(to top, #987d42 0%, #b19a67 100%)",
          }}
        >
          <div className="flex h-full flex-col pt-8">
            <a href="/" className="mx-auto mb-6 shrink-0">
              <img
                src={HeaderData?.logo?.url || logo}
                alt="Ever North"
                className="h-12 w-auto brightness-0 invert"
              />
            </a>

            {/* Scrollable nav list */}
            <div className="flex-1 overflow-y-auto border-t border-[#8b6f31]/40">
              {navLinks.map((link) => {
                const isServices =
                  link.href === "/our-services" || link.label === "Services";

                if (isServices) {
                  return (
                    <div
                      key={link.href || link.id}
                      className="border-b border-[#8b6f31]/40"
                    >
                      {/* Row: link + separate chevron toggle */}
                      <div className="flex items-center">
                        <a
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex-1 px-5 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-[#2f2613]"
                        >
                          {link.label}
                        </a>
                        <button
                          onClick={() => setMobileServicesOpen((p) => !p)}
                          className="px-4 py-4 text-white transition-colors hover:text-[#2f2613]"
                          aria-label="Toggle services submenu"
                          aria-expanded={mobileServicesOpen}
                        >
                          <svg
                            className={`h-4 w-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Accordion submenu */}
                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: mobileServicesOpen
                            ? `${servicesSubMenu.length * 52}px`
                            : "0px",
                        }}
                      >
                        {servicesSubMenu.map((item, idx) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-2.5 pl-9 pr-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white ${idx !== servicesSubMenu.length - 1 ? "border-b border-[#8b6f31]/30" : ""}`}
                            style={{ background: "rgba(0,0,0,0.12)" }}
                          >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-[#f1deb0]" />
                            {item.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={link.href || link.id}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-[#8b6f31]/40 px-5 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-[#2f2613]"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Search */}
            <div className="border-t border-[#8b6f31]/40 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 border-b border-transparent transition-colors duration-200 focus-within:border-white">
                  <input
                    placeholder="Search"
                    className="w-full bg-transparent text-sm font-medium uppercase tracking-[0.18em] text-[#f1deb0] outline-none placeholder:text-[#f1deb0]"
                  />
                </div>
                <img src={searchIcon} alt="Search" className="h-4 w-4" />
              </div>
            </div>
          </div>
        </aside>
      </header>

      {/* ════ Desktop dropdown — rendered OUTSIDE <header> ════
          The navShapeStyle uses clip-path, which clips all children including
          overflow ones. Rendering here (position:fixed, viewport-relative) avoids
          that entirely while keeping hover bridge intact via onMouseEnter/Leave.  */}
      {desktopDropdownOpen && (
        <div
          className="fixed z-[9999] hidden lg:block"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            transform: "translateX(-50%)",
          }}
          onMouseEnter={openDesktopDropdown}
          onMouseLeave={closeDesktopDropdown}
        >
          {/* Tiny invisible bridge so mouse moving from nav → dropdown doesn't close it */}
          <div className="h-1 w-full" />
          <div
            className="overflow-hidden rounded shadow-2xl"
            style={{
              background:
                "linear-gradient(to bottom, #b7a170 0%, #8f7334 100%)",
            }}
          >
            {servicesSubMenu.map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 whitespace-nowrap px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10 hover:text-[#fff1c7] ${idx !== servicesSubMenu.length - 1 ? "border-b border-[#8b6f31]/40" : ""}`}
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#f1deb0]" />
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
