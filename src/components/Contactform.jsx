import { useState } from "react";
import contactBg from "../assets/images/rectangle_30_copy_2.jpg";
import { BaseUrl } from "./Config/BaseUrl";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

// ── Submission states ──────────────────────────────────────────────────────────
const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing again
    if (status === STATUS.ERROR) setStatus(STATUS.IDLE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === STATUS.LOADING) return;

    // Basic client-side validation
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

  // Made horizontal padding fluid (px-5 sm:px-6) so inputs never look cramped on narrow devices
  const inputClass =
    "w-full bg-[#f3f3f3] rounded-[15px] text-[#848484] text-base sm:text-lg px-5 sm:px-6 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-[#b7a170] transition-all placeholder-[#848484] disabled:opacity-60";

  const isLoading = status === STATUS.LOADING;

  return (
    <section
      className="w-full py-16 sm:py-20 lg:py-28 "
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-[1260px] mx-auto">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 lg:gap-16 xl:gap-20">
          <div className="w-full md:w-[40%] xl:w-[35%] text-white shrink-0">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl xl:text-7xl font-semibold leading-tight mb-6">
              Want more
              <br />
              information?
            </h2>
            <p className="text-base sm:text-lg xl:text-xl font-semibold leading-8 max-w-[392px] opacity-90">
              We're excited to connect with you! Required fields are marked *
            </p>
          </div>

          <div className="w-full md:flex-1 lg:max-w-[550px] xl:max-w-[700px] bg-white rounded-[30px] sm:rounded-[40px] p-6 sm:p-10 xl:p-12">
            <h3 className="text-[#303030] text-2xl sm:text-3xl font-normal mb-8">
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

            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Phone + Subject */}
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
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>

              {/* Message */}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="font-semibold text-white text-sm tracking-widest uppercase px-8 py-3.5 sm:py-3 hover:opacity-90 transition-opacity rounded-sm mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </div>
    </section>
  );
}
