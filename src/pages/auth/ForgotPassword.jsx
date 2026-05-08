import { useState } from "react";
import { Building2, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BaseUrl } from "../../components/Config/BaseUrl";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setSent(true);
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
          <h1 className="text-2xl font-semibold text-white">Forgot Password</h1>
          <p className="text-white/70 text-sm mt-1">
            Enter your email to receive a reset link and OTP
          </p>
        </div>

        <div className="p-10">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-200">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg">
                  Check your inbox
                </p>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  If <strong>{email}</strong> is registered, you'll receive a
                  reset link and a 6-digit OTP valid for 15 minutes.
                </p>
              </div>
              {/* <Link
                to="/admin/reset-password"
                className="block w-full py-3 rounded-xl text-white font-semibold text-center"
                style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
              >
                Enter OTP & Reset Password
              </Link> */}
              <Link
                to="/admin/login"
                className="block text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Email Address
                </label>
                <div
                  className={`flex items-center border rounded-xl px-3 transition-colors focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 ${error ? "border-red-400" : "border-slate-200"}`}
                >
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    className="w-full p-3 outline-none text-slate-800 placeholder:text-slate-300"
                    placeholder="admin@evernorth.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1.5">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
