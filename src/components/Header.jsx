import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/asset_10_4x_2.png";
import phoneIcon from "../assets/images/phone_copy.png";
import emailIcon from "../assets/images/email_2.png";
import searchIcon from "../assets/images/search_2.png";
import headerBg from "../assets/images/rectangle_188.jpg";
import { useSiteData } from "./SiteDataContext";
import { ChevronDown } from "lucide-react";
import { BaseUrl } from "./Config/BaseUrl";

// ─── Fallback nav ────────────────────────────────────────────────────────────
const FALLBACK_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/our-services" },
  { label: "Area We Serve", href: "/areas-we-cover" },
  { label: "Contact Us", href: "/contact-us" },
];

// ─── Services submenu ────────────────────────────────────────────────────────
const servicesSubMenu = [
  {
    title: "Short Term Management",
    href: "/our-services/short-term-management",
  },
  { title: "Long Term Management", href: "/our-services/long-term-management" },
  { title: "Hybrid Management", href: "/our-services/hybrid-management" },
];

// Gold/brown gradient — matches the nav bar shape
const NAV_GRADIENT = "linear-gradient(to top, #8f7334 0%, #b7a170 100%)";

const navShapeStyle = {
  background: NAV_GRADIENT,
  clipPath: "polygon(3.5% 0, 100% 0%, 96.5% 100%, 0% 100%)",
  WebkitClipPath: "polygon(3.5% 0, 100% 0%, 96.5% 100%, 0% 100%)",
};

const searchDropdownStyle = {
  background: NAV_GRADIENT,
  boxShadow: "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.10)",
};

// Show ~5 items at once; rest scrolls.
const SEARCH_LIST_MAX_HEIGHT_DESKTOP = 380;
const SEARCH_LIST_MAX_HEIGHT_MOBILE = 300;

// ─── Category colour chips (tuned for gold background) ────────────────────────
const CATEGORY_COLORS = {
  // Home
  "Home — Hero": "bg-[#3d2f10] text-[#fff]",
  "Home — About": "bg-[#3d2f10] text-[#fff]",
  "Home — Cleaning": "bg-[#3d2f10] text-[#fff]",
  "Home — Maintenance": "bg-[#3d2f10] text-[#fff]",
  "Home — Areas": "bg-[#3d2f10] text-[#fff]",
  Testimonials: "bg-[#3d2f10] text-[#fff]",
  // Services
  Services: "bg-[#2a2110] text-[#fff]",
  "Cleaning Services": "bg-[#2a2110] text-[#fff]",
  Maintenance: "bg-[#2a2110] text-[#fff]",
  "Our Services": "bg-[#2a2110] text-[#fff]",
  "Services — Why": "bg-[#2a2110] text-[#fff]",
  "Services FAQ": "bg-[#2a2110] text-[#fff]",
  // Service pages
  "Service Pages": "bg-[#241a08] text-[#fff]",
  "Service — Card": "bg-[#241a08] text-[#fff]",
  "Service — Why": "bg-[#241a08] text-[#fff]",
  // About
  "About Us": "bg-[#1f1a0e] text-[#fff]",
  "About — Why Choose": "bg-[#1f1a0e] text-[#fff]",
  "About — Stats": "bg-[#1f1a0e] text-[#fff]",
  "About — Core Values": "bg-[#1f1a0e] text-[#fff]",
  // Contact
  "Contact Us": "bg-[#1a1408] text-[#fff]",
  "Contact — Hero": "bg-[#1a1408] text-[#fff]",
  // Areas
  "Areas Page": "bg-[#141009] text-[#fff]",
  "Areas We Serve": "bg-[#141009] text-[#fff]",
  "Areas — Locations": "bg-[#141009] text-[#fff]",
  // Renovation
  Renovation: "bg-[#1f1a0e] text-[#fff]",
  "Renovation — Cards": "bg-[#1f1a0e] text-[#fff]",
  "Renovation — Owner Types": "bg-[#1f1a0e] text-[#fff]",
  "Renovation — Why": "bg-[#1f1a0e] text-[#fff]",
  "Renovation FAQ": "bg-[#1f1a0e] text-[#fff]",
};
function CategoryBadge({ cat }) {
  const cls = CATEGORY_COLORS[cat] || "bg-black/25 text-white/85";
  return (
    <span
      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {cat}
    </span>
  );
}

// ─── Search results list (TOP-LEVEL — stable identity prevents scroll reset) ──
//
// Defined OUTSIDE Header so its function identity is stable across re-renders.
// If it were defined inside Header, every re-render (e.g. resize, route change)
// would create a new component type and React would unmount/remount it —
// destroying the scroll position the moment any state changed.
function SearchResultsList({
  searchLoading,
  searchResults,
  searchQuery,
  activeIdx,
  setActiveIdx,
  navigateTo,
  isMobile,
}) {
  const maxHeight = isMobile
    ? SEARCH_LIST_MAX_HEIGHT_MOBILE
    : SEARCH_LIST_MAX_HEIGHT_DESKTOP;

  return (
    <div
      role="listbox"
      aria-label="Search results"
      className="custom-search-scroll overflow-y-auto"
      style={{
        maxHeight,
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
      }}
    >
      {searchLoading && searchResults.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="text-xs text-white/80 tracking-wide">
            Searching…
          </span>
        </div>
      )}

      {!searchLoading &&
        searchResults.length === 0 &&
        searchQuery.trim().length >= 2 && (
          <div className="px-4 py-5 text-center">
            <p className="text-xs text-white/80 tracking-wide">
              No results for{" "}
              <span className="text-white font-medium">
                "{searchQuery.trim()}"
              </span>
            </p>
          </div>
        )}

      {searchResults.map((item, idx) => (
        <Link
          key={`${item.href}-${idx}-${item.title}`}
          to={item.href}
          role="option"
          aria-selected={activeIdx === idx}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
            e.preventDefault();
            navigateTo(item.href);
          }}
          onMouseEnter={() => setActiveIdx(idx)}
          className={`group flex w-full items-start gap-3 px-4 py-4 text-left bg-[#f7f2e8] transition-colors duration-150
      ${idx !== searchResults.length - 1 ? "border-b border-[#8b6f31]/55" : ""}
      ${activeIdx === idx ? "bg-black/20" : "hover:bg-black/10"}
    `}
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#000] group-hover:bg-white" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[14px] font-semibold leading-snug transition-colors
            ${
              activeIdx === idx
                ? "text-white"
                : "text-black group-hover:text-white"
            }
          `}
              >
                {item.title}
              </span>

              <CategoryBadge cat={item.category} />
            </div>

            {item.description && (
              <p
                className={`mt-2 text-[12px] leading-relaxed line-clamp-2 transition-colors
            ${
              activeIdx === idx
                ? "text-white/90"
                : "text-black/85 group-hover:text-white/90"
            }
          `}
              >
                {item.description}
              </p>
            )}
          </div>

          <svg
            className={`mt-1 h-3.5 w-3.5 shrink-0 transition-colors
        ${
          activeIdx === idx
            ? "text-white"
            : "text-black/80 group-hover:text-white"
        }
      `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ))}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function HeaderSkeleton() {
  return (
    <header
      className="relative w-full overflow-hidden animate-pulse"
      style={{
        background: "linear-gradient(135deg, #2c2c2c 0%, #3d3d3d 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-2 py-3">
        <div className="h-10 w-28 rounded bg-white/10 sm:h-14 lg:h-[60px] xl:h-[80px] xl:w-36" />
        <div className="ml-auto flex flex-1 flex-col items-end gap-3">
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

  // ── Search state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [searchPos, setSearchPos] = useState({ top: 0, left: 0, width: 0 });

  const { siteData, loading } = useSiteData();
  const HeaderData = siteData?.header;
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = HeaderData?.nav_links
    ? [...HeaderData.nav_links]
        .filter((l) => l.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
    : FALLBACK_NAV_LINKS;

  const servicesLinkRef = useRef(null);
  const hoverTimer = useRef(null);
  const debounceRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const abortRef = useRef(null);

  // ── Scroll lock when mobile menu open ─────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  useEffect(() => () => clearTimeout(debounceRef.current), []);
  useEffect(() => () => abortRef.current?.abort(), []);

  // ── Close search dropdown on outside click ────────────────────────────────
  useEffect(() => {
    if (!searchOpen) return;
    function handleOutside(e) {
      if (
        searchContainerRef.current?.contains(e.target) ||
        searchDropdownRef.current?.contains(e.target)
      )
        return;
      setSearchOpen(false);
      setActiveIdx(-1);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [searchOpen]);

  // ── Reset search whenever route changes (incl. /properties copy of Home) ──
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setActiveIdx(-1);
    setMenuOpen(false);
  }, [location.pathname]);

  // ── Desktop services dropdown ─────────────────────────────────────────────
  const openDesktopDropdown = () => {
    clearTimeout(hoverTimer.current);
    if (servicesLinkRef.current) {
      const r = servicesLinkRef.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom, left: r.left + r.width / 2 });
    }
    setDesktopDropdownOpen(true);
  };
  const closeDesktopDropdown = () => {
    hoverTimer.current = setTimeout(() => setDesktopDropdownOpen(false), 120);
  };

  // ── Fetch search results ──────────────────────────────────────────────────
  const performSearch = useCallback(async (q) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setSearchLoading(true);
    try {
      const res = await fetch(`${BaseUrl}search?q=${encodeURIComponent(q)}`, {
        signal: abortRef.current.signal,
      });
      const json = await res.json();
      if (json.success) {
        setSearchResults(json.data || []);
        setSearchOpen(true);
        setActiveIdx(-1);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      if (err.name !== "AbortError") setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // ── Recalculate dropdown position on open / window resize / page scroll ───
  //
  // IMPORTANT: NO `useCapture: true` here — capture-phase would fire the
  // handler when the user scrolls INSIDE the dropdown (because internal
  // scroll events would bubble through capture), causing setState → re-render
  // → scroll position reset. The bubble-phase window listener only fires on
  // actual page (document) scrolling, which is what we want.
  useEffect(() => {
    if (!searchOpen || !searchContainerRef.current) return;

    let raf = 0;
    const reposition = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = searchContainerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        console.log(r);
        setSearchPos((prev) => {
          const next = {
            top: r.bottom + 6,
            left: r.left - 175,
            width: Math.max(r.width, 340),
          };
          if (
            prev.top === next.top &&
            prev.left === next.left &&
            prev.width === next.width
          ) {
            return prev; // skip the state update, skip the re-render
          }
          return next;
        });
      });
    };

    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition);
    };
  }, [searchOpen]);

  // ── Trigger search for any input value (typing OR paste) ──────────────────
  const triggerSearch = useCallback(
    (val) => {
      setSearchQuery(val);
      clearTimeout(debounceRef.current);

      const trimmed = val.trim();
      if (!trimmed || trimmed.length < 2) {
        abortRef.current?.abort();
        setSearchResults([]);
        setSearchOpen(false);
        setActiveIdx(-1);
        setSearchLoading(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        performSearch(trimmed);
      }, 300);
    },
    [performSearch],
  );

  const handleSearchChange = (e) => triggerSearch(e.target.value);

  // Some browsers fire paste before onChange flushes — handle it explicitly
  // so copy/paste into the search field always works, on any page.
  const handleSearchPaste = (e) => {
    queueMicrotask(() => triggerSearch(e.target.value));
  };

  // ── Keyboard navigation inside the results dropdown ───────────────────────
  const handleSearchKeyDown = (e) => {
    if (!searchOpen || !searchResults.length) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActiveIdx(-1);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      navigateTo(searchResults[activeIdx].href);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setActiveIdx(-1);
    }
  };

  // ── Navigate to result (SPA — no full reload) ─────────────────────────────
  const navigateTo = useCallback(
    (href) => {
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setActiveIdx(-1);
      setMenuOpen(false);
      if (!href) return;
      if (href.startsWith("/")) {
        navigate(href);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    },
    [navigate],
  );

  if (loading) return <HeaderSkeleton />;

  return (
    <>
      {/* Scoped scrollbar styling for the search results panel */}
      <style>{`
        .custom-search-scroll::-webkit-scrollbar { width: 6px; }
        .custom-search-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.18);
        }
        .custom-search-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.45);
          border-radius: 3px;
        }
        .custom-search-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.65);
        }
        .custom-search-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.45) rgba(0,0,0,0.18);
        }
      `}</style>

      {/* ══════════════════════ HEADER ══════════════════════ */}
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
          <Link to="/" className="shrink-0 py-2 lg:py-4 xl:py-0 mb-1">
            <img
              src={HeaderData?.logo?.url || logo}
              alt="Ever North"
              className="h-10 w-auto sm:h-14 lg:h-[60px] xl:h-[80px]"
            />
          </Link>

          <div className="ml-auto flex min-w-0 flex-1 flex-col items-end gap-2 mt-0 lg:mt-2">
            {/* ── Contact row (desktop) ── */}
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

            {/* ── Desktop nav bar ── */}
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
                      const sharedCls = `whitespace-nowrap py-4 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-[#fff] xl:text-sm 2xl:text-[15px] px-[14px] xl:px-5 ${!isLast ? "border-r border-[#8b6f31]/70" : ""}`;

                      if (isServices) {
                        return (
                          <div
                            key={link.href || link.id}
                            onMouseEnter={openDesktopDropdown}
                            onMouseLeave={closeDesktopDropdown}
                          >
                            <Link
                              ref={servicesLinkRef}
                              to={link.href}
                              className={`${sharedCls} flex items-center gap-1.5`}
                            >
                              {link.label}
                              <ChevronDown
                                className={`h-6 transition-transform duration-200 ${desktopDropdownOpen ? "rotate-180" : ""}`}
                              />
                            </Link>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={link.href || link.id}
                          to={link.href}
                          className={sharedCls}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>

                  {/* ── Desktop Search ── */}
                  <div className="ml-2 flex items-center gap-3 border-l border-[#8b6f31]/70 pl-[clamp(12px,22px,22px)]">
                    <div ref={searchContainerRef} className="relative">
                      <div className="border-b border-gray-100 transition-colors duration-200 focus-within:border-white flex items-center gap-2">
                        <input
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onPaste={handleSearchPaste}
                          onKeyDown={handleSearchKeyDown}
                          onFocus={() => {
                            if (searchResults.length > 0) setSearchOpen(true);
                          }}
                          placeholder="Search"
                          autoComplete="off"
                          spellCheck={false}
                          type="search"
                          aria-label="Search site"
                          aria-autocomplete="list"
                          aria-expanded={searchOpen}
                          aria-controls="search-results-listbox"
                          className="lg:w-[100px] xl:w-[120px] bg-transparent text-sm font-medium uppercase tracking-[0.18em] text-[#f1deb0] outline-none placeholder:text-[#f1deb0]"
                        />
                        {searchLoading ? (
                          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#f1deb0] border-t-transparent" />
                        ) : (
                          <img
                            src={searchIcon}
                            alt=""
                            aria-hidden="true"
                            className="h-5 w-5 shrink-0"
                          />
                        )}
                      </div>
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
            <Link
              to="/"
              className="mx-auto mb-6 shrink-0"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src={HeaderData?.logo?.url || logo}
                alt="Ever North"
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>

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
                      <div className="flex items-center">
                        <Link
                          to={link.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex-1 px-5 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-[#2f2613]"
                        >
                          {link.label}
                        </Link>
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

                      <div
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: mobileServicesOpen
                            ? `${servicesSubMenu.length * 52}px`
                            : "0px",
                        }}
                      >
                        {servicesSubMenu.map((item, idx) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-2.5 pl-9 pr-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white ${idx !== servicesSubMenu.length - 1 ? "border-b border-[#8b6f31]/30" : ""}`}
                            style={{ background: "rgba(0,0,0,0.12)" }}
                          >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-[#f1deb0]" />
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href || link.id}
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-[#8b6f31]/40 px-5 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-[#2f2613]"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Mobile Search ── */}
            <div className="border-t border-[#8b6f31]/40 px-5 py-4">
              <div className="flex items-center gap-2 border-b border-white/30 pb-1 focus-within:border-white transition-colors">
                <input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onPaste={handleSearchPaste}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search"
                  autoComplete="off"
                  spellCheck={false}
                  type="search"
                  aria-label="Search site"
                  className="flex-1 bg-transparent text-sm font-medium uppercase tracking-[0.18em] text-[#f1deb0] outline-none placeholder:text-[#f1deb0]"
                />
                {searchLoading ? (
                  <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#f1deb0] border-t-transparent" />
                ) : (
                  <img
                    src={searchIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                  />
                )}
              </div>

              {/* Mobile inline results — same gold gradient as desktop */}
              {(searchResults.length > 0 ||
                (searchLoading && searchQuery.length >= 2) ||
                (!searchLoading && searchQuery.trim().length >= 2)) && (
                <div
                  className="mt-3 overflow-hidden rounded-lg"
                  style={searchDropdownStyle}
                >
                  <div className="flex items-center justify-between border-b border-[#8b6f31]/55 px-4 py-4">
                    <span className="text-[13px] font-semibold uppercase tracking-widest text-white">
                      Results
                    </span>
                    <span className="text-[12px] text-white/85">
                      {searchResults.length > 0
                        ? `Showing ${Math.min(searchResults.length, 5)} of ${searchResults.length}`
                        : searchLoading
                          ? "Searching…"
                          : "0 found"}
                    </span>
                  </div>
                  <SearchResultsList
                    isMobile
                    searchLoading={searchLoading}
                    searchResults={searchResults}
                    searchQuery={searchQuery}
                    activeIdx={activeIdx}
                    setActiveIdx={setActiveIdx}
                    navigateTo={navigateTo}
                  />
                </div>
              )}
            </div>
          </div>
        </aside>
      </header>

      {/* ══ Desktop services dropdown — outside <header> (avoids clip-path clipping) ══ */}
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
          <div className="h-1 w-full" />
          <div
            className="overflow-hidden rounded shadow-2xl"
            style={{
              background:
                "linear-gradient(to bottom, #b7a170 0%, #8f7334 100%)",
            }}
          >
            {servicesSubMenu.map((item, idx) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setDesktopDropdownOpen(false)}
                className={`flex items-center gap-2.5 whitespace-nowrap px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10 hover:text-[#fff] ${idx !== servicesSubMenu.length - 1 ? "border-b border-[#8b6f31]/40" : ""}`}
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[#f1deb0]" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══ Desktop search results dropdown — fixed-positioned so nav clip-path never clips it ══ */}
      {searchOpen &&
        (searchResults.length > 0 ||
          (searchLoading && searchQuery.length >= 2) ||
          (!searchLoading && searchQuery.trim().length >= 2)) && (
          <div
            ref={searchDropdownRef}
            id="search-results-listbox"
            className="fixed z-[9998] hidden lg:block"
            style={{
              top: searchPos.top,
              left: searchPos.left,
              width: searchPos.width,
              minWidth: 340,
            }}
          >
            <div
              className="overflow-hidden rounded-lg"
              style={searchDropdownStyle}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-[#8b6f31]/55 px-4 py-4">
                <span className="text-[13px] font-semibold uppercase tracking-widest text-white">
                  Results
                </span>
                <span className="text-[12px] text-white/85">
                  {searchResults.length > 0
                    ? `Showing ${Math.min(searchResults.length, 5)} of ${searchResults.length}`
                    : searchLoading
                      ? "Searching…"
                      : "0 found"}
                </span>
              </div>

              <SearchResultsList
                searchLoading={searchLoading}
                searchResults={searchResults}
                searchQuery={searchQuery}
                activeIdx={activeIdx}
                setActiveIdx={setActiveIdx}
                navigateTo={navigateTo}
              />

              {/* Footer hint */}
              {searchResults.length > 0 && (
                <div className="border-t border-[#8b6f31]/55 px-4 py-2 text-[10px] text-white/85 tracking-wide">
                  ↑↓ navigate · ↵ open · esc close
                  {searchResults.length > 5 && (
                    <span className="ml-2 text-white/75">
                      · scroll for more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
    </>
  );
}
