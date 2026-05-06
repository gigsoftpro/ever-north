import React from "react";
import { SiteDataProvider } from "../../components/SiteDataContext";
import CleaningServices from "../../components/Cleaningservices";

const ourservices = () => {
  return (
    <SiteDataProvider>
      <div>
        <CleaningServices />
      </div>
    </SiteDataProvider>
  );
};

export default ourservices;
