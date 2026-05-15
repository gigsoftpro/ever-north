import {
  FileText,
  Image as ImageIcon,
  Shield,
  Gem,
  ChevronRight,
  X,
  Phone,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: FileText },
  { path: "/admin/content", label: "Manage Home", icon: FileText },
  // { path: "/admin/images", label: "Media Vault", icon: ImageIcon }, // This is a test route made for image edit and upload and manage
  { path: "/admin/contact", label: "Manage Contact", icon: Phone },
  { path: "/admin/about", label: "Manage About Us", icon: Shield },
  { path: "/admin/ourservices", label: "Manage Our Services", icon: Shield },
  { path: "/admin/profile", label: "Profile & Security", icon: Shield },
];

export default function AdminSidebar({ open, setOpen, user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 flex flex-col
          shadow-xl shadow-slate-200/50
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-200/60 flex-shrink-0">
              <Gem size={15} className="text-white" />
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm tracking-wide leading-tight">
                Ever North
              </p>
              <p className="text-slate-400 text-[11px]">Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-0.5">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm
                  transition-all duration-150 group relative
                  ${
                    isActive
                      ? "bg-amber-50 border border-amber-200/70 text-amber-700"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                  }
                `}
              >
                {/* Active pill */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber-500 rounded-r-full" />
                )}

                {/* Icon */}
                <span
                  className={`
                    p-1.5 rounded-lg transition-colors flex-shrink-0
                    ${
                      isActive
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                    }
                  `}
                >
                  <Icon size={14} />
                </span>

                <span className="font-medium flex-1">{label}</span>

                {isActive && (
                  <ChevronRight
                    size={13}
                    className="text-amber-500/70 flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── User footer ── */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-amber-200/50">
              {(user?.name ?? "A")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 text-xs font-semibold truncate leading-tight">
                {user?.name ?? "Admin User"}
              </p>
              <p className="text-slate-400 text-[10px] truncate">
                {user?.email ?? "admin@evernorth.com"}
              </p>
            </div>
            {/* Online dot */}
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 ring-2 ring-emerald-400/30" />
          </div>
        </div>
      </aside>
    </>
  );
}
