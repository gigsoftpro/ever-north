import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  Check,
  Loader2,
  AlertCircle,
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  Edit3,
  X,
  Eye,
  EyeOff,
  Image,
  Grid,
  Settings,
  MapPin,
} from "lucide-react";
import { getStoredToken } from "../../services/authApi";
import { BaseUrl } from "../Config/BaseUrl";

const AREAS_API = `${BaseUrl}areas`;
const MEDIA_API = `${BaseUrl}media`;
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { key: "banner", label: "Banner", icon: Image },
  { key: "intro", label: "Intro Section", icon: Grid },
  { key: "areas", label: "Areas Grid", icon: MapPin },
  { key: "manage", label: "Management Section", icon: Settings },
];

// ─── Shared UI primitives ─────────────────────────────────────────────────────
const FL = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-600 mb-1">
    {children}
  </label>
);

function AI({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  className = "",
}) {
  return (
    <div className={className}>
      {label && <FL>{label}</FL>}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white
          focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
          disabled:opacity-50 transition"
      />
    </div>
  );
}

function AT({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  disabled,
  className = "",
}) {
  return (
    <div className={className}>
      {label && <FL>{label}</FL>}
      <textarea
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white
          focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
          disabled:opacity-50 transition resize-none"
      />
    </div>
  );
}

function GB({
  children,
  onClick,
  disabled,
  type = "button",
  sm = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold text-white
        disabled:opacity-50 hover:opacity-90 transition-opacity
        ${sm ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} ${className}`}
      style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
    >
      {children}
    </button>
  );
}

function DB({ children, onClick, disabled, sm = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold text-white
        bg-slate-700 hover:bg-slate-800 disabled:opacity-50 transition-colors
        ${sm ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
    >
      {children}
    </button>
  );
}

function Pill({ status, message }) {
  if (!status) return null;
  const cls = {
    saving: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-600",
  }[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium
      px-3 py-1 rounded-full border ${cls}`}
    >
      {status === "saving" && <Loader2 size={12} className="animate-spin" />}
      {status === "success" && <Check size={12} />}
      {status === "error" && <AlertCircle size={12} />}
      {message ||
        { saving: "Saving…", success: "Saved!", error: "Error" }[status]}
    </span>
  );
}

function SCard({ title, subtitle, onSave, saving, status, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4
        border-b border-slate-100 bg-slate-50"
      >
        <div>
          <p className="text-sm font-bold text-slate-800">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Pill status={status?.type} message={status?.message} />
          {onSave && (
            <GB onClick={onSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> Save Changes
                </>
              )}
            </GB>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function CRow({ children, onEdit, onDelete, onToggle, active = true }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100
      bg-slate-50 hover:border-amber-200 transition group"
    >
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggle && (
          <button
            onClick={onToggle}
            title={
              active ? "Visible — click to hide" : "Hidden — click to show"
            }
            className={`p-1.5 rounded-lg ${
              active
                ? "text-green-600 hover:bg-green-50"
                : "text-slate-400 hover:bg-slate-200"
            }`}
          >
            {active ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50"
          >
            <Edit3 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useConfirm() {
  const [p, setP] = useState(null);
  const ask = (label, fn) => setP({ label, fn });
  const Modal = p ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4">
        <p className="text-sm font-bold text-slate-800 mb-1">Confirm Delete</p>
        <p className="text-xs text-slate-500 mb-4">{p.label}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              p.fn();
              setP(null);
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setP(null)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return { ask, Modal };
}

function useSave(fn) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const save = useCallback(
    async (...a) => {
      setSaving(true);
      setStatus({ type: "saving" });
      try {
        await fn(...a);
        setStatus({ type: "success", message: "Saved!" });
        setTimeout(() => setStatus(null), 3000);
      } catch (e) {
        setStatus({ type: "error", message: e.message });
      } finally {
        setSaving(false);
      }
    },
    [fn],
  );
  return { save, saving, status };
}

// ─── API helpers ──────────────────────────────────────────────────────────────
function authHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${AREAS_API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...opts.headers,
    },
    ...opts,
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message || `HTTP ${res.status}`);
  return d;
}

async function apiUpload(file, section) {
  const fd = new FormData();
  fd.append("image", file);
  fd.append("section", section);
  const res = await fetch(MEDIA_API, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message || "Upload failed");
  const m = d.media;
  return {
    ...m,
    url: m.path?.startsWith("http") ? m.path : `${SERVER_ROOT}${m.path}`,
  };
}

// ─── Image slot ───────────────────────────────────────────────────────────────
function ImgSlot({
  label,
  value,
  onUpload,
  onClear,
  section = "areas",
  tall = false,
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const url = value?.url || (typeof value === "string" ? value : null);
  const h = tall ? "h-48" : "h-36";

  const handle = async (file) => {
    if (!file?.type.startsWith("image/")) return;
    setBusy(true);
    try {
      onUpload(await apiUpload(file, section));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <FL>{label}</FL>}
      <div
        className={`rounded-xl overflow-hidden border-2 transition-all
        ${url ? "border-slate-200" : "border-dashed border-slate-200 hover:border-amber-300"}`}
      >
        {busy ? (
          <div
            className={`${h} flex items-center justify-center bg-amber-50 gap-2`}
          >
            <Loader2 size={20} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-500">Uploading…</span>
          </div>
        ) : url ? (
          <div className="relative group">
            <img src={url} alt={label} className={`w-full ${h} object-cover`} />
            <div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
              transition-opacity flex items-center justify-center gap-2"
            >
              <button
                onClick={() => ref.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold flex items-center gap-1"
              >
                <RefreshCw size={11} /> Replace
              </button>
              <button
                onClick={onClear}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 size={11} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => ref.current?.click()}
            className={`w-full ${h} flex flex-col items-center justify-center
              bg-slate-50 hover:bg-amber-50/50 transition-colors gap-1.5 group`}
          >
            <div
              className="p-2 rounded-xl bg-slate-200 group-hover:bg-amber-100
              text-slate-400 group-hover:text-amber-500 transition-all"
            >
              <Upload size={18} />
            </div>
            <p className="text-xs font-medium text-slate-500">
              {label || "Upload image"}
            </p>
            <p className="text-[10px] text-slate-400">Click to browse</p>
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
    </div>
  );
}

// ─── Locations CRUD ───────────────────────────────────────────────────────────
function LocationsCrud({ locations, setLocations }) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const blank = { name: "", description: "", sort_order: locations.length };
  const openNew = () => {
    setEditing({ item: blank });
    setFormErr("");
  };
  const openEdit = (item) => {
    setEditing({ item: { ...item } });
    setFormErr("");
  };

  const save = async () => {
    if (!editing.item.name?.trim()) {
      setFormErr("Location name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: editing.item.name,
        description: editing.item.description,
        icon_image_id: editing.item.icon_image?.id ?? null,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const r = await apiFetch(`/locations/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setLocations((p) =>
          p.map((x) => (x.id === editing.item.id ? r.data : x)),
        );
      } else {
        const r = await apiFetch("/locations", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setLocations((p) => [...p, r.data]);
      }
      setEditing(null);
    } catch (e) {
      setFormErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = (id) =>
    ask("This location card will be permanently deleted.", async () => {
      await apiFetch(`/locations/${id}`, { method: "DELETE" });
      setLocations((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`/locations/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setLocations((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Location Cards ({locations.length})
          </p>
          <GB onClick={openNew} sm>
            <Plus size={12} /> Add Location
          </GB>
        </div>

        {editing && (
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-4">
            <p className="text-xs font-bold text-amber-700">
              {editing.item.id ? "Edit Location" : "New Location"}
            </p>
            {formErr && (
              <p className="text-xs text-red-600 font-medium">{formErr}</p>
            )}

            <AI
              label="Location Name *"
              value={editing.item.name}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, name: e.target.value },
                }))
              }
            />
            <AT
              label="Description"
              rows={4}
              value={editing.item.description}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, description: e.target.value },
                }))
              }
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <ImgSlot
                label="Icon Image (optional — defaults to gold map pin)"
                value={editing.item.icon_image}
                onUpload={(m) =>
                  setEditing((p) => ({ item: { ...p.item, icon_image: m } }))
                }
                onClear={() =>
                  setEditing((p) => ({ item: { ...p.item, icon_image: null } }))
                }
                section="areas-icons"
              />
              <AI
                label="Sort Order"
                type="number"
                value={editing.item.sort_order}
                onChange={(e) =>
                  setEditing((p) => ({
                    item: { ...p.item, sort_order: Number(e.target.value) },
                  }))
                }
              />
            </div>

            <div className="flex gap-2 pt-1">
              <GB onClick={save} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Check size={13} /> {editing.item.id ? "Update" : "Create"}
                  </>
                )}
              </GB>
              <DB onClick={() => setEditing(null)}>
                <X size={13} /> Cancel
              </DB>
            </div>
          </div>
        )}

        {locations.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-xl">
            No locations yet — click "Add Location" to get started.
          </p>
        )}

        {locations.map((loc) => (
          <CRow
            key={loc.id}
            active={!!loc.is_active}
            onToggle={() => toggle(loc)}
            onEdit={() => openEdit(loc)}
            onDelete={() => del(loc.id)}
          >
            <div className="flex items-center gap-3">
              {loc.icon_image?.url ? (
                <img
                  src={loc.icon_image.url}
                  alt={loc.name}
                  className="w-8 h-8 object-contain rounded"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(0deg,#8f7334,#b7a170)",
                  }}
                >
                  <MapPin size={14} className="text-white" />
                </div>
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold truncate max-w-[320px]
                  ${loc.is_active ? "text-slate-800" : "text-slate-400 line-through"}`}
                >
                  {loc.name}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-[320px]">
                  {loc.description}
                </p>
              </div>
            </div>
          </CRow>
        ))}
      </div>
    </>
  );
}

// ─── Services bullet CRUD ─────────────────────────────────────────────────────
function ServicesCrud({ services, setServices }) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const openNew = () => {
    setEditing({ item: { text: "", sort_order: services.length } });
    setFormErr("");
  };
  const openEdit = (item) => {
    setEditing({ item: { ...item } });
    setFormErr("");
  };

  const save = async () => {
    if (!editing.item.text?.trim()) {
      setFormErr("Text is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        text: editing.item.text,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const r = await apiFetch(`/services/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setServices((p) =>
          p.map((x) => (x.id === editing.item.id ? r.data : x)),
        );
      } else {
        const r = await apiFetch("/services", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setServices((p) => [...p, r.data]);
      }
      setEditing(null);
    } catch (e) {
      setFormErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = (id) =>
    ask("This service item will be permanently deleted.", async () => {
      await apiFetch(`/services/${id}`, { method: "DELETE" });
      setServices((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`/services/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setServices((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Service Items ({services.length})
          </p>
          <GB onClick={openNew} sm>
            <Plus size={12} /> Add Item
          </GB>
        </div>

        {editing && (
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
            <p className="text-xs font-bold text-amber-700">
              {editing.item.id ? "Edit Service Item" : "New Service Item"}
            </p>
            {formErr && (
              <p className="text-xs text-red-600 font-medium">{formErr}</p>
            )}
            <AI
              label="Service Text *"
              value={editing.item.text}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, text: e.target.value },
                }))
              }
            />
            <AI
              label="Sort Order"
              type="number"
              value={editing.item.sort_order}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, sort_order: Number(e.target.value) },
                }))
              }
              className="sm:w-1/4"
            />
            <div className="flex gap-2 pt-1">
              <GB onClick={save} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Check size={13} /> {editing.item.id ? "Update" : "Create"}
                  </>
                )}
              </GB>
              <DB onClick={() => setEditing(null)}>
                <X size={13} /> Cancel
              </DB>
            </div>
          </div>
        )}

        {services.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-xl">
            No service items yet — click "Add Item" to get started.
          </p>
        )}

        {services.map((svc) => (
          <CRow
            key={svc.id}
            active={!!svc.is_active}
            onToggle={() => toggle(svc)}
            onEdit={() => openEdit(svc)}
            onDelete={() => del(svc.id)}
          >
            <p
              className={`text-sm ${svc.is_active ? "text-slate-800" : "text-slate-400 line-through"}`}
            >
              • {svc.text}
            </p>
          </CRow>
        ))}
      </div>
    </>
  );
}

// ─── Tab panels ───────────────────────────────────────────────────────────────
function BannerTab({ M, Img, onSave, saving, status }) {
  return (
    <SCard
      title="Banner Section"
      subtitle="Full-width hero image and the main headline title"
      onSave={onSave}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <ImgSlot
          label="Banner Background Image"
          tall
          {...Img("banner_image")}
          section="areas-banner"
        />
        <AI label="Banner Title" {...M("banner_title")} />
      </div>
    </SCard>
  );
}

function IntroTab({ M, Img, onSave, saving, status }) {
  return (
    <SCard
      title="Intro / Property Management Section"
      subtitle="Left-side heading and three description paragraphs, right-side image"
      onSave={onSave}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <AI label="Section Heading" {...M("intro_title")} />
        <AT label="Paragraph 1" rows={4} {...M("intro_para_1")} />
        <AT label="Paragraph 2" rows={4} {...M("intro_para_2")} />
        <AT label="Paragraph 3" rows={4} {...M("intro_para_3")} />
        <ImgSlot
          label="Right-side Image"
          tall
          {...Img("intro_image")}
          section="areas-intro"
        />
      </div>
    </SCard>
  );
}

function AreasTab({ M, onSave, saving, status, locations, setLocations }) {
  return (
    <div className="space-y-5">
      <SCard
        title="Areas Grid — Section Header"
        subtitle='The heading shown above the card grid (e.g. "Areas We Proudly Serve")'
        onSave={onSave}
        saving={saving}
        status={status}
      >
        <AI label="Section Title" {...M("areas_title")} />
      </SCard>

      <SCard
        title="Location Cards"
        subtitle="The 4-column gold-bordered cards — add, edit, reorder and toggle visibility"
      >
        <LocationsCrud locations={locations} setLocations={setLocations} />
      </SCard>
    </div>
  );
}

function ManageTab({ M, Img, onSave, saving, status, services, setServices }) {
  return (
    <div className="space-y-5">
      <SCard
        title="Management Solutions — Content"
        subtitle="Left-side image, heading, description and closing paragraph"
        onSave={onSave}
        saving={saving}
        status={status}
      >
        <div className="space-y-4">
          <ImgSlot
            label="Left-side Image"
            tall
            {...Img("manage_image")}
            section="areas-manage"
          />
          <AI label="Section Heading" {...M("manage_title")} />
          <AT label="Description Paragraph" rows={4} {...M("manage_desc")} />
          <AI
            label='Services Sub-heading (e.g. "Our Services Include")'
            {...M("manage_services_heading")}
          />
          <AT
            label="Closing Paragraph (shown below the bullet list)"
            rows={3}
            {...M("manage_closing_para")}
          />
        </div>
      </SCard>

      <SCard
        title="Service Bullet Items"
        subtitle="The gold-checkmark list shown in the management section"
      >
        <ServicesCrud services={services} setServices={setServices} />
      </SCard>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl mb-5">
      {TABS.map(({ key, label, icon: Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              flex-1 justify-center whitespace-nowrap transition-all duration-200
              ${
                on
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
              }`}
          >
            <Icon
              size={15}
              className={on ? "text-amber-500" : "text-slate-400"}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Root panel ───────────────────────────────────────────────────────────────
export default function AreasPagePanel() {
  const [activeTab, setActiveTab] = useState("banner");
  const [meta, setMeta] = useState({});
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const d = await apiFetch("");
      setMeta(d.data.meta || {});
      setLocations(d.data.locations || []);
      setServices(d.data.services || []);
    } catch (e) {
      setFetchErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Single meta save shared across tabs ─────────────────────────────────────
  const {
    save: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  } = useSave(
    useCallback(async () => {
      await apiFetch("", {
        method: "PUT",
        body: JSON.stringify({
          banner_image_id: meta.banner_image?.id ?? null,
          banner_title: meta.banner_title,
          intro_title: meta.intro_title,
          intro_para_1: meta.intro_para_1,
          intro_para_2: meta.intro_para_2,
          intro_para_3: meta.intro_para_3,
          intro_image_id: meta.intro_image?.id ?? null,
          areas_title: meta.areas_title,
          manage_image_id: meta.manage_image?.id ?? null,
          manage_title: meta.manage_title,
          manage_desc: meta.manage_desc,
          manage_services_heading: meta.manage_services_heading,
          manage_closing_para: meta.manage_closing_para,
        }),
      });
    }, [meta]),
  );

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const M = (k) => ({
    value: meta[k] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [k]: e.target.value })),
  });
  const Img = (k) => ({
    value: meta[k],
    onUpload: (m) => setMeta((p) => ({ ...p, [k]: m })),
    onClear: () => setMeta((p) => ({ ...p, [k]: null })),
  });
  const saveProps = {
    onSave: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-slate-100 rounded-2xl" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-white rounded-2xl border border-slate-100"
          />
        ))}
      </div>
    );

  // ── Fetch error ──────────────────────────────────────────────────────────────
  if (fetchErr)
    return (
      <div
        className="flex items-center gap-2 text-red-600 text-sm p-4
        bg-red-50 rounded-xl border border-red-200"
      >
        <AlertCircle size={16} />
        <span>{fetchErr}</span>
        <button
          onClick={load}
          className="ml-auto text-xs underline font-medium"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div>
      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "banner" && <BannerTab M={M} Img={Img} {...saveProps} />}

      {activeTab === "intro" && <IntroTab M={M} Img={Img} {...saveProps} />}

      {activeTab === "areas" && (
        <AreasTab
          M={M}
          {...saveProps}
          locations={locations}
          setLocations={setLocations}
        />
      )}

      {activeTab === "manage" && (
        <ManageTab
          M={M}
          Img={Img}
          {...saveProps}
          services={services}
          setServices={setServices}
        />
      )}
    </div>
  );
}
