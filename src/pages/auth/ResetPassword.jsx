import { useState, useEffect } from "react";
import {
  Building2,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BaseUrl } from "../../components/Config/BaseUrl";

const STEP = { OTP: "otp", PASSWORD: "password", DONE: "done" };

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get("token") || "";

  const [step, setStep] = useState(STEP.OTP);
  const [token, setToken] = useState(tokenFromUrl);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNew] = useState("");
  const [confirmPass, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP input refs for auto-focus
  const otpRefs = Array.from({ length: 6 }, () => null);
  const setRef = (i) => (el) => {
    otpRefs[i] = el;
  };

  const otpString = otp.join("");

  // ── Handle OTP box input ────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    setError("");
    if (digit && i < 5) otpRefs[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs[5]?.focus();
    }
    e.preventDefault();
  };

  // ── Step 1: Verify OTP ──────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpString.length < 6) return setError("Enter all 6 digits.");
    if (!token.trim())
      return setError("Reset token is missing. Use the link from your email.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, otp: otpString }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setStep(STEP.PASSWORD);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Set new password ────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8)
      return setError("Password must be at least 8 characters.");
    if (newPassword !== confirmPass) return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, otp: otpString, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStep(STEP.DONE);
      setTimeout(() => navigate("/admin/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-[radial-gradient(circle_at_top,_#d4b37a_0%,_#111827_70%)] px-10 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="text-amber-300" size={20} />
            <span className="text-white font-semibold">Ever North CMS</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">
            {step === STEP.OTP && "Verify OTP"}
            {step === STEP.PASSWORD && "Set New Password"}
            {step === STEP.DONE && "All Done!"}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {step === STEP.OTP && "Enter the 6-digit code from your email"}
            {step === STEP.PASSWORD && "Choose a strong new password"}
            {step === STEP.DONE && "Your password has been reset"}
          </p>
        </div>

        <div className="p-10">
          {/* ── DONE ── */}
          {step === STEP.DONE && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-200">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">
                Password Reset!
              </p>
              <p className="text-slate-500 text-sm">
                Redirecting you to login…
              </p>
              <Link
                to="/admin/login"
                className="block w-full py-3 rounded-xl text-white font-semibold text-center"
                style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* ── STEP 1: OTP ── */}
          {step === STEP.OTP && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Token input — shown only if not in URL */}
              {!tokenFromUrl && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Reset Token (from email link)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                    placeholder="Paste token from your email link"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setError("");
                    }}
                  />
                </div>
              )}

              {/* OTP boxes */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-3 text-center">
                  6-Digit OTP
                </label>
                <div
                  className="flex gap-2 justify-center"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={setRef(i)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                        ${digit ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-800"}
                        focus:border-amber-400 focus:ring-2 focus:ring-amber-100`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpString.length < 6}
                className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Verify OTP
                  </>
                )}
              </button>

              <Link
                to="/admin/forgot-password"
                className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={14} /> Request a new link
              </Link>
            </form>
          )}

          {/* ── STEP 2: New Password ── */}
          {step === STEP.PASSWORD && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  New Password
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-colors">
                  <KeyRound size={16} className="text-slate-400 shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full p-3 outline-none text-slate-800 placeholder:text-slate-300"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNew(e.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Confirm Password
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-colors">
                  <KeyRound size={16} className="text-slate-400 shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full p-3 outline-none text-slate-800 placeholder:text-slate-300"
                    placeholder="Repeat your password"
                    value={confirmPass}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                  />
                </div>
                {/* Strength indicator */}
                {newPassword.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          newPassword.length >= n * 3
                            ? n <= 1
                              ? "bg-red-400"
                              : n <= 2
                                ? "bg-yellow-400"
                                : n <= 3
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Resetting…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
