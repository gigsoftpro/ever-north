// src/pages/AdminLogin.jsx
import { useState } from "react";
import { Building2, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "../../adminStore";

export default function AdminLogin() {
  const { login } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login (set by AuthGuard)
  const from = location.state?.from || "/admin";

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier.trim())
      return setError("Email or username is required.");
    if (!form.password) return setError("Password is required.");

    setLoading(true);
    const result = await login(form.identifier, form.password, form.rememberMe);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Invalid credentials. Please try again.");
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* ── Left panel ── */}
        <div className="hidden lg:flex p-10 bg-[radial-gradient(circle_at_top,_#d4b37a_0%,_#111827_60%)] text-white flex-col justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-amber-300" />
            <h2 className="text-2xl font-semibold">Ever North CMS</h2>
          </div>

          <div className="space-y-6">
            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {["Content Studio", "Media Vault", "Profile & Security"].map(
                (f) => (
                  <span
                    key={f}
                    className="text-xs bg-white/10 border border-white/20 text-amber-200 px-3 py-1 rounded-full"
                  >
                    {f}
                  </span>
                ),
              )}
            </div>
            <p className="text-slate-200 leading-8">
              Premium content operations dashboard for your landing page
              control, branding updates, and media management.
            </p>
          </div>
        </div>

        {/* ── Right – Login form ── */}
        <form
          onSubmit={submit}
          className="bg-white p-8 lg:p-12 space-y-5"
          noValidate
        >
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Admin Sign In
            </h1>
            <p className="text-slate-500 mt-1">
              Secure access to your premium dashboard.
            </p>
          </div>

          {/* Email / Username */}
          <label className="block">
            <span className="text-xs font-medium text-slate-500">
              Email or Username
            </span>
            <div
              className={`mt-1 flex items-center border rounded-xl px-3 transition-colors focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 ${
                error && !form.identifier
                  ? "border-red-400"
                  : "border-slate-200"
              }`}
            >
              <Mail size={16} className="text-slate-400 flex-shrink-0" />
              <input
                className="w-full p-3 outline-none text-slate-800 placeholder:text-slate-300"
                type="text"
                placeholder="admin@evernorth.com"
                autoComplete="username"
                value={form.identifier}
                onChange={handleChange("identifier")}
                disabled={loading}
              />
            </div>
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-xs font-medium text-slate-500">Password</span>
            <div
              className={`mt-1 flex items-center border rounded-xl px-3 transition-colors focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 ${
                error && !form.password ? "border-red-400" : "border-slate-200"
              }`}
            >
              <Lock size={16} className="text-slate-400 flex-shrink-0" />
              <input
                className="w-full p-3 outline-none text-slate-800 placeholder:text-slate-300"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange("password")}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 flex-shrink-0"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {/* Remember me */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={form.rememberMe}
                onChange={handleChange("rememberMe")}
                disabled={loading}
              />
              {/* Custom checkbox */}
              <div className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 transition-all flex items-center justify-center">
                {form.rememberMe && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Remember me</p>
              <p className="text-xs text-slate-400">
                {form.rememberMe
                  ? "You'll stay signed in for 30 days"
                  : "You'll be signed out when you close the browser"}
              </p>
            </div>
          </label>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 transition-all shadow-lg shadow-amber-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying…
              </>
            ) : (
              "Enter Dashboard"
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            Protected by JWT authentication &amp; rate limiting
          </p>
        </form>
      </div>
    </div>
  );
}
