import React from "react";
import About from "../../components/About";
import { SiteDataProvider } from "../../components/SiteDataContext";

const AboutUs = () => {
  return (
    <SiteDataProvider>
      <div>
        <About />
      </div>
    </SiteDataProvider>
  );
};

export default AboutUs;
