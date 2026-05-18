import React from "react";
import AreasWeCover from "../../components/Areaswecover";
import { SiteDataProvider } from "../../components/SiteDataContext";

const AreaWeServe = () => {
  return (
    <SiteDataProvider>
      <AreasWeCover />
    </SiteDataProvider>
  );
};

export default AreaWeServe;
