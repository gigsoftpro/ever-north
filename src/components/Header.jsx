import { useEffect, useState } from "react";
import logo from "../assets/images/asset_10_4x_2.png";
import phoneIcon from "../assets/images/phone_copy.png";
import emailIcon from "../assets/images/email_2.png";
import searchIcon from "../assets/images/search_2.png";
import headerBg from "../assets/images/rectangle_188.jpg";
import navBg from "../assets/images/rectangle_185.png";
import { useSiteData } from "./SiteDataContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { siteData, loading } = useSiteData();
  console.log(siteData?.header);
  const HeaderData = siteData?.header;
  const NavLinks = [
    { label: "Home", route: "/" },
    { label: "About Us", route: "/about" },
    { label: "Services", route: "/our-services" },
    { label: "Contact Us", route: "/contact-us" },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className="relative w-full overflow-hidden flex items-center justify-between px-8"
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-center py-4 lg:py-0 lg:pt-5 px-4 lg:px-0">
        <a href="/" className="flex-shrink-0">
          <img
            src={HeaderData?.logo?.url || logo}
            alt="Ever North"
            className="h-10 sm:h-18 lg:h-[60px] w-auto lg:mb-4"
          />
        </a>

        <div className="ml-auto  lg:pl-0 lg:w-[76%] flex flex-wrap items-center justify-end gap-4">
          {/* Phone */}
          <div className="hidden lg:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <img
                src={phoneIcon}
                alt="Phone"
                className="w-8 h-8 lg:w-9 lg:h-9 flex-shrink-0"
              />
              <div className="leading-tight">
                <p className="text-[#b7a170] uppercase tracking-widest text-[10px] lg:text-xs font-semibold">
                  Call Us
                </p>
                <p className="text-white font-semibold text-sm lg:text-base">
                  <a href={`tel:${HeaderData?.phone || "989-457-8596"}`}>
                    {HeaderData?.phone || "989-457-8596"}
                  </a>
                </p>
              </div>
            </div>

            <div className="w-px h-9 bg-[#828287]" />

            <div className="flex items-center gap-2">
              <img
                src={emailIcon}
                alt="Email"
                className="w-9 h-6 flex-shrink-0"
              />
              <div className="leading-tight">
                <p className="text-[#b7a170] uppercase tracking-widest text-[10px] lg:text-xs font-semibold">
                  Email
                </p>
                <p className="text-white font-semibold text-sm lg:text-base">
                  <a href={`tel:${HeaderData?.email || "989-457-8596"}`}>
                    {HeaderData?.email || "demo@evernorth.com"}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="relative z-[60] lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>

          {/* Desktop nav - unchanged */}
          <div
            className="hidden lg:block"
            style={{
              backgroundImage: `url(${navBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="mx-auto">
              <nav className="hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-0">
                  {HeaderData?.nav_links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className="relative px-5 lg:px-8 xl:px-10 py-3 text-white font-medium uppercase text-sm tracking-wide hover:text-[#b7a170] transition-colors"
                      style={
                        i < NavLinks.length - 1
                          ? { borderRight: "1px solid #8b6f31" }
                          : {}
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-3 border-l border-[#8b6f31] pl-5 lg:pl-8">
                  <div className="w-[50%] border-b border-transparent focus-within:border-white transition-colors duration-200">
                    <input
                      placeholder="Search"
                      className="w-full bg-transparent text-[#d2b677] uppercase font-medium tracking-widest text-sm outline-none focus:outline-none focus:ring-0 border-none focus:border-none focus:shadow-none"
                    />
                  </div>

                  <img src={searchIcon} alt="Search" className="w-5 h-5" />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile fly-in nav from left */}
      <aside
        id="mobile-nav"
        className={`fixed top-0 left-0 z-50 h-full w-[82vw] max-w-[320px] lg:hidden shadow-2xl transform transition-transform duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundImage: `url(${navBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-full flex-col pt-8">
          <a href="/" className="flex-shrink-0 mx-auto mb-6">
            <img
              src={logo}
              alt="Ever North"
              className="h-12 sm:h-18 w-auto brightness-0 invert"
            />
          </a>
          <div className="border-t border-[#8b6f31]">
            {NavLinks.map((link) => (
              <a
                key={link.route}
                href={link.route}
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-4 text-white font-medium uppercase text-sm tracking-wide hover:text-[#b7a170] transition-colors border-b border-[#8b6f31]/40"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-auto border-t border-[#8b6f31] px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="border-b border-transparent focus-within:border-white transition-colors duration-200">
                <input
                  placeholder="Search"
                  className="w-full bg-transparent text-[#d2b677] uppercase font-medium tracking-widest text-sm outline-none focus:outline-none focus:ring-0 border-none focus:border-none focus:shadow-none"
                />
              </div>
              <img src={searchIcon} alt="Search" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}
