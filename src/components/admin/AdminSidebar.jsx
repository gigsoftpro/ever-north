import { FileText, Image as ImageIcon, User, Gem } from "lucide-react";

const items = [
  { key: "content", label: "Content Studio", icon: FileText },
  { key: "images", label: "Media Vault", icon: ImageIcon },
  { key: "profile", label: "Profile", icon: User },
];

export default function AdminSidebar({
  active,
  setActive,
  mobileNav,
  setMobileNav,
}) {
  return (
    <aside
      className={`fixed lg:static z-20 h-screen w-[19rem] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-6 border-r border-white/10 ${mobileNav ? "block" : "hidden"} lg:block`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Gem size={16} className="text-amber-300" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Ever North</h1>
          <p className="text-xs text-slate-400">Premium Admin Panel</p>
        </div>
      </div>
      <nav className="mt-10 space-y-2">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActive(key);
              setMobileNav(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${active === key ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black shadow-lg" : "hover:bg-white/10"}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
