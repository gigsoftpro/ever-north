import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import ContentEditor from "../../components/admin/ContentEditor";
import ProfileEditor from "../../components/admin/ProfileEditor";
import { StatCard } from "../../components/UI/StatCard";
import { useAppStore } from "../../adminStore";
import ImageEditor from "../../components/admin/ImageEditor";
import AdminHome from "../../components/admin/AdminHome";
import ContactPagePanel from "../../components/admin/ContactPagePanel";
import AboutPagePanel from "../../components/admin/AboutPagePanel";
import RenovationPagePanel from "../../components/admin/RenovationPagePanel";
import ServicesPagePanel from "../../components/admin/RenovationPagePanel";

const STAT_TILES = [
  {
    label: "Site Sections",
    value: "11",
    icon: FileText,
    trend: "All editable",
    color: "amber",
  },
  {
    label: "Media Uploads",
    value: "—",
    icon: ImageIcon,
    trend: "Managed per section",
    color: "blue",
  },
  {
    label: "Contact Inbox",
    value: "—",
    icon: MessageSquare,
    trend: "Check Inbox tab",
    color: "green",
  },
  {
    label: "CMS Version",
    value: "v3.0",
    icon: BarChart3,
    trend: "Backend-connected",
    color: "violet",
  },
];

export default function AdminDashboard() {
  const { user, updateProfile, logout } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(
    user ?? { name: "", email: "", password: "" },
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = location.pathname.replace(/^\/admin\/?/, "") || "content";

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "#f0f2f7" }}
      >
        {/* Sidebar */}
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} user={user} />

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 h-screen lg:ml-64 bg-white">
          {/* Top bar */}
          <div className="flex-shrink-0">
            <AdminTopbar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={handleLogout}
            />
          </div>

          {/* Scrollable content area */}
          <main
            className="flex-1 overflow-y-auto p-4 space-y-5 rounded-2xl border-gray-300 border-2 ml-2 lg:ml-0 mr-2" id="displaynoscrollbar"
            style={{ background: "#f0f2f7" }}
          >
            {/* ── Stat tiles ─────────────────────────────────────────────── */}
            {/* <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {STAT_TILES.map((tile) => (
                <StatCard
                  key={tile.label}
                  label={tile.label}
                  value={tile.value}
                  icon={tile.icon}
                  trend={tile.trend}
                  color={tile.color}
                />
              ))}
            </div> */}

            {/* {(active === "images" || active === "") && <ImageEditor />} */}
            {(active === "dashboard" || active === "") && <AdminHome />}
            {(active === "content" || active === "") && <ContentEditor />}
            {(active === "contact" || active === "") && <ContactPagePanel />}
            {(active === "about" || active === "") && <AboutPagePanel />}
            {(active === "ourservices" || active === "") && (
              <ServicesPagePanel />
            )}

            {active === "profile" && (
              <ProfileEditor
                profile={profile}
                setProfile={setProfile}
                onSave={() => updateProfile(profile)}
              />
            )}

            {/* Add more panels here as needed (e.g. active === "media") */}
          </main>

          {/* Footer */}
          <footer className="flex-shrink-0 bg-white py-1.5 md:py-2.5">
            <p className="text-center text-xs text-slate-400">
              © Ever North {new Date().getFullYear()} · All rights reserved
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
