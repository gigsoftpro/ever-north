import React from "react";
import ContactForm from "../../components/Contactform";
import { SiteDataProvider } from "../../components/SiteDataContext";

const ContactUs = () => {
  return (
    <SiteDataProvider>
      <div>
        <ContactForm />
      </div>
    </SiteDataProvider>
  );
};

export default ContactUs;
