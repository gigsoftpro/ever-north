import { Bell, LogOut, Menu, Sparkles } from "lucide-react";

export default function AdminTopbar({ setMobileNav, mobileNav, onLogout }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={() => setMobileNav(!mobileNav)}>
          <Menu />
        </button>
        <div>
          <p className="font-semibold text-slate-900">Premium Dashboard</p>
          <p className="text-xs text-slate-500">
            Luxury-grade content operations
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg bg-amber-100 text-amber-700">
          <Sparkles size={16} />
        </button>
        <button className="p-2 rounded-lg bg-slate-100 text-slate-700">
          <Bell size={16} />
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-slate-900 text-white flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );
}
