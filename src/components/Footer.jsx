import footerLogo from "../assets/images/asset_10_4x.png";
import footerBuilding from "../assets/images/asset_10_4x_copy.png";
import { useAppStore } from "../adminStore.jsx";
import { useSiteData } from "./SiteDataContext.jsx";

export default function Footer() {
  const { siteData, loading } = useSiteData();
  const { content } = useAppStore();
  const FooterData = siteData?.footer;

  return (
    <footer className="bg-[#2c2c2c] text-white">
  <div className="max-w-[1440px] mx-auto pt-14 pb-6 relative px-4">
    <img
      src={footerBuilding}
      alt="building"
      className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 h-[75%] w-auto opacity-80 pointer-events-none"
    />

    <div className="relative flex flex-col md:flex-row sm:flex-wrap xl:flex-nowrap gap-8 sm:gap-10 xl:gap-12 items-center md:items-start text-center md:text-left">
      {/* Brand Column */}
      <div className="w-full md:w-[calc(50%-20px)] xl:flex-1 min-w-0 flex flex-col items-center md:items-start">
        <img
          src={
            FooterData?.logo?.url ||
            content?.images?.footerLogo ||
            footerLogo
          }
          alt="Ever North"
          className="h-16 sm:h-[81px] w-auto mb-6"
        />
        <p className="text-white text-sm sm:text-base leading-7">
          {FooterData?.description || content?.footer?.description}
        </p>
      </div>

      {/* Quick Links + Legal */}
      <div className="w-full sm:w-[calc(50%-20px)] xl:flex-1 min-w-0 text-center md:text-left">
        <h4 className="text-[#b7a170] text-xl sm:text-2xl font-light mb-6">
          Quick Links
        </h4>

        <div className="flex flex-col md:flex-row gap-2 md:gap-10 justify-center md:justify-start items-center md:items-start">
          <ul className="space-y-2">
            {FooterData?.quick_links.map((link, index) => {
              return (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-white text-sm sm:text-base leading-8 hover:text-[#b7a170] transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
            <a
              href="/terms-and-conditions"
              className="text-white text-sm sm:text-base leading-8 hover:text-[#b7a170] transition-colors"
            >
              Terms &amp; Conditions
            </a>

            <a
              href="/privacy-policy"
              className="text-white text-sm sm:text-base leading-8 hover:text-[#b7a170] transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="w-full sm:w-[calc(50%-20px)] xl:flex-1 min-w-0 text-center md:text-left">
        <h4 className="text-[#b7a170] text-xl sm:text-2xl font-light mb-6">
          Contact
        </h4>

        <p className="text-white text-sm sm:text-base leading-8 mb-4 break-words">
          Email:
          <br />
          <a href={`mailto:${FooterData?.email || content?.footer?.email}`}>
            {FooterData?.email || content?.footer?.email}
          </a>
        </p>

        <p className="text-white text-sm sm:text-base leading-8 break-words">
          Phone:
          <br />
          <a href={`tel:${FooterData?.phone || content?.footer?.phone}`}>
            {FooterData?.phone || content?.footer?.phone}
          </a>
        </p>
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-[#393939] mt-8 mb-6" />

    {/* Copyright */}
    <p className="text-white text-xs sm:text-sm text-center">
      {FooterData?.copyright_text ||
        "© Copyright 2026 Ever North. All Rights Reserved"}
    </p>
  </div>
</footer>
  );
}
