import { useState } from "react";
import { Building2, Lock, Mail } from "lucide-react";
import { useAppStore } from "../../adminStore.jsx";

export default function AdminLogin() {
  const { login } = useAppStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!login(form.email, form.password))
      return setError("Invalid credentials");
    window.location.pathname = "/admin";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="hidden lg:flex p-10 bg-[radial-gradient(circle_at_top,_#d4b37a_0%,_#111827_60%)] text-white flex-col justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-amber-300" />
            <h2 className="text-2xl font-semibold">Ever North CMS</h2>
          </div>
          <p className="text-slate-200 leading-8">
            Premium content operations dashboard for your landing page control,
            branding updates, and media management.
          </p>
        </div>
        <form onSubmit={submit} className="bg-white p-8 lg:p-12 space-y-5">
          <h1 className="text-3xl font-semibold text-slate-900">
            Admin Sign In
          </h1>
          <p className="text-slate-500">
            Secure access to your premium dashboard.
          </p>
          <label className="block">
            <span className="text-xs text-slate-500">Email</span>
            <div className="mt-1 flex items-center border rounded-xl px-3">
              <Mail size={16} className="text-slate-400" />
              <input
                className="w-full p-3 outline-none"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Password</span>
            <div className="mt-1 flex items-center border rounded-xl px-3">
              <Lock size={16} className="text-slate-400" />
              <input
                className="w-full p-3 outline-none"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </label>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-amber-700 to-amber-500">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
