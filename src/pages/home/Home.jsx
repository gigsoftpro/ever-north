import React from "react";
import Hero from "../../components/Hero";
import About from "../../components/About";
import CleaningServices from "../../components/Cleaningservices";
import Services from "../../components/Services";
import AreasWeCover from "../../components/Areaswecover";
import Testimonial from "../../components/Testimonial";
import ContactForm from "../../components/Contactform";
import { SiteDataProvider } from "../../components/SiteDataContext";

const Home = () => {
  return (
    <SiteDataProvider>
      <Hero />
      <About />
      <hr className="border-[#e8e4db] my-10" />
      <Services />
      <CleaningServices />
      <AreasWeCover />
      <Testimonial />
      <ContactForm />
    </SiteDataProvider>
  );
};

export default Home;
