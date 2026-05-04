import React from "react";
import Hero from "../../components/Hero";
import About from "../../components/About";
import CleaningServices from "../../components/Cleaningservices";
import Services from "../../components/Services";
import AreasWeCover from "../../components/Areaswecover";
import Testimonial from "../../components/Testimonial";
import ContactForm from "../../components/Contactform";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <CleaningServices />
      <AreasWeCover />
      <Testimonial />
      <ContactForm />
    </div>
  );
};

export default Home;
