import { useState } from "react";
// import contactBgFallback from "../assets/images/rectangle_30_copy_2.jpg";
import { BaseUrl } from "./Config/BaseUrl";
import { useSiteData } from "./SiteDataContext";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function ContactForm() {
  const { siteData, loading: siteLoading } = useSiteData();
  const contact = siteData?.contact;

  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errMsg, setErrMsg] = useState("");

  // ── Dynamic content with fallbacks ────────────────────────────────────────
  const bgImage = contact?.bg_image?.url;
  const heading = contact?.heading || "Want more information?";
  const subheading =
    contact?.subheading ||
    "We're excited to connect with you! Required fields are marked *";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === STATUS.ERROR) setStatus(STATUS.IDLE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === STATUS.LOADING) return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus(STATUS.ERROR);
      setErrMsg("Name, email, and message are required.");
      return;
    }

    setStatus(STATUS.LOADING);
    setErrMsg("");

    try {
      const res = await fetch(`${BaseUrl}content/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus(STATUS.SUCCESS);
        setForm(INITIAL_FORM);
      } else {
        setStatus(STATUS.ERROR);
        setErrMsg(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setStatus(STATUS.ERROR);
      setErrMsg("Network error. Please check your connection and try again.");
    }
  };

  const inputClass =
    "w-full bg-[#f3f3f3] rounded-[10px] md:rounded-[12px] text-[#848484] text-base sm:text-lg px-5 sm:px-6 py-2.5 sm:py-4 outline-none focus:ring-2 focus:ring-[#b7a170] transition-all placeholder-[#848484] disabled:opacity-60";

  const isLoading = status === STATUS.LOADING;

  return (
    <section
      className="w-full py-16 sm:py-20 lg:py-28"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 xl:gap-16">
          {/* ── Left: heading block ── */}
          <div className="w-full lg:w-[30%] xl:w-[32%] text-white shrink-0 text-center lg:text-start">
            {siteLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-10 bg-white/20 rounded-lg w-3/4" />
                <div className="h-10 bg-white/20 rounded-lg w-1/2" />
                <div className="h-5  bg-white/20 rounded    w-full mt-4" />
                <div className="h-5  bg-white/20 rounded    w-4/5" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-5xl xl:text-5xl font-semibold leading-tight mb-5 whitespace-pre-line">
                  {heading}
                </h2>
                <p className="text-base sm:text-lg xl:text-xl font-semibold leading-7 max-w-full lg:max-w-[392px] opacity-90">
                  {subheading}
                </p>
              </>
            )}
          </div>

          {/* ── Right: form card ── */}
          <div className="w-full lg:flex-1 lg:min-w-0 bg-white rounded-[30px] sm:rounded-[40px] p-7 sm:p-10 xl:p-12">
            <h3 className="text-[#303030] text-xl sm:text-3xl font-medium mb-6 md:mb-8 mt-1 text-center lg:text-start">
              Leave Us A Message
            </h3>

            {status === STATUS.SUCCESS && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-medium">
                ✓ Message sent! We'll be in touch with you shortly.
              </div>
            )}

            {status === STATUS.ERROR && errMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
                {errMsg}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-center flex flex-col lg:block"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                  required
                >
                  <option value="">Select your option</option>
                  <option value="short-term-property-management">
                    Short term property management
                  </option>
                  <option value="long-term-property-management">
                    Long term property management
                  </option>
                  <option value="hybrid-property-management">
                    Hybrid property management
                  </option>
                  {/* <option value="vacation-rental-management">
                    Vacation rental management
                  </option> */}
                  {/* <option value="other-subject">Your subject</option> */}
                </select>

                {/* Show input box only when "Your subject" is selected */}
                {/* {form.subject === "other-subject" && (
                  <input
                    type="text"
                    name="customSubject"
                    placeholder="Enter your subject"
                    value={form.customSubject || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputClass}
                  />
                )} */}
              </div>

              <textarea
                name="message"
                placeholder="Message *"
                rows={5}
                value={form.message}
                onChange={handleChange}
                disabled={isLoading}
                className={`${inputClass} resize-none`}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mb-1 font-semibold text-white text-sm tracking-widest uppercase px-8 py-3.5 hover:opacity-90 transition-opacity  mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)",
                }}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
