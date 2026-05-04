import { useState } from "react";
import logo from "../assets/images/asset_10_4x_2.png";
import phoneIcon from "../assets/images/phone_copy.png";
import emailIcon from "../assets/images/email_2.png";
import searchIcon from "../assets/images/search_2.png";
import headerBg from "../assets/images/rectangle_188.jpg";
import navBg from "../assets/images/rectangle_185.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = ["Home", "About Us", "Services", "Contact Us"];

  return (
    <header
      className="relative w-full overflow-hidden flex items-center justify-between"
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-[1600px] mx-auto flex items-center pt-5">
        <a href="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="Ever North"
            className="h-12 sm:h-20 lg:h-[90px] w-auto"
          />
        </a>
        <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-28 pt-4 flex flex-wrap items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {/* Phone */}
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
                  (01) 1234 5678
                </p>
              </div>
            </div>

            <div className="w-px h-9 bg-[#828287]" />

            {/* Email */}
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
                  demo@evernorth.com
                </p>
              </div>
            </div>
          </div>

          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>

          <div
            style={{
              backgroundImage: `url(${navBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="mx-auto px-4 sm:px-8 lg:px-16 xl:px-12">
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center justify-between py-1">
                <div className="flex items-center gap-0">
                  {navLinks.map((link, i) => (
                    <a
                      key={link}
                      href="#"
                      className="relative px-5 lg:px-8 xl:px-10 py-3 text-white font-medium uppercase text-sm tracking-wide hover:text-[#b7a170] transition-colors"
                      style={
                        i < navLinks.length - 1
                          ? { borderRight: "1px solid #8b6f31" }
                          : {}
                      }
                    >
                      {link}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-3 border-l border-[#8b6f31] pl-5 lg:pl-8">
                  <span className="text-[#d2b677] uppercase font-medium tracking-widest text-sm">
                    Search
                  </span>
                  <img src={searchIcon} alt="Search" className="w-5 h-5" />
                </div>
              </nav>

              {/* Mobile Nav */}
              {menuOpen && (
                <nav className="md:hidden py-3 border-t border-[#8b6f31]">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block px-4 py-3 text-white font-medium uppercase text-sm tracking-wide hover:text-[#b7a170] transition-colors border-b border-[#8b6f31]/40"
                    >
                      {link}
                    </a>
                  ))}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <span className="text-[#d2b677] uppercase text-sm font-medium tracking-widest">
                      Search
                    </span>
                    <img src={searchIcon} alt="Search" className="w-4 h-4" />
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
