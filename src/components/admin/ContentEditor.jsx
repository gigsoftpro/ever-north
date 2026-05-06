/**
 * ContentEditor.jsx
 * Full admin content management — every section wired to the real backend.
 *
 * Tabs:  Hero · Header · About · Services · Cleaning · Maintenance ·
 *        Areas · Testimonials · Footer · Nav Links · Contact Inbox
 *
 * Usage: drop this file into your admin components folder and import normally.
 *        It reads the auth token via getStoredToken() (same helper used elsewhere).
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  Edit3,
  X,
  Check,
  Save,
  Star,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  Globe,
  ArrowUpDown,
} from "lucide-react";
import { getStoredToken } from "../../services/authApi"; // adjust path if needed
import { BaseUrl } from "../Config/BaseUrl";

// ─── API constants ────────────────────────────────────────────────────────────
const API = `${BaseUrl}content`;
const MEDIA_API = `${BaseUrl}media`;
// Derive server root for building media preview URLs
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Low-level fetch helpers ──────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const token = getStoredToken();
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function uploadFile(file, section = "general") {
  const token = getStoredToken();
  const formData = new FormData();
  formData.append("image", file);
  formData.append("section", section);
  const res = await fetch(MEDIA_API, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  // Build preview URL from path stored in DB
  const media = data.media;
  return {
    ...media,
    url: media.path?.startsWith("http")
      ? media.path
      : `${SERVER_ROOT}${media.path}`,
  };
}

// ─── Shared mini-UI ───────────────────────────────────────────────────────────

const Spinner = ({ size = 16 }) => (
  <Loader2 size={size} className="animate-spin" />
);

const StatusPill = ({ status, message }) => {
  if (!status || status === "idle") return null;
  const map = {
    saving: "bg-blue-50  border-blue-200  text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50   border-red-200   text-red-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${map[status]}`}
    >
      {status === "saving" && <Spinner size={12} />}
      {status === "success" && <Check size={12} />}
      {status === "error" && <AlertCircle size={12} />}
      {message ||
        { saving: "Saving…", success: "Saved!", error: "Failed" }[status]}
    </span>
  );
};

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {children}
    </label>
  );
}

function AdminInput({
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
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 disabled:opacity-50 transition"
      />
    </div>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  disabled,
  className = "",
}) {
  return (
    <div className={className}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 disabled:opacity-50 transition resize-none"
      />
    </div>
  );
}

function GoldBtn({
  children,
  onClick,
  disabled,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity ${className}`}
      style={{ background: "linear-gradient(0deg, #8f7334 0%, #b7a170 100%)" }}
    >
      {children}
    </button>
  );
}

function DarkBtn({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-red-200 ${className}`}
    >
      {children}
    </button>
  );
}

function SectionCard({ title, subtitle, status, onSave, saving, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={status?.type} message={status?.message} />
          {onSave && (
            <GoldBtn onClick={onSave} disabled={saving}>
              {saving ? (
                <>
                  <Spinner size={14} /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> Save
                </>
              )}
            </GoldBtn>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Image upload slot ────────────────────────────────────────────────────────
function ImageSlot({
  label,
  value,
  onUpload,
  onClear,
  uploading,
  section = "general",
}) {
  const [dragging, setDragging] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const inputRef = useRef(null);
  const isUploading = uploading || localUploading;

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setLocalUploading(true);
    try {
      const media = await uploadFile(file, section);
      onUpload(media);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLocalUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const previewUrl = value?.url || (typeof value === "string" ? value : null);

  return (
    <div>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
          dragging
            ? "border-amber-400 shadow-lg shadow-amber-100"
            : previewUrl
              ? "border-slate-200"
              : "border-dashed border-slate-200 hover:border-amber-300"
        }`}
      >
        {isUploading ? (
          <div className="h-32 flex flex-col items-center justify-center bg-amber-50 gap-2">
            <Spinner size={24} />
            <p className="text-xs text-slate-500">Uploading…</p>
          </div>
        ) : previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100"
              >
                <RefreshCw size={12} /> Replace
              </button>
              <button
                onClick={onClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center h-32 bg-slate-50 hover:bg-amber-50/50 transition-colors group"
          >
            <div className="p-2.5 rounded-xl bg-slate-200 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-600 transition-all mb-2">
              <Upload size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {label || "Upload image"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Click or drag & drop
            </p>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

// ─── Inline CRUD row (used by Services, Cleaning, etc.) ───────────────────────
function CrudRow({ children, onEdit, onDelete, onToggleActive, isActive }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-amber-200 transition-colors group">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleActive && (
          <button
            onClick={onToggleActive}
            className={`p-1.5 rounded-lg transition-colors ${isActive ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-200"}`}
            title={isActive ? "Active" : "Hidden"}
          >
            {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Edit3 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Star rating display ──────────────────────────────────────────────────────
function StarRating({ value = 5, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange?.(n)}>
          <Star
            size={16}
            className={
              n <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ─── Confirm delete dialog ────────────────────────────────────────────────────
function useConfirmDelete() {
  const [pending, setPending] = useState(null); // { label, onConfirm }
  const ask = useCallback(
    (label, onConfirm) => setPending({ label, onConfirm }),
    [],
  );
  const Modal = pending ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-100">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Delete?</p>
            <p className="text-xs text-slate-500 mt-0.5">{pending.label}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              pending.onConfirm();
              setPending(null);
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setPending(null)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return { ask, Modal };
}

// ─── useSave hook — wraps any async save call with status ─────────────────────
function useSave(saveFn) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type, message }

  const save = useCallback(
    async (...args) => {
      setSaving(true);
      setStatus({ type: "saving" });
      try {
        await saveFn(...args);
        setStatus({ type: "success", message: "Saved!" });
        setTimeout(() => setStatus(null), 3000);
      } catch (err) {
        setStatus({ type: "error", message: err.message || "Save failed" });
      } finally {
        setSaving(false);
      }
    },
    [saveFn],
  );

  return { save, saving, status };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION PANELS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. Hero ─────────────────────────────────────────────────────────────────
function HeroPanel({ data, onSaved }) {
  const [draft, setDraft] = useState({
    title: data?.title || "",
    highlighted_word: data?.highlighted_word || "",
    cta_text: data?.cta_text || "",
    bg_image: data?.bg_image || null,
    overlay_image: data?.overlay_image || null,
  });

  const { save, saving, status } = useSave(
    useCallback(async () => {
      await apiFetch(`${API}/hero`, {
        method: "PUT",
        body: JSON.stringify({
          title: draft.title,
          highlighted_word: draft.highlighted_word,
          cta_text: draft.cta_text,
          bg_image_id: draft.bg_image?.id ?? null,
          overlay_image_id: draft.overlay_image?.id ?? null,
        }),
      });
      onSaved?.();
    }, [draft, onSaved]),
  );

  return (
    <SectionCard
      title="Hero Section"
      subtitle="Main banner — title, CTA and background images"
      onSave={save}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminInput
            label="Title (use \\n for line breaks)"
            value={draft.title}
            onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
            placeholder="Professional Property Management"
          />
          <AdminInput
            label="Highlighted Word"
            value={draft.highlighted_word}
            onChange={(e) =>
              setDraft((p) => ({ ...p, highlighted_word: e.target.value }))
            }
            placeholder="Professional"
          />
        </div>
        <AdminInput
          label="CTA Button Text"
          value={draft.cta_text}
          onChange={(e) =>
            setDraft((p) => ({ ...p, cta_text: e.target.value }))
          }
          placeholder="Get Started"
          className="sm:w-1/2"
        />
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <ImageSlot
            label="Background Image"
            value={draft.bg_image}
            section="hero"
            onUpload={(m) => setDraft((p) => ({ ...p, bg_image: m }))}
            onClear={() => setDraft((p) => ({ ...p, bg_image: null }))}
          />
          <ImageSlot
            label="Overlay Image"
            value={draft.overlay_image}
            section="hero"
            onUpload={(m) => setDraft((p) => ({ ...p, overlay_image: m }))}
            onClear={() => setDraft((p) => ({ ...p, overlay_image: null }))}
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 2. Header ───────────────────────────────────────────────────────────────
function HeaderPanel({ data, onSaved }) {
  const [draft, setDraft] = useState({
    phone: data?.phone || "",
    email: data?.email || "",
    logo: data?.logo || null,
  });

  const { save, saving, status } = useSave(
    useCallback(async () => {
      await apiFetch(`${API}/header`, {
        method: "PUT",
        body: JSON.stringify({
          phone: draft.phone,
          email: draft.email,
          logo_id: draft.logo?.id ?? null,
        }),
      });
      onSaved?.();
    }, [draft, onSaved]),
  );

  return (
    <SectionCard
      title="Header / Brand"
      subtitle="Contact info shown in the site header and logo"
      onSave={save}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminInput
            label="Phone"
            value={draft.phone}
            type="tel"
            onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
          />
          <AdminInput
            label="Email"
            value={draft.email}
            type="email"
            onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
            placeholder="info@evernorth.ca"
          />
        </div>
        <div className="sm:w-1/3">
          <ImageSlot
            label="Logo"
            value={draft.logo}
            section="header"
            onUpload={(m) => setDraft((p) => ({ ...p, logo: m }))}
            onClear={() => setDraft((p) => ({ ...p, logo: null }))}
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 3. About ─────────────────────────────────────────────────────────────────
function AboutPanel({ data, onSaved }) {
  const [draft, setDraft] = useState({
    about_image: data?.about_image || null,
    mission_badge: data?.mission_badge || "",
    mission_text_1: data?.mission_text_1 || "",
    mission_text_2: data?.mission_text_2 || "",
    about_badge: data?.about_badge || "",
    about_text_1: data?.about_text_1 || "",
    about_text_2: data?.about_text_2 || "",
    about_text_3: data?.about_text_3 || "",
    services_label: data?.services_label || "",
  });

  const { save, saving, status } = useSave(
    useCallback(async () => {
      await apiFetch(`${API}/about`, {
        method: "PUT",
        body: JSON.stringify({
          about_image_id: draft.about_image?.id ?? null,
          mission_badge: draft.mission_badge,
          mission_text_1: draft.mission_text_1,
          mission_text_2: draft.mission_text_2,
          about_badge: draft.about_badge,
          about_text_1: draft.about_text_1,
          about_text_2: draft.about_text_2,
          about_text_3: draft.about_text_3,
          services_label: draft.services_label,
        }),
      });
      onSaved?.();
    }, [draft, onSaved]),
  );

  const F = (key) => ({
    value: draft[key],
    onChange: (e) => setDraft((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <SectionCard
      title="About Section"
      subtitle="Mission card, about card and left image column"
      onSave={save}
      saving={saving}
      status={status}
    >
      <div className="space-y-6">
        {/* Image */}
        <div className="sm:w-1/3">
          <ImageSlot
            label="About Column Image"
            value={draft.about_image}
            section="about"
            onUpload={(m) => setDraft((p) => ({ ...p, about_image: m }))}
            onClear={() => setDraft((p) => ({ ...p, about_image: null }))}
          />
        </div>

        {/* Mission card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mission Card
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <AdminInput
              label="Badge Label"
              {...F("mission_badge")}
              placeholder="Our Mission"
            />
            <AdminInput
              label="Services Label"
              {...F("services_label")}
              placeholder="Our Services"
            />
          </div>
          <AdminTextarea
            label="Mission Text 1"
            rows={3}
            {...F("mission_text_1")}
          />
          <AdminTextarea
            label="Mission Text 2"
            rows={3}
            {...F("mission_text_2")}
          />
        </div>

        {/* About card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            About Card
          </p>
          <AdminInput
            label="Badge Label"
            {...F("about_badge")}
            placeholder="About Us"
          />
          <AdminTextarea label="Main Text" rows={3} {...F("about_text_1")} />
          <AdminTextarea
            label="Bullet Text 1"
            rows={2}
            {...F("about_text_2")}
          />
          <AdminTextarea
            label="Bullet Text 2"
            rows={2}
            {...F("about_text_3")}
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 4. Services ──────────────────────────────────────────────────────────────
function ServicesPanel({ data: initialData, onSaved }) {
  const [items, setItems] = useState(initialData || []);
  const [editing, setEditing] = useState(null); // { item } or { item: {} } for new
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirmDelete();

  const EMPTY = {
    title: "",
    description: "",
    image: null,
    style: "full-text",
    sort_order: 0,
  };

  const openEdit = (item) => {
    setEditing({ item: { ...item } });
    setFormErr("");
  };
  const openNew = () => {
    setEditing({ item: { ...EMPTY, sort_order: items.length } });
    setFormErr("");
  };
  const closeEdit = () => setEditing(null);

  const saveItem = async () => {
    if (!editing?.item?.title?.trim()) {
      setFormErr("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: editing.item.title,
        description: editing.item.description,
        style: editing.item.style || "full-text",
        sort_order: editing.item.sort_order ?? 0,
        image_id: editing.item.image?.id ?? null,
      };
      if (editing.item.id) {
        // Update
        const res = await apiFetch(`${API}/services/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((prev) =>
          prev.map((s) => (s.id === editing.item.id ? res.data : s)),
        );
      } else {
        // Create
        const res = await apiFetch(`${API}/services`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setItems((prev) => [...prev, res.data]);
      }
      closeEdit();
      onSaved?.();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (id) =>
    ask("This service will be permanently deleted.", async () => {
      await apiFetch(`${API}/services/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((s) => s.id !== id));
      onSaved?.();
    });

  const toggleActive = async (item) => {
    const res = await apiFetch(`${API}/services/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((prev) => prev.map((s) => (s.id === item.id ? res.data : s)));
  };

  return (
    <>
      {Modal}
      <SectionCard
        title="Services"
        subtitle="Manage service cards shown on the homepage"
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <GoldBtn onClick={openNew}>
              <Plus size={14} /> Add Service
            </GoldBtn>
          </div>

          {/* Edit / Create form */}
          {editing && (
            <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
              <p className="text-xs font-bold text-amber-700">
                {editing.item.id ? "Edit Service" : "New Service"}
              </p>
              {formErr && (
                <p className="text-xs text-red-600 font-medium">{formErr}</p>
              )}
              <AdminInput
                label="Title *"
                value={editing.item.title}
                onChange={(e) =>
                  setEditing((p) => ({
                    item: { ...p.item, title: e.target.value },
                  }))
                }
              />
              <AdminTextarea
                label="Description"
                rows={3}
                value={editing.item.description}
                onChange={(e) =>
                  setEditing((p) => ({
                    item: { ...p.item, description: e.target.value },
                  }))
                }
              />
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Card Style</FieldLabel>
                  <select
                    value={editing.item.style}
                    onChange={(e) =>
                      setEditing((p) => ({
                        item: { ...p.item, style: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value="full-text">
                      Full (title + description)
                    </option>
                    <option value="title-only">Title only</option>
                  </select>
                </div>
                <AdminInput
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
              <ImageSlot
                label="Card Background Image"
                value={editing.item.image}
                section="services"
                onUpload={(m) =>
                  setEditing((p) => ({ item: { ...p.item, image: m } }))
                }
                onClear={() =>
                  setEditing((p) => ({ item: { ...p.item, image: null } }))
                }
              />
              <div className="flex gap-2 pt-1">
                <GoldBtn onClick={saveItem} disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner size={14} /> Saving…
                    </>
                  ) : (
                    <>
                      <Check size={14} />{" "}
                      {editing.item.id ? "Update" : "Create"}
                    </>
                  )}
                </GoldBtn>
                <DarkBtn onClick={closeEdit}>
                  <X size={14} /> Cancel
                </DarkBtn>
              </div>
            </div>
          )}

          {/* List */}
          {items.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              No services yet. Add one above.
            </p>
          )}
          {items.map((item) => (
            <CrudRow
              key={item.id}
              isActive={!!item.is_active}
              onToggleActive={() => toggleActive(item)}
              onEdit={() => openEdit(item)}
              onDelete={() => deleteItem(item.id)}
            >
              <div className="flex items-center gap-3">
                {item.image?.url && (
                  <img
                    src={item.image.url}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    alt=""
                  />
                )}
                {!item.image?.url && (
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                    <ImageIcon size={14} className="text-slate-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {item.description || "No description"}
                  </p>
                </div>
              </div>
            </CrudRow>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

// ─── 5. Cleaning Services ─────────────────────────────────────────────────────
function CleaningPanel({ data: initialData, onSaved }) {
  const [meta, setMeta] = useState(
    initialData?.meta || { title: "", description: "" },
  );
  const [items, setItems] = useState(initialData?.items || []);
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaStatus, setMetaStatus] = useState(null);
  const [itemSaving, setItemSaving] = useState(false);
  const { ask, Modal } = useConfirmDelete();

  const saveMeta = async () => {
    setMetaSaving(true);
    setMetaStatus({ type: "saving" });
    try {
      await apiFetch(`${API}/cleaning/meta`, {
        method: "PUT",
        body: JSON.stringify({
          title: meta.title,
          description: meta.description,
        }),
      });
      setMetaStatus({ type: "success", message: "Saved!" });
      setTimeout(() => setMetaStatus(null), 3000);
      onSaved?.();
    } catch (err) {
      setMetaStatus({ type: "error", message: err.message });
    } finally {
      setMetaSaving(false);
    }
  };

  const saveItem = async () => {
    if (!editing?.item?.label?.trim()) {
      setFormErr("Label is required.");
      return;
    }
    setItemSaving(true);
    try {
      const payload = {
        label: editing.item.label,
        image_id: editing.item.image?.id ?? null,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const res = await apiFetch(`${API}/cleaning/items/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((prev) =>
          prev.map((s) => (s.id === editing.item.id ? res.data : s)),
        );
      } else {
        const res = await apiFetch(`${API}/cleaning/items`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setItems((prev) => [...prev, res.data]);
      }
      setEditing(null);
      onSaved?.();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setItemSaving(false);
    }
  };

  const deleteItem = (id) =>
    ask("This cleaning service item will be deleted.", async () => {
      await apiFetch(`${API}/cleaning/items/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((s) => s.id !== id));
      onSaved?.();
    });

  const toggleActive = async (item) => {
    const res = await apiFetch(`${API}/cleaning/items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((prev) => prev.map((s) => (s.id === item.id ? res.data : s)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-4">
        {/* Meta */}
        <SectionCard
          title="Cleaning Section — Header"
          subtitle="Section title and description"
          onSave={saveMeta}
          saving={metaSaving}
          status={metaStatus}
        >
          <div className="space-y-3">
            <AdminInput
              label="Section Title"
              value={meta.title}
              onChange={(e) =>
                setMeta((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Property Management & Maintenance"
            />
            <AdminTextarea
              label="Description"
              rows={3}
              value={meta.description}
              onChange={(e) =>
                setMeta((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
        </SectionCard>

        {/* Items */}
        <SectionCard
          title="Cleaning Service Items"
          subtitle="Circle image cards displayed in this section"
        >
          <div className="space-y-3">
            <div className="flex justify-end">
              <GoldBtn
                onClick={() => {
                  setEditing({
                    item: { label: "", image: null, sort_order: items.length },
                  });
                  setFormErr("");
                }}
              >
                <Plus size={14} /> Add Item
              </GoldBtn>
            </div>
            {editing && (
              <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
                <p className="text-xs font-bold text-amber-700">
                  {editing.item.id ? "Edit Item" : "New Item"}
                </p>
                {formErr && <p className="text-xs text-red-600">{formErr}</p>}
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="Label *"
                    value={editing.item.label}
                    onChange={(e) =>
                      setEditing((p) => ({
                        item: { ...p.item, label: e.target.value },
                      }))
                    }
                  />
                  <AdminInput
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
                <ImageSlot
                  label="Circle Image"
                  value={editing.item.image}
                  section="cleaning"
                  onUpload={(m) =>
                    setEditing((p) => ({ item: { ...p.item, image: m } }))
                  }
                  onClear={() =>
                    setEditing((p) => ({ item: { ...p.item, image: null } }))
                  }
                />
                <div className="flex gap-2">
                  <GoldBtn onClick={saveItem} disabled={itemSaving}>
                    {itemSaving ? (
                      <>
                        <Spinner size={14} /> Saving…
                      </>
                    ) : (
                      <>
                        <Check size={14} />{" "}
                        {editing.item.id ? "Update" : "Create"}
                      </>
                    )}
                  </GoldBtn>
                  <DarkBtn onClick={() => setEditing(null)}>
                    <X size={14} /> Cancel
                  </DarkBtn>
                </div>
              </div>
            )}
            {items.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                No items yet.
              </p>
            )}
            {items.map((item) => (
              <CrudRow
                key={item.id}
                isActive={!!item.is_active}
                onToggleActive={() => toggleActive(item)}
                onEdit={() => {
                  setEditing({ item: { ...item } });
                  setFormErr("");
                }}
                onDelete={() => deleteItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  {item.image?.url ? (
                    <img
                      src={item.image.url}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      alt=""
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <ImageIcon size={12} className="text-slate-400" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-slate-800">
                    {item.label}
                  </p>
                </div>
              </CrudRow>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

// ─── 6. Maintenance ───────────────────────────────────────────────────────────
function MaintenancePanel({ data: initialData, onSaved }) {
  const [meta, setMeta] = useState(
    initialData?.meta || { heading: "", cta_label: "" },
  );
  const [items, setItems] = useState(initialData?.items || []);
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaStatus, setMetaStatus] = useState(null);
  const [itemSaving, setItemSaving] = useState(false);
  const { ask, Modal } = useConfirmDelete();

  const saveMeta = async () => {
    setMetaSaving(true);
    setMetaStatus({ type: "saving" });
    try {
      await apiFetch(`${API}/maintenance/meta`, {
        method: "PUT",
        body: JSON.stringify({
          heading: meta.heading,
          cta_label: meta.cta_label,
        }),
      });
      setMetaStatus({ type: "success", message: "Saved!" });
      setTimeout(() => setMetaStatus(null), 3000);
      onSaved?.();
    } catch (err) {
      setMetaStatus({ type: "error", message: err.message });
    } finally {
      setMetaSaving(false);
    }
  };

  const saveItem = async () => {
    if (!editing?.item?.title?.trim()) {
      setFormErr("Title is required.");
      return;
    }
    setItemSaving(true);
    try {
      const payload = {
        title: editing.item.title,
        description: editing.item.description,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const res = await apiFetch(
          `${API}/maintenance/items/${editing.item.id}`,
          { method: "PUT", body: JSON.stringify(payload) },
        );
        setItems((prev) =>
          prev.map((s) => (s.id === editing.item.id ? res.data : s)),
        );
      } else {
        const res = await apiFetch(`${API}/maintenance/items`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setItems((prev) => [...prev, res.data]);
      }
      setEditing(null);
      onSaved?.();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setItemSaving(false);
    }
  };

  const deleteItem = (id) =>
    ask("Delete this maintenance item?", async () => {
      await apiFetch(`${API}/maintenance/items/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((s) => s.id !== id));
    });

  const toggleActive = async (item) => {
    const res = await apiFetch(`${API}/maintenance/items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((prev) => prev.map((s) => (s.id === item.id ? res.data : s)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-4">
        <SectionCard
          title="Maintenance Section — Header"
          onSave={saveMeta}
          saving={metaSaving}
          status={metaStatus}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput
              label="Heading"
              value={meta.heading}
              onChange={(e) =>
                setMeta((p) => ({ ...p, heading: e.target.value }))
              }
            />
            <AdminInput
              label="CTA Label"
              value={meta.cta_label}
              onChange={(e) =>
                setMeta((p) => ({ ...p, cta_label: e.target.value }))
              }
            />
          </div>
        </SectionCard>
        <SectionCard title="Maintenance Items">
          <div className="space-y-3">
            <div className="flex justify-end">
              <GoldBtn
                onClick={() => {
                  setEditing({
                    item: {
                      title: "",
                      description: "",
                      sort_order: items.length,
                    },
                  });
                  setFormErr("");
                }}
              >
                <Plus size={14} /> Add Item
              </GoldBtn>
            </div>
            {editing && (
              <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
                {formErr && <p className="text-xs text-red-600">{formErr}</p>}
                <AdminInput
                  label="Title *"
                  value={editing.item.title}
                  onChange={(e) =>
                    setEditing((p) => ({
                      item: { ...p.item, title: e.target.value },
                    }))
                  }
                />
                <AdminTextarea
                  label="Description"
                  rows={3}
                  value={editing.item.description}
                  onChange={(e) =>
                    setEditing((p) => ({
                      item: { ...p.item, description: e.target.value },
                    }))
                  }
                />
                <AdminInput
                  label="Sort Order"
                  type="number"
                  value={editing.item.sort_order}
                  onChange={(e) =>
                    setEditing((p) => ({
                      item: { ...p.item, sort_order: Number(e.target.value) },
                    }))
                  }
                />
                <div className="flex gap-2">
                  <GoldBtn onClick={saveItem} disabled={itemSaving}>
                    {itemSaving ? (
                      <>
                        <Spinner size={14} /> Saving…
                      </>
                    ) : (
                      <>
                        <Check size={14} />{" "}
                        {editing.item.id ? "Update" : "Create"}
                      </>
                    )}
                  </GoldBtn>
                  <DarkBtn onClick={() => setEditing(null)}>
                    <X size={14} /> Cancel
                  </DarkBtn>
                </div>
              </div>
            )}
            {items.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                No maintenance items yet.
              </p>
            )}
            {items.map((item) => (
              <CrudRow
                key={item.id}
                isActive={!!item.is_active}
                onToggleActive={() => toggleActive(item)}
                onEdit={() => {
                  setEditing({ item: { ...item } });
                  setFormErr("");
                }}
                onDelete={() => deleteItem(item.id)}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-400 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </CrudRow>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

// ─── 7. Areas ─────────────────────────────────────────────────────────────────
function AreasPanel({ data: initialData, onSaved }) {
  const [meta, setMeta] = useState(
    initialData?.meta || { title: "", subtitle: "" },
  );
  const [areas, setAreas] = useState(initialData?.areas || []);
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaStatus, setMetaStatus] = useState(null);
  const [areaSaving, setAreaSaving] = useState(false);
  const { ask, Modal } = useConfirmDelete();

  const saveMeta = async () => {
    setMetaSaving(true);
    setMetaStatus({ type: "saving" });
    try {
      await apiFetch(`${API}/areas/meta`, {
        method: "PUT",
        body: JSON.stringify({ title: meta.title, subtitle: meta.subtitle }),
      });
      setMetaStatus({ type: "success", message: "Saved!" });
      setTimeout(() => setMetaStatus(null), 3000);
      onSaved?.();
    } catch (err) {
      setMetaStatus({ type: "error", message: err.message });
    } finally {
      setMetaSaving(false);
    }
  };

  const saveArea = async () => {
    if (!editing?.item?.name?.trim()) {
      setFormErr("Name is required.");
      return;
    }
    setAreaSaving(true);
    try {
      const payload = {
        name: editing.item.name,
        image_id: editing.item.image?.id ?? null,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const res = await apiFetch(`${API}/areas/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setAreas((prev) =>
          prev.map((a) => (a.id === editing.item.id ? res.data : a)),
        );
      } else {
        const res = await apiFetch(`${API}/areas`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAreas((prev) => [...prev, res.data]);
      }
      setEditing(null);
      onSaved?.();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setAreaSaving(false);
    }
  };

  const deleteArea = (id) =>
    ask("Delete this area?", async () => {
      await apiFetch(`${API}/areas/${id}`, { method: "DELETE" });
      setAreas((prev) => prev.filter((a) => a.id !== id));
    });

  const toggleActive = async (area) => {
    const res = await apiFetch(`${API}/areas/${area.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: area.is_active ? 0 : 1 }),
    });
    setAreas((prev) => prev.map((a) => (a.id === area.id ? res.data : a)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-4">
        <SectionCard
          title="Areas Section — Header"
          onSave={saveMeta}
          saving={metaSaving}
          status={metaStatus}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminInput
              label="Section Title"
              value={meta.title}
              onChange={(e) =>
                setMeta((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Areas We Cover"
            />
            <AdminTextarea
              label="Subtitle"
              rows={2}
              value={meta.subtitle}
              onChange={(e) =>
                setMeta((p) => ({ ...p, subtitle: e.target.value }))
              }
            />
          </div>
        </SectionCard>
        <SectionCard title="Area Cards">
          <div className="space-y-3">
            <div className="flex justify-end">
              <GoldBtn
                onClick={() => {
                  setEditing({
                    item: { name: "", image: null, sort_order: areas.length },
                  });
                  setFormErr("");
                }}
              >
                <Plus size={14} /> Add Area
              </GoldBtn>
            </div>
            {editing && (
              <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
                {formErr && <p className="text-xs text-red-600">{formErr}</p>}
                <div className="grid sm:grid-cols-2 gap-3">
                  <AdminInput
                    label="Area Name *"
                    value={editing.item.name}
                    onChange={(e) =>
                      setEditing((p) => ({
                        item: { ...p.item, name: e.target.value },
                      }))
                    }
                  />
                  <AdminInput
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
                <ImageSlot
                  label="Area Photo"
                  value={editing.item.image}
                  section="areas"
                  onUpload={(m) =>
                    setEditing((p) => ({ item: { ...p.item, image: m } }))
                  }
                  onClear={() =>
                    setEditing((p) => ({ item: { ...p.item, image: null } }))
                  }
                />
                <div className="flex gap-2">
                  <GoldBtn onClick={saveArea} disabled={areaSaving}>
                    {areaSaving ? (
                      <>
                        <Spinner size={14} /> Saving…
                      </>
                    ) : (
                      <>
                        <Check size={14} />{" "}
                        {editing.item.id ? "Update" : "Create"}
                      </>
                    )}
                  </GoldBtn>
                  <DarkBtn onClick={() => setEditing(null)}>
                    <X size={14} /> Cancel
                  </DarkBtn>
                </div>
              </div>
            )}
            {areas.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">
                No areas added yet.
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              {areas.map((area) => (
                <CrudRow
                  key={area.id}
                  isActive={!!area.is_active}
                  onToggleActive={() => toggleActive(area)}
                  onEdit={() => {
                    setEditing({ item: { ...area } });
                    setFormErr("");
                  }}
                  onDelete={() => deleteArea(area.id)}
                >
                  <div className="flex items-center gap-3">
                    {area.image?.url ? (
                      <img
                        src={area.image.url}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        alt=""
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                        <ImageIcon size={14} className="text-slate-400" />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-slate-800">
                      {area.name}
                    </p>
                  </div>
                </CrudRow>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

// ─── 8. Testimonials ──────────────────────────────────────────────────────────
function TestimonialsPanel({ data: initialData, onSaved }) {
  const [items, setItems] = useState(initialData || []);
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirmDelete();

  const EMPTY = { customer_name: "", quote: "", rating: 5, sort_order: 0 };

  const saveItem = async () => {
    if (
      !editing?.item?.customer_name?.trim() ||
      !editing?.item?.quote?.trim()
    ) {
      setFormErr("Name and quote are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        customer_name: editing.item.customer_name,
        quote: editing.item.quote,
        rating: editing.item.rating,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const res = await apiFetch(`${API}/testimonials/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((prev) =>
          prev.map((t) => (t.id === editing.item.id ? res.data : t)),
        );
      } else {
        const res = await apiFetch(`${API}/testimonials`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setItems((prev) => [...prev, res.data]);
      }
      setEditing(null);
      onSaved?.();
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (id) =>
    ask("Delete this testimonial?", async () => {
      await apiFetch(`${API}/testimonials/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((t) => t.id !== id));
    });

  const toggleActive = async (item) => {
    const res = await apiFetch(`${API}/testimonials/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((prev) => prev.map((t) => (t.id === item.id ? res.data : t)));
  };

  return (
    <>
      {Modal}
      <SectionCard
        title="Testimonials"
        subtitle="Customer reviews shown in the testimonial carousel"
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <GoldBtn
              onClick={() => {
                setEditing({ item: { ...EMPTY, sort_order: items.length } });
                setFormErr("");
              }}
            >
              <Plus size={14} /> Add Testimonial
            </GoldBtn>
          </div>
          {editing && (
            <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
              <p className="text-xs font-bold text-amber-700">
                {editing.item.id ? "Edit Testimonial" : "New Testimonial"}
              </p>
              {formErr && <p className="text-xs text-red-600">{formErr}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                <AdminInput
                  label="Customer Name *"
                  value={editing.item.customer_name}
                  onChange={(e) =>
                    setEditing((p) => ({
                      item: { ...p.item, customer_name: e.target.value },
                    }))
                  }
                />
                <div>
                  <FieldLabel>Rating</FieldLabel>
                  <StarRating
                    value={editing.item.rating}
                    onChange={(n) =>
                      setEditing((p) => ({ item: { ...p.item, rating: n } }))
                    }
                  />
                </div>
              </div>
              <AdminTextarea
                label="Quote *"
                rows={4}
                value={editing.item.quote}
                onChange={(e) =>
                  setEditing((p) => ({
                    item: { ...p.item, quote: e.target.value },
                  }))
                }
              />
              <AdminInput
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
              <div className="flex gap-2">
                <GoldBtn onClick={saveItem} disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner size={14} /> Saving…
                    </>
                  ) : (
                    <>
                      <Check size={14} />{" "}
                      {editing.item.id ? "Update" : "Create"}
                    </>
                  )}
                </GoldBtn>
                <DarkBtn onClick={() => setEditing(null)}>
                  <X size={14} /> Cancel
                </DarkBtn>
              </div>
            </div>
          )}
          {items.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              No testimonials yet.
            </p>
          )}
          {items.map((item) => (
            <CrudRow
              key={item.id}
              isActive={!!item.is_active}
              onToggleActive={() => toggleActive(item)}
              onEdit={() => {
                setEditing({ item: { ...item } });
                setFormErr("");
              }}
              onDelete={() => deleteItem(item.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.customer_name}
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(item.rating ?? 5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 italic">
                  "{item.quote}"
                </p>
              </div>
            </CrudRow>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

// ─── 9. Footer ────────────────────────────────────────────────────────────────
function FooterPanel({ data, onSaved }) {
  const [draft, setDraft] = useState({
    description: data?.description || "",
    email: data?.email || "",
    phone: data?.phone || "",
    copyright_text: data?.copyright_text || "",
    logo: data?.logo || null,
    building_img: data?.building_img || null,
  });

  const { save, saving, status } = useSave(
    useCallback(async () => {
      await apiFetch(`${API}/footer`, {
        method: "PUT",
        body: JSON.stringify({
          description: draft.description,
          email: draft.email,
          phone: draft.phone,
          copyright_text: draft.copyright_text,
          logo_id: draft.logo?.id ?? null,
          building_img_id: draft.building_img?.id ?? null,
        }),
      });
      onSaved?.();
    }, [draft, onSaved]),
  );

  const F = (key) => ({
    value: draft[key],
    onChange: (e) => setDraft((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <SectionCard
      title="Footer"
      subtitle="Footer contact info, description, logo and building image"
      onSave={save}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <AdminTextarea label="Description" rows={3} {...F("description")} />
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminInput label="Email" type="email" {...F("email")} />
          <AdminInput label="Phone" type="tel" {...F("phone")} />
        </div>
        <AdminInput
          label="Copyright Text"
          {...F("copyright_text")}
          placeholder="© 2025 Ever North. All rights reserved."
        />
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <ImageSlot
            label="Footer Logo"
            value={draft.logo}
            section="footer"
            onUpload={(m) => setDraft((p) => ({ ...p, logo: m }))}
            onClear={() => setDraft((p) => ({ ...p, logo: null }))}
          />
          <ImageSlot
            label="Building Image"
            value={draft.building_img}
            section="footer"
            onUpload={(m) => setDraft((p) => ({ ...p, building_img: m }))}
            onClear={() => setDraft((p) => ({ ...p, building_img: null }))}
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 10. Nav Links ────────────────────────────────────────────────────────────
function NavPanel({ data: initialData, onSaved }) {
  const [links, setLinks] = useState(initialData || []);
  const [saving, setSaving] = useState(null); // id of item being saved
  const [statuses, setStatuses] = useState({});

  const saveLink = async (link) => {
    setSaving(link.id);
    setStatuses((p) => ({ ...p, [link.id]: { type: "saving" } }));
    try {
      await apiFetch(`${API}/nav/${link.id}`, {
        method: "PUT",
        body: JSON.stringify({
          label: link.label,
          href: link.href,
          sort_order: link.sort_order,
          is_active: link.is_active,
        }),
      });
      setStatuses((p) => ({
        ...p,
        [link.id]: { type: "success", message: "Saved!" },
      }));
      setTimeout(() => setStatuses((p) => ({ ...p, [link.id]: null })), 2500);
      onSaved?.();
    } catch (err) {
      setStatuses((p) => ({
        ...p,
        [link.id]: { type: "error", message: err.message },
      }));
    } finally {
      setSaving(null);
    }
  };

  const update = (id, field, value) =>
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );

  return (
    <SectionCard
      title="Navigation Links"
      subtitle="Edit labels, URLs and visibility for each nav item"
    >
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="grid sm:grid-cols-3 gap-3 flex-1">
                <AdminInput
                  label="Label"
                  value={link.label}
                  onChange={(e) => update(link.id, "label", e.target.value)}
                />
                <AdminInput
                  label="URL / href"
                  value={link.href}
                  onChange={(e) => update(link.id, "href", e.target.value)}
                />
                <AdminInput
                  label="Sort Order"
                  type="number"
                  value={link.sort_order}
                  onChange={(e) =>
                    update(link.id, "sort_order", Number(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!link.is_active}
                  onChange={(e) =>
                    update(link.id, "is_active", e.target.checked ? 1 : 0)
                  }
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Visible in nav
                </span>
              </label>
              <div className="flex items-center gap-2">
                <StatusPill
                  status={statuses[link.id]?.type}
                  message={statuses[link.id]?.message}
                />
                <GoldBtn
                  onClick={() => saveLink(link)}
                  disabled={saving === link.id}
                >
                  {saving === link.id ? (
                    <>
                      <Spinner size={13} /> Saving…
                    </>
                  ) : (
                    <>
                      <Save size={13} /> Save
                    </>
                  )}
                </GoldBtn>
              </div>
            </div>
          </div>
        ))}
        {links.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">
            No nav links found.
          </p>
        )}
      </div>
    </SectionCard>
  );
}

// ─── 11. Contact Submissions Inbox ────────────────────────────────────────────
function ContactsPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all"); // all | unread
  const [expanded, setExpanded] = useState(null);
  const { ask, Modal } = useConfirmDelete();
  const LIMIT = 15;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(filter === "unread" ? { unread: "true" } : {}),
      });
      const res = await apiFetch(`${API}/contact?${params}`);
      setSubmissions(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markRead = async (id) => {
    await apiFetch(`${API}/contact/${id}/read`, { method: "PATCH" });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_read: 1 } : s)),
    );
  };

  const deleteSubmission = (id) =>
    ask("Delete this message?", async () => {
      await apiFetch(`${API}/contact/${id}`, { method: "DELETE" });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setTotal((t) => t - 1);
    });

  const totalPages = Math.ceil(total / LIMIT);
  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <>
      {Modal}
      <SectionCard
        title="Contact Inbox"
        subtitle={`${total} total submissions`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-2">
            {["all", "unread"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${filter === f ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {f}{" "}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner size={24} />
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm py-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {!loading && submissions.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-12">
            {filter === "unread"
              ? "No unread messages."
              : "No submissions yet."}
          </p>
        )}

        <div className="space-y-2">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border transition-colors ${!s.is_read ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-white"}`}
            >
              {/* Row header */}
              <button
                className="w-full flex items-start gap-3 p-4 text-left"
                onClick={() => {
                  setExpanded(expanded === s.id ? null : s.id);
                  if (!s.is_read) markRead(s.id);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!s.is_read && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-slate-800">
                      {s.name}
                    </span>
                    <span className="text-xs text-slate-400">{s.email}</span>
                    {s.subject && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {s.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(s.created_at).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {s.phone && ` · ${s.phone}`}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 shrink-0 mt-0.5 transition-transform ${expanded === s.id ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expanded message */}
              {expanded === s.id && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {s.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${s.email}?subject=Re: ${s.subject || "Your enquiry"}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-700 hover:bg-slate-800 transition-colors"
                    >
                      <Mail size={12} /> Reply
                    </a>
                    {s.phone && (
                      <a
                        href={`tel:${s.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <Phone size={12} /> Call
                      </a>
                    )}
                    <DangerBtn onClick={() => deleteSubmission(s.id)}>
                      <Trash2 size={12} /> Delete
                    </DangerBtn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CONTENT EDITOR
// ═══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id: "hero", label: "Hero", icon: Globe },
  { id: "header", label: "Header", icon: Globe },
  { id: "nav", label: "Nav Links", icon: Globe },
  { id: "footer", label: "Footer", icon: Globe },
  { id: "about", label: "About", icon: Globe },
  { id: "services", label: "Services", icon: Globe },
  { id: "cleaning", label: "Cleaning", icon: Globe },
  { id: "maintenance", label: "Maintenance", icon: Globe },
  { id: "areas", label: "Areas", icon: Globe },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "contacts", label: "Inbox", icon: MessageSquare },
];

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState("hero");
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`${API}/site`);
      setSiteData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Skeleton loader
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-full" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="p-4 rounded-2xl bg-red-50">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">
            Failed to load site content
          </p>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <GoldBtn onClick={fetchAll}>Retry</GoldBtn>
      </div>
    );
  }

  // Panel router
  const renderPanel = () => {
    switch (activeTab) {
      case "hero":
        return <HeroPanel data={siteData?.hero} onSaved={fetchAll} />;
      case "header":
        return <HeaderPanel data={siteData?.header} onSaved={fetchAll} />;
      case "nav":
        return (
          <NavPanel data={siteData?.header?.nav_links} onSaved={fetchAll} />
        );
      case "footer":
        return <FooterPanel data={siteData?.footer} onSaved={fetchAll} />;
      case "about":
        return <AboutPanel data={siteData?.about} onSaved={fetchAll} />;
      case "services":
        return <ServicesPanel data={siteData?.services} onSaved={fetchAll} />;
      case "cleaning":
        return <CleaningPanel data={siteData?.cleaning} onSaved={fetchAll} />;
      case "maintenance":
        return (
          <MaintenancePanel data={siteData?.maintenance} onSaved={fetchAll} />
        );
      case "areas":
        return <AreasPanel data={siteData?.areas} onSaved={fetchAll} />;
      case "testimonials":
        return (
          <TestimonialsPanel data={siteData?.testimonials} onSaved={fetchAll} />
        );
      case "contacts":
        return <ContactsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Tab strip */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div key={activeTab}>{renderPanel()}</div>
    </div>
  );
}
