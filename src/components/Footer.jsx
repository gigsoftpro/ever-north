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
      <div className="max-w-[1440px] mx-auto pt-12 pb-6 relative px-4">
        <img
          src={footerBuilding}
          alt="building"
          className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 h-[75%] w-auto opacity-80 pointer-events-none"
        />

        <div className="relative flex flex-col sm:flex-row sm:flex-wrap xl:justify-between gap-10 xl:gap-8 items-start">
          {/* Brand Column */}
          <div className="w-full sm:w-[calc(50%-20px)] xl:basis-[34%] xl:max-w-[560px] min-w-0">
            <img
              src={
                FooterData?.logo?.url ||
                content?.images?.footerLogo ||
                footerLogo
              }
              alt="Ever North"
              className="h-16 sm:h-[81px] w-auto mb-6"
            />
            <p className="text-white text-sm sm:text-base leading-8">
              {FooterData?.description || content?.footer?.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full sm:w-[calc(50%-20px)] xl:basis-[14%] min-w-0">
            <h4 className="text-[#b7a170] text-xl sm:text-2xl font-light mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {FooterData?.quick_links.map((link, index) => {
                return (
                  <li key={index}>
                    <a
                      href={link?.href}
                      className="text-white text-sm sm:text-base leading-10 hover:text-[#b7a170] transition-colors"
                    >
                      {link?.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal */}
          <div className="w-full sm:w-[calc(50%-20px)] xl:basis-[16%] min-w-0 flex flex-col gap-2">
            <div className="md:mt-11" />
            <a
              href="#"
              className="text-white text-sm sm:text-base leading-10 hover:text-[#b7a170] transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="#"
              className="text-white text-sm sm:text-base leading-10 hover:text-[#b7a170] transition-colors"
            >
              Privacy Policy
            </a>
          </div>

          {/* Contact */}
          <div className="w-full sm:w-[calc(50%-20px)] xl:basis-[18%] min-w-0">
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
