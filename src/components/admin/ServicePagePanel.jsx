// ServicePagePanel.jsx
// Admin panel for Long-Term PM, Short-Term PM, and Hybrid PM pages.
// Each page has tabs: Hero | Introduction | Service Cards | Why Choose Us
// Pages load lazily on first visit and are cached in state.

import { useState, useCallback, useRef } from "react";
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
  Building2,
  Clock,
  GitMerge,
} from "lucide-react";
import { getStoredToken } from "../../services/authApi";
import { BaseUrl } from "../Config/BaseUrl";

const API_ROOT = `${BaseUrl}service-pages`;
const MEDIA_API = `${BaseUrl}media`;
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Page + Section config ────────────────────────────────────────────────────
const PAGES = [
  { key: "long_term", label: "Long-Term PM", icon: Building2 },
  { key: "short_term", label: "Short-Term PM", icon: Clock },
  { key: "hybrid", label: "Hybrid PM", icon: GitMerge },
];

const SECTION_TABS = [
  { key: "hero", label: "Hero" },
  { key: "intro", label: "Introduction" },
  { key: "services", label: "Service Cards" },
  { key: "why", label: "Why Choose Us" },
];

const ICON_COLORS = [
  { value: "gold", label: "Gold" },
  { value: "green", label: "Green" },
  { value: "purple", label: "Purple" },
  { value: "yellow", label: "Yellow" },
  { value: "red", label: "Red" },
  { value: "indigo", label: "Indigo" },
  { value: "blue", label: "Blue" },
  { value: "amber", label: "Amber" },
];

const COLOR_SWATCH = {
  gold: "#b7a170",
  green: "#16a34a",
  purple: "#9333ea",
  yellow: "#ca8a04",
  red: "#dc2626",
  indigo: "#4f46e5",
  blue: "#2563eb",
  amber: "#b7a170",
};

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
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50
      hover:border-amber-200 transition group"
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
  const res = await fetch(`${API_ROOT}${path}`, {
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
  section = "service-pages",
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const url = value?.url || (typeof value === "string" ? value : null);

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
          <div className="h-36 flex items-center justify-center bg-amber-50 gap-2">
            <Loader2 size={20} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-500">Uploading…</span>
          </div>
        ) : url ? (
          <div className="relative group">
            <img src={url} alt={label} className="w-full h-36 object-cover" />
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
            className="w-full h-36 flex flex-col items-center justify-center
              bg-slate-50 hover:bg-amber-50/50 transition-colors gap-1.5 group"
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

// ─── Icon color picker ────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  return (
    <div>
      <FL>Icon Color</FL>
      <div className="flex flex-wrap gap-2 mt-1">
        {ICON_COLORS.map(({ value: v, label }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            title={label}
            className={`w-7 h-7 rounded-full border-2 transition-all
              ${value === v ? "border-slate-800 scale-110" : "border-transparent hover:scale-105"}`}
            style={{ backgroundColor: COLOR_SWATCH[v] }}
          />
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-1 capitalize">
        Selected: {value || "gold"}
      </p>
    </div>
  );
}

// ─── Service Cards CRUD ───────────────────────────────────────────────────────
function CardsCrud({ pageKey, cards, setCards }) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const blank = {
    title: "",
    description: "",
    icon_color: "gold",
    sort_order: cards.length,
  };
  const openNew = () => {
    setEditing({ item: blank });
    setFormErr("");
  };
  const openEdit = (item) => {
    setEditing({ item: { ...item } });
    setFormErr("");
  };

  const save = async () => {
    if (!editing.item.title?.trim()) {
      setFormErr("Title is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: editing.item.title,
        description: editing.item.description,
        icon_color: editing.item.icon_color || "gold",
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const r = await apiFetch(`/${pageKey}/cards/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCards((p) => p.map((x) => (x.id === editing.item.id ? r.data : x)));
      } else {
        const r = await apiFetch(`/${pageKey}/cards`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCards((p) => [...p, r.data]);
      }
      setEditing(null);
    } catch (e) {
      setFormErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = (id) =>
    ask("This card will be permanently deleted.", async () => {
      await apiFetch(`/${pageKey}/cards/${id}`, { method: "DELETE" });
      setCards((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`/${pageKey}/cards/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setCards((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Feature Cards
          </p>
          <GB onClick={openNew} sm>
            <Plus size={12} /> Add Card
          </GB>
        </div>

        {editing && (
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-4">
            <p className="text-xs font-bold text-amber-700">
              {editing.item.id ? "Edit Card" : "New Card"}
            </p>
            {formErr && (
              <p className="text-xs text-red-600 font-medium">{formErr}</p>
            )}
            <AI
              label="Card Title *"
              value={editing.item.title}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, title: e.target.value },
                }))
              }
            />
            <AT
              label="Description"
              rows={3}
              value={editing.item.description}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, description: e.target.value },
                }))
              }
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <ColorPicker
                value={editing.item.icon_color}
                onChange={(v) =>
                  setEditing((p) => ({ item: { ...p.item, icon_color: v } }))
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

        {cards.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-xl">
            No cards yet — click "Add Card" to get started.
          </p>
        )}
        {cards.map((card) => (
          <CRow
            key={card.id}
            active={!!card.is_active}
            onToggle={() => toggle(card)}
            onEdit={() => openEdit(card)}
            onDelete={() => del(card.id)}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    COLOR_SWATCH[card.icon_color] || COLOR_SWATCH.gold,
                }}
              />
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold truncate max-w-[340px]
                  ${card.is_active ? "text-slate-800" : "text-slate-400 line-through"}`}
                >
                  {card.title}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-[340px]">
                  {card.description}
                </p>
              </div>
            </div>
          </CRow>
        ))}
      </div>
    </>
  );
}

// ─── Why items CRUD ───────────────────────────────────────────────────────────
function WhyCrud({ pageKey, items, setItems }) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const openNew = () => {
    setEditing({ item: { text: "", sort_order: items.length } });
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
        const r = await apiFetch(`/${pageKey}/why-items/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((p) => p.map((x) => (x.id === editing.item.id ? r.data : x)));
      } else {
        const r = await apiFetch(`/${pageKey}/why-items`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setItems((p) => [...p, r.data]);
      }
      setEditing(null);
    } catch (e) {
      setFormErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = (id) =>
    ask("This bullet point will be permanently deleted.", async () => {
      await apiFetch(`/${pageKey}/why-items/${id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`/${pageKey}/why-items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Bullet Points
          </p>
          <GB onClick={openNew} sm>
            <Plus size={12} /> Add Bullet
          </GB>
        </div>

        {editing && (
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
            <p className="text-xs font-bold text-amber-700">
              {editing.item.id ? "Edit Bullet" : "New Bullet"}
            </p>
            {formErr && (
              <p className="text-xs text-red-600 font-medium">{formErr}</p>
            )}
            <AI
              label="Bullet Text *"
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

        {items.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-xl">
            No bullet points yet — click "Add Bullet" to get started.
          </p>
        )}
        {items.map((item) => (
          <CRow
            key={item.id}
            active={!!item.is_active}
            onToggle={() => toggle(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => del(item.id)}
          >
            <p
              className={`text-sm ${item.is_active ? "text-slate-800" : "text-slate-400 line-through"}`}
            >
              • {item.text}
            </p>
          </CRow>
        ))}
      </div>
    </>
  );
}

// ─── Section tab panels ───────────────────────────────────────────────────────
function HeroTab({ M, Img, onSave, saving, status }) {
  return (
    <SCard
      title="Hero Section"
      subtitle="Background image, main headline and subtitle tagline"
      onSave={onSave}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <ImgSlot label="Hero Background Image" {...Img("hero_image")} />
        <div className="grid sm:grid-cols-2 gap-4">
          <AI label="Page Title" {...M("hero_title")} />
          <AI label="Subtitle Tagline" {...M("hero_subtitle")} />
        </div>
      </div>
    </SCard>
  );
}

function IntroTab({ M, Img, onSave, saving, status }) {
  return (
    <SCard
      title="Introduction Section"
      subtitle="Left-side image, icon card heading and the three body paragraphs"
      onSave={onSave}
      saving={saving}
      status={status}
    >
      <div className="space-y-4">
        <ImgSlot label="Left-side Image" {...Img("intro_image")} />
        <AI label="Card Heading (optional)" {...M("intro_heading")} />
        <AT label="Paragraph 1" rows={4} {...M("intro_para_1")} />
        <AT label="Paragraph 2" rows={3} {...M("intro_para_2")} />
        <AT label="Paragraph 3" rows={3} {...M("intro_para_3")} />
      </div>
    </SCard>
  );
}

function ServicesTab({ M, onSave, saving, status, pageKey, cards, setCards }) {
  return (
    <div className="space-y-5">
      <SCard
        title="Service Cards — Section Header"
        subtitle="Section title, description text and the subheading above the card grid"
        onSave={onSave}
        saving={saving}
        status={status}
      >
        <div className="space-y-4">
          <AI label="Section Title" {...M("services_title")} />
          <AT
            label="Subtitle / Intro text"
            rows={3}
            {...M("services_subtitle")}
          />
          <AT
            label="Description paragraph 1"
            rows={3}
            {...M("services_desc_1")}
          />
          <AT
            label="Description paragraph 2 (shown below the grid)"
            rows={2}
            {...M("services_desc_2")}
          />
          <AI
            label='Sub-heading (e.g. "We help property owners by:")'
            {...M("services_sub_heading")}
          />
        </div>
      </SCard>

      <SCard
        title="Feature Cards"
        subtitle="The 6-card grid shown in the services section — add, edit, colour and reorder"
      >
        <CardsCrud pageKey={pageKey} cards={cards} setCards={setCards} />
      </SCard>
    </div>
  );
}

function WhyTab({
  M,
  Img,
  onSave,
  saving,
  status,
  pageKey,
  whyItems,
  setWhyItems,
}) {
  return (
    <div className="space-y-5">
      <SCard
        title="Why Choose EverNorth — Content"
        subtitle="Section image, heading, description and the CTA banner"
        onSave={onSave}
        saving={saving}
        status={status}
      >
        <div className="space-y-4">
          <ImgSlot label="Section Image (left side)" {...Img("why_image")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <AI label="Section Title" {...M("why_title")} />
            <AI
              label='Bullets Sub-heading (e.g. "Why owners trust us:")'
              {...M("why_sub_heading")}
            />
          </div>
          <AT label="Description paragraph" rows={3} {...M("why_desc")} />

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              CTA Banner
            </p>
            <AT label="Banner Text" rows={2} {...M("cta_text")} />
            <div className="grid sm:grid-cols-2 gap-4 mt-3">
              <AI label="Button Label" {...M("cta_btn_text")} />
              <AI label="Button Link / Href" {...M("cta_btn_href")} />
            </div>
          </div>
        </div>
      </SCard>

      <SCard
        title="Why Choose — Bullet Points"
        subtitle="The gold-checkmark list shown alongside the section image"
      >
        <WhyCrud pageKey={pageKey} items={whyItems} setItems={setWhyItems} />
      </SCard>
    </div>
  );
}

// ─── Per-page editor (loads lazily) ──────────────────────────────────────────
function PageEditor({ pageKey }) {
  const [meta, setMeta] = useState(null);
  const [cards, setCards] = useState([]);
  const [whyItems, setWhyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);
  const [section, setSection] = useState("hero");

  const load = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const d = await apiFetch(`/${pageKey}`);
      setMeta(d.data.meta || {});
      setCards(d.data.cards || []);
      setWhyItems(d.data.why_items || []);
    } catch (e) {
      setFetchErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  // Load on mount
  useState(() => {
    load();
  }, []);
  // useEffect equivalent using a ref trick for lazy mount
  const loaded = useRef(false);
  if (!loaded.current) {
    loaded.current = true;
    load();
  }

  // ── Meta save ───────────────────────────────────────────────────────────────
  const {
    save: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  } = useSave(
    useCallback(async () => {
      if (!meta) throw new Error("No data loaded");
      await apiFetch(`/${pageKey}`, {
        method: "PUT",
        body: JSON.stringify({
          hero_title: meta.hero_title,
          hero_subtitle: meta.hero_subtitle,
          hero_image_id: meta.hero_image?.id ?? null,
          intro_image_id: meta.intro_image?.id ?? null,
          intro_heading: meta.intro_heading,
          intro_para_1: meta.intro_para_1,
          intro_para_2: meta.intro_para_2,
          intro_para_3: meta.intro_para_3,
          services_title: meta.services_title,
          services_subtitle: meta.services_subtitle,
          services_desc_1: meta.services_desc_1,
          services_desc_2: meta.services_desc_2,
          services_sub_heading: meta.services_sub_heading,
          why_image_id: meta.why_image?.id ?? null,
          why_title: meta.why_title,
          why_desc: meta.why_desc,
          why_sub_heading: meta.why_sub_heading,
          cta_text: meta.cta_text,
          cta_btn_text: meta.cta_btn_text,
          cta_btn_href: meta.cta_btn_href,
        }),
      });
    }, [meta, pageKey]),
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const M = (k) => ({
    value: meta?.[k] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [k]: e.target.value })),
  });
  const Img = (k) => ({
    value: meta?.[k],
    onUpload: (m) => setMeta((p) => ({ ...p, [k]: m })),
    onClear: () => setMeta((p) => ({ ...p, [k]: null })),
  });
  const saveProps = {
    onSave: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  };

  // ── Loading / error ──────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="space-y-4 animate-pulse mt-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-40 bg-white rounded-2xl border border-slate-100"
          />
        ))}
      </div>
    );

  if (fetchErr)
    return (
      <div
        className="flex items-center gap-2 text-red-600 text-sm p-4 mt-2
        bg-red-50 rounded-xl border border-red-200"
      >
        <AlertCircle size={16} />
        <span>{fetchErr}</span>
        <button onClick={load} className="ml-auto text-xs underline">
          Retry
        </button>
      </div>
    );

  return (
    <div className="mt-2 space-y-4">
      {/* Section tab bar */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl">
        {SECTION_TABS.map(({ key, label }) => {
          const on = section === key;
          return (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold
                whitespace-nowrap transition-all duration-200
                ${
                  on
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Section content */}
      {section === "hero" && <HeroTab M={M} Img={Img} {...saveProps} />}
      {section === "intro" && <IntroTab M={M} Img={Img} {...saveProps} />}
      {section === "services" && (
        <ServicesTab
          M={M}
          {...saveProps}
          pageKey={pageKey}
          cards={cards}
          setCards={setCards}
        />
      )}
      {section === "why" && (
        <WhyTab
          M={M}
          Img={Img}
          {...saveProps}
          pageKey={pageKey}
          whyItems={whyItems}
          setWhyItems={setWhyItems}
        />
      )}
    </div>
  );
}

// ─── Root Panel ───────────────────────────────────────────────────────────────
export default function ServicePagePanel() {
  const [activePage, setActivePage] = useState("long_term");

  return (
    <div>
      {/* ── Top-level page selector ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-2">
        {PAGES.map(({ key, label, icon: Icon }) => {
          const on = activePage === key;
          return (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold
                flex-1 justify-center transition-all duration-200 border-2
                ${
                  on
                    ? "border-amber-400 text-slate-900 shadow-sm"
                    : "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                }`}
              style={on ? { background: "rgba(183,161,112,0.12)" } : {}}
            >
              <Icon
                size={16}
                className={on ? "text-amber-600" : "text-slate-400"}
              />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Page editor — lazy-mounted per key ────────────────────────── */}
      {/* Use key to remount when page switches so each gets its own state */}
      <PageEditor key={activePage} pageKey={activePage} />
    </div>
  );
}
