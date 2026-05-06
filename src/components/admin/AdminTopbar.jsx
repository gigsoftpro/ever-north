import { Bell, LogOut, Menu, Settings, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton";

const LABELS = {
  "/admin/content": "Content Studio",
  "/admin/images": "Media Vault",
  "/admin/profile": "Profile & Security",
};

export default function AdminTopbar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageLabel = LABELS[location.pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl px-5 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left – hamburger + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <Menu size={18} />
          </button>

          <div>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
              <button
                onClick={() => navigate("/admin/content")}
                className="flex items-center gap-1 hover:text-slate-600 transition-colors"
              >
                <Home size={10} />
                <span>Dashboard</span>
              </button>
              <span>/</span>
              <span className="text-amber-600 font-semibold">{pageLabel}</span>
            </div>

            {/* Page title */}
            <h2 className="text-slate-900 font-semibold text-[15px] leading-tight">
              {pageLabel}
            </h2>
          </div>
        </div>

        {/* Right – actions */}
        <div className="flex items-center gap-1.5">
          <button
            className="p-2.5 rounded-xl text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-all"
            title="Notifications"
          >
            <Bell size={16} />
          </button>
          <button
            className="p-2.5 rounded-xl text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-all"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          <div className="w-px h-5 bg-slate-200 mx-1" />

          <LogoutButton/>
        </div>
      </div>
    </header>
  );
}
