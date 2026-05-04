import { useMemo, useState } from "react";
import { useAppStore } from "../../adminStore.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import ContentEditor from "../../components/admin/ContentEditor";
import ImageEditor from "../../components/admin/ImageEditor";
import ProfileEditor from "../../components/admin/ProfileEditor";

const textSections = [
  {
    id: "hero",
    title: "Hero",
    fields: [
      ["hero.title", "Title"],
      ["hero.cta", "CTA Button"],
    ],
  },
  {
    id: "site",
    title: "Header",
    fields: [
      ["site.brandName", "Brand Name"],
      ["site.phone", "Phone"],
      ["site.email", "Email"],
    ],
  },
  {
    id: "about",
    title: "About",
    fields: [
      ["about.missionTitle", "Mission Title"],
      ["about.missionText1", "Mission Text 1"],
      ["about.missionText2", "Mission Text 2"],
      ["about.aboutTitle", "About Title"],
      ["about.aboutText", "About Text"],
    ],
  },
  {
    id: "services",
    title: "Services",
    fields: [
      ["services.sectionTitle", "Section Title"],
      ["services.cards.0.title", "Card 1 Title"],
      ["services.cards.0.description", "Card 1 Description"],
      ["services.cards.1.title", "Card 2 Title"],
      ["services.cards.2.title", "Card 3 Title"],
      ["services.consultationCta", "Consultation CTA"],
      ["services.callCta", "Call CTA"],
    ],
  },
  {
    id: "footer",
    title: "Footer",
    fields: [
      ["footer.description", "Description"],
      ["footer.email", "Email"],
      ["footer.phone", "Phone"],
    ],
  },
];

const imageFields = [
  ["images.heroBg", "Hero Background"],
  ["images.aboutMain", "About Image"],
  ["images.service1", "Service Card 1 BG"],
  ["images.service2", "Service Card 2 BG"],
  ["images.service3", "Service Card 3 BG"],
  ["images.headerBg", "Header Background"],
  ["images.footerLogo", "Footer Logo"],
];

export default function AdminDashboard() {
  const { content, persistContent, resetContent, user, updateProfile, logout } =
    useAppStore();
  const [draft, setDraft] = useState(content);
  const [profile, setProfile] = useState(user);
  const [mobileNav, setMobileNav] = useState(false);
  const [active, setActive] = useState("content");

  const stats = useMemo(
    () => ({
      textFields: textSections.reduce((a, s) => a + s.fields.length, 0),
      imageFields: imageFields.length,
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex">
        <AdminSidebar
          active={active}
          setActive={setActive}
          mobileNav={mobileNav}
          setMobileNav={setMobileNav}
        />
        <main className="flex-1 lg:ml-0">
          <AdminTopbar
            mobileNav={mobileNav}
            setMobileNav={setMobileNav}
            onLogout={() => {
              logout();
              window.location.pathname = "/admin/login";
            }}
          />
          <div className="p-4 lg:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm text-slate-500">Editable text fields</p>
                <p className="text-2xl font-bold">{stats.textFields}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-sm text-slate-500">Image slots</p>
                <p className="text-2xl font-bold">{stats.imageFields}</p>
              </div>
            </div>
            {active === "content" && (
              <ContentEditor
                draft={draft}
                setDraft={setDraft}
                textSections={textSections}
              />
            )}
            {active === "images" && (
              <ImageEditor
                draft={draft}
                setDraft={setDraft}
                imageFields={imageFields}
              />
            )}
            {active === "profile" && (
              <ProfileEditor
                profile={profile}
                setProfile={setProfile}
                onSave={() => updateProfile(profile)}
              />
            )}
            <div className="flex flex-wrap gap-3">
              <button
                className="px-5 py-2 rounded bg-[#b7a170] font-semibold"
                onClick={() => persistContent(draft)}
              >
                Save All Changes
              </button>
              <button
                className="px-5 py-2 rounded bg-slate-700 text-white"
                onClick={() => {
                  resetContent();
                  setDraft(content);
                }}
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
