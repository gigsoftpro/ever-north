import { useState } from "react";
import { Eye, EyeOff, Save, Shield } from "lucide-react";
import { Card } from "../UI/Card";
import { Badge } from "../UI/Badge";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";

export default function ProfileEditor({ profile, setProfile, onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = (profile.name ?? "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* <Card className="lg:col-span-1 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-black text-3xl font-bold shadow-xl shadow-amber-200 mb-4">
          {initials}
        </div>

        <h3 className="font-semibold text-slate-900 text-sm">
          {profile.name || "Admin User"}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {profile.email || "admin@evernorth.com"}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <Badge variant="green">Active</Badge>
          <Badge variant="amber">Super Admin</Badge>
        </div>

        <div className="w-full mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          {[
            ["Role", "Super Admin"],
            ["Last Login", "Today"],
            ["2FA", "Enabled"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-slate-500">{k}</span>
              <span className="font-semibold text-slate-700">{v}</span>
            </div>
          ))}
        </div>
      </Card> */}

      {/* ── Form card ── */}
      <Card className="lg:col-span-2 space-y-5">
        {/* Section header */}
        <div>
          <h3 className="font-semibold text-slate-900">Account Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your personal information and login credentials
          </p>
        </div>

        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            value={profile.name ?? ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Your full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={profile.email ?? ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="admin@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={profile.password ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
            placeholder="Leave blank to keep current password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />
          <p className="text-[11px] text-slate-400 mt-1.5 ml-0.5">
            Minimum 8 characters. Use a mix of letters, numbers, and symbols.
          </p>
        </div>

        {/* Security notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <Shield size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Changes to your credentials will take effect immediately. You may be
            asked to log in again.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-1 border-t border-slate-100 flex flex-wrap gap-3 items-center">
          <Button variant="primary" icon={Save} onClick={handleSave}>
            {saved ? "Saved!" : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setProfile({ name: "", email: "", password: "" })}
          >
            Clear Form
          </Button>
          {saved && <Badge variant="green">✓ Profile updated</Badge>}
        </div>
      </Card>
    </div>
  );
}
