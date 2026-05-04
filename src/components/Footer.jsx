import footerLogo from "../assets/images/asset_10_4x.png";
import footerBuilding from "../assets/images/asset_10_4x_copy.png";
import { useAppStore } from "../adminStore.jsx";

export default function Footer() {
  const { content } = useAppStore();
  const navLinks = content.site.navLinks;

  return (
    <footer className="bg-[#2c2c2c] text-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-28 pt-12 pb-6 relative ">
        <img
          src={footerBuilding}
          alt="building"
          className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 h-[75%] w-auto opacity-80"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-8 items-start relative">
          {/* Brand Column */}
          <div className="xl:col-span-1 max-w-[560px]">
            <img
              src={content.images.footerLogo || footerLogo}
              alt="Ever North"
              className="h-16 sm:h-[81px] w-auto mb-6"
            />
            <p className="text-white text-sm sm:text-base leading-8">
              {content.footer.description}
            </p>
          </div>

          {/* Building Image — hidden on small screens */}
          {/* <div className="hidden xl:block absolute right-[580px] top-0">
            <img src={footerBuilding} alt="" className="max-h-[344px] w-auto" />
          </div> */}

          {/* Quick Links */}
          <div>
            <h4 className="text-[#b7a170] text-xl sm:text-2xl font-light mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white text-sm sm:text-base leading-10 hover:text-[#b7a170] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[#b7a170] text-xl sm:text-2xl font-light mb-6"></h4>
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
          <div>
            <h4 className="text-[#b7a170] text-xl sm:text-2xl font-light mb-6">
              Contact
            </h4>
            <p className="text-white text-sm sm:text-base leading-8 mb-4">
              Email:
              <br />
              {content.footer.email}
            </p>
            <p className="text-white text-sm sm:text-base leading-8">
              Phone:
              <br />
              {content.footer.phone}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#393939] mt-8 mb-6" />

        {/* Copyright */}
        <p className="text-white text-xs sm:text-sm text-center">
          © Copyright 2026 Ever North. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
