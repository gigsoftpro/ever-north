import { useState, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Save,
  Shield,
  User,
  Lock,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { BaseUrl } from "../Config/BaseUrl";
import { getStoredToken } from "../../services/authApi";
import { useAppStore } from "../../adminStore";

function StatusBanner({ type, message }) {
  if (!message) return null;
  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50   border-red-200   text-red-600",
  };
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${styles[type]}`}
    >
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

async function apiFetch(path, options = {}) {
  const token = getStoredToken();
  const res = await fetch(`${BaseUrl}auth${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function ProfileEditor() {
  const { user, refreshUser } = useAppStore();

  // ── Profile fields ────────────────────────────────────────────────────
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!email.trim())
      return setProfileStatus({ type: "error", message: "Email is required." });
    setProfileSaving(true);
    setProfileStatus({ type: "", message: "" });
    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      await refreshUser();
      setProfileStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => setProfileStatus({ type: "", message: "" }), 4000);
    } catch (err) {
      setProfileStatus({ type: "error", message: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Change password fields ────────────────────────────────────────────
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passStatus, setPassStatus] = useState({ type: "", message: "" });
  const [passSaving, setPassSaving] = useState(false);

  const savePassword = async (e) => {
    e.preventDefault();
    if (!currentPass)
      return setPassStatus({
        type: "error",
        message: "Enter your current password.",
      });
    if (newPass.length < 8)
      return setPassStatus({
        type: "error",
        message: "New password must be at least 8 characters.",
      });
    if (newPass !== confirmPass)
      return setPassStatus({
        type: "error",
        message: "Passwords do not match.",
      });
    setPassSaving(true);
    setPassStatus({ type: "", message: "" });
    try {
      await apiFetch("/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      });
      setPassStatus({
        type: "success",
        message: "Password changed successfully!",
      });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => setPassStatus({ type: "", message: "" }), 4000);
    } catch (err) {
      setPassStatus({ type: "error", message: err.message });
    } finally {
      setPassSaving(false);
    }
  };

  // Password strength
  const strength =
    newPass.length === 0
      ? 0
      : newPass.length < 6
        ? 1
        : newPass.length < 10
          ? 2
          : /[A-Z]/.test(newPass) &&
              /[0-9]/.test(newPass) &&
              /[^A-Za-z0-9]/.test(newPass)
            ? 4
            : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-yellow-400",
    "bg-blue-400",
    "bg-green-400",
  ];

  return (
    <div className="space-y-5">
      {/* ── Profile Card ── */}
      <Card>
        <form onSubmit={saveProfile} className="space-y-5">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <User size={16} className="text-amber-600" /> Account Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your display name and email address
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <StatusBanner {...profileStatus} />

          <div className="pt-1 border-t border-slate-100 flex gap-3 items-center">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
            >
              {profileSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </Card>

      {/* ── Change Password Card ── */}
      <Card>
        <form onSubmit={savePassword} className="space-y-5">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Lock size={16} className="text-amber-600" /> Change Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Requires your current password to confirm
            </p>
          </div>

          {/* Current password */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Current Password
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-colors">
              <input
                type={showCurrent ? "text" : "password"}
                className="w-full p-3 outline-none text-sm text-slate-800 placeholder:text-slate-300"
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => {
                  setCurrentPass(e.target.value);
                  setPassStatus({ type: "", message: "" });
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              New Password
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-colors">
              <input
                type={showNew ? "text" : "password"}
                className="w-full p-3 outline-none text-sm text-slate-800 placeholder:text-slate-300"
                placeholder="At least 8 characters"
                value={newPass}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  setPassStatus({ type: "", message: "" });
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {newPass.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${strength >= n ? strengthColor[strength] : "bg-slate-200"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Confirm New Password
            </label>
            <div
              className={`flex items-center border rounded-xl px-3 transition-colors focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 ${confirmPass && confirmPass !== newPass ? "border-red-300" : "border-slate-200"}`}
            >
              <input
                type={showNew ? "text" : "password"}
                className="w-full p-3 outline-none text-sm text-slate-800 placeholder:text-slate-300"
                placeholder="Repeat new password"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                  setPassStatus({ type: "", message: "" });
                }}
                autoComplete="new-password"
              />
            </div>
            {confirmPass && confirmPass !== newPass && (
              <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
            )}
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <Shield size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Use a mix of letters, numbers, and symbols for a stronger
              password. You'll remain logged in after changing.
            </p>
          </div>

          <StatusBanner {...passStatus} />

          <div className="pt-1 border-t border-slate-100">
            <button
              type="submit"
              disabled={passSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
            >
              {passSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Updating…
                </>
              ) : (
                <>
                  <Lock size={14} /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
