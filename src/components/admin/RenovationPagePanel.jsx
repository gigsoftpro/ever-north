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
  Home,
  Clock,
  Building2,
  Star,
  HelpCircle,
} from "lucide-react";
import { getStoredToken } from "../../services/authApi"; // adjust path as needed
import { BaseUrl } from "../Config/BaseUrl";

const SERVICES_API = `${BaseUrl}services`;
const MEDIA_API = `${BaseUrl}media`;
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "intro", label: "Intro / Hero", icon: Home },
  { key: "short_term", label: "Short-Term PM", icon: Clock },
  { key: "long_term", label: "Long-Term PM", icon: Building2 },
  { key: "airbnb", label: "Hybrid PM", icon: Star },
  { key: "faq", label: "FAQ", icon: HelpCircle },
];

// ─── Tiny shared UI primitives ────────────────────────────────────────────────
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

function GB({ children, onClick, disabled, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
        text-white disabled:opacity-50 hover:opacity-90 transition-opacity ${className}`}
      style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
    >
      {children}
    </button>
  );
}

function DB({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
        text-white bg-slate-700 hover:bg-slate-800 disabled:opacity-50 transition-colors"
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
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${cls}`}
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
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
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
            className={`p-1.5 rounded-lg ${active ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-200"}`}
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
async function apiUpload(file, section) {
  const token = getStoredToken();
  const fd = new FormData();
  fd.append("image", file);
  fd.append("section", section);
  const res = await fetch(MEDIA_API, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message);
  const m = d.media;
  return {
    ...m,
    url: m.path?.startsWith("http") ? m.path : `${SERVER_ROOT}${m.path}`,
  };
}

async function apiFetch(path, opts = {}) {
  const token = getStoredToken();
  const res = await fetch(`${SERVICES_API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    ...opts,
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message);
  return d;
}

// ─── Image upload slot ────────────────────────────────────────────────────────
function ImgSlot({ label, value, onUpload, onClear, section = "services" }) {
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
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
            className="w-full h-36 flex flex-col items-center justify-center bg-slate-50 hover:bg-amber-50/50 transition-colors gap-1.5 group"
          >
            <div className="p-2 rounded-xl bg-slate-200 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-500 transition-all">
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

// ─── Why-bullets CRUD ─────────────────────────────────────────────────────────
function WhyCrudList({ sectionKey, items, setItems }) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const openNew = () => {
    setEditing({
      item: { text: "", sort_order: items.length, section_key: sectionKey },
    });
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
        section_key: sectionKey,
      };
      if (editing.item.id) {
        const r = await apiFetch(`/why-items/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((p) => p.map((x) => (x.id === editing.item.id ? r.data : x)));
      } else {
        const r = await apiFetch("/why-items", {
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
      await apiFetch(`/why-items/${id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`/why-items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({
        is_active: item.is_active ? 0 : 1,
        section_key: sectionKey,
      }),
    });
    setItems((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Bullet Points
          </p>
          <GB onClick={openNew}>
            <Plus size={13} /> Add Bullet
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
          <p className="text-sm text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">
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

// ─── FAQ CRUD ─────────────────────────────────────────────────────────────────
function FaqCrudList({ items, setItems }) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const openNew = () => {
    setEditing({
      item: { question: "", answer: "", sort_order: items.length },
    });
    setFormErr("");
  };
  const openEdit = (item) => {
    setEditing({ item: { ...item } });
    setFormErr("");
  };

  const save = async () => {
    if (!editing.item.question?.trim()) {
      setFormErr("Question is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        question: editing.item.question,
        answer: editing.item.answer,
        sort_order: editing.item.sort_order ?? 0,
      };
      if (editing.item.id) {
        const r = await apiFetch(`/faq/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((p) => p.map((x) => (x.id === editing.item.id ? r.data : x)));
      } else {
        const r = await apiFetch("/faq", {
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
    ask("This FAQ item will be permanently deleted.", async () => {
      await apiFetch(`/faq/${id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`/faq/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <div className="space-y-3">
        <div className="flex justify-end">
          <GB onClick={openNew}>
            <Plus size={13} /> Add FAQ
          </GB>
        </div>

        {editing && (
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
            <p className="text-xs font-bold text-amber-700">
              {editing.item.id ? "Edit FAQ Item" : "New FAQ Item"}
            </p>
            {formErr && (
              <p className="text-xs text-red-600 font-medium">{formErr}</p>
            )}
            <AI
              label="Question *"
              value={editing.item.question}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, question: e.target.value },
                }))
              }
            />
            <AT
              label="Answer"
              rows={5}
              value={editing.item.answer}
              onChange={(e) =>
                setEditing((p) => ({
                  item: { ...p.item, answer: e.target.value },
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
            No FAQ items yet — click "Add FAQ" to get started.
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
            <div>
              <p
                className={`text-sm font-semibold truncate max-w-[420px]
                ${item.is_active ? "text-slate-800" : "text-slate-400 line-through"}`}
              >
                {item.question}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[420px] mt-0.5">
                {item.answer}
              </p>
            </div>
          </CRow>
        ))}
      </div>
    </>
  );
}

// ─── Individual tab panels ────────────────────────────────────────────────────

function IntroTab({ meta, setMeta, onSave, saving, status }) {
  const M = (k) => ({
    value: meta[k] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [k]: e.target.value })),
  });
  const Img = (k) => ({
    value: meta[k],
    onUpload: (m) => setMeta((p) => ({ ...p, [k]: m })),
    onClear: () => setMeta((p) => ({ ...p, [k]: null })),
  });

  return (
    <SCard
      title="Intro / Hero Section"
      subtitle="Background image, page headline and the two description paragraphs"
      onSave={onSave}
      saving={saving}
      status={status}
    >
      <div className="space-y-5">
        <ImgSlot label="Hero Background Image" {...Img("intro_image")} />
        <AI label="Page Title" {...M("intro_title")} />
        <AT label="Paragraph 1" rows={4} {...M("intro_para_1")} />
        <AT label="Paragraph 2" rows={2} {...M("intro_para_2")} />
      </div>
    </SCard>
  );
}

function ServiceTab({
  sectionKey,
  sectionName,
  imgSide,
  meta,
  setMeta,
  onSave,
  saving,
  status,
  whyItems,
  setWhyItems,
}) {
  const M = (k) => ({
    value: meta[k] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [k]: e.target.value })),
  });
  const Img = (k) => ({
    value: meta[k],
    onUpload: (m) => setMeta((p) => ({ ...p, [k]: m })),
    onClear: () => setMeta((p) => ({ ...p, [k]: null })),
  });
  const pk = sectionKey;

  return (
    <div className="space-y-5">
      {/* ── Text & image card ─────────────────────────── */}
      <SCard
        title={`${sectionName} — Content`}
        subtitle="Title, tagline, description text, CTA button and section image"
        onSave={onSave}
        saving={saving}
        status={status}
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <AI label="Section Title" {...M(`${pk}_title`)} />
            <AI label="Italic Tagline" {...M(`${pk}_subtitle`)} />
          </div>
          <AT
            label="Description — leave a blank line between paragraphs"
            rows={7}
            {...M(`${pk}_desc`)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <AI label="CTA Button Text" {...M(`${pk}_cta_text`)} />
            <AI label="CTA Button Link" {...M(`${pk}_cta_href`)} />
          </div>
          <ImgSlot
            label={`Section Image (${imgSide} side)`}
            {...Img(`${pk}_image`)}
          />
        </div>
      </SCard>

      {/* ── Why bullets card ──────────────────────────── */}
      <SCard
        title={`${sectionName} — Why Bullet Points`}
        subtitle={`The checklist displayed under the ${sectionName} section on the public page`}
      >
        <div className="space-y-4">
          <AI label="Bullets Section Heading" {...M(`${pk}_why_title`)} />
          <div className="border-t border-slate-100 pt-4">
            <WhyCrudList
              sectionKey={pk}
              items={whyItems}
              setItems={setWhyItems}
            />
          </div>
        </div>
      </SCard>
    </div>
  );
}

function FaqTab({
  meta,
  setMeta,
  onSave,
  saving,
  status,
  faqItems,
  setFaqItems,
}) {
  const M = (k) => ({
    value: meta[k] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [k]: e.target.value })),
  });
  const Img = (k) => ({
    value: meta[k],
    onUpload: (m) => setMeta((p) => ({ ...p, [k]: m })),
    onClear: () => setMeta((p) => ({ ...p, [k]: null })),
  });

  return (
    <div className="space-y-5">
      {/* ── Section header ────────────────────────────── */}
      <SCard
        title="FAQ — Section Header"
        subtitle="The title and left-side image shown above the accordion on the public page"
        onSave={onSave}
        saving={saving}
        status={status}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <AI label="Section Title" {...M("faq_title")} />
          <ImgSlot label="Left-side Image" {...Img("faq_image")} />
        </div>
      </SCard>

      {/* ── FAQ items CRUD ────────────────────────────── */}
      <SCard
        title="FAQ Items"
        subtitle="Manage questions & answers — edit, toggle visibility or delete any item"
      >
        <FaqCrudList items={faqItems} setItems={setFaqItems} />
      </SCard>
    </div>
  );
}

// ─── Tab navigation bar ───────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl mb-6">
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
export default function ServicesPagePanel() {
  const [activeTab, setActiveTab] = useState("intro");
  const [meta, setMeta] = useState({});
  const [shortWhy, setShortWhy] = useState([]);
  const [longWhy, setLongWhy] = useState([]);
  const [airbnbWhy, setAirbnbWhy] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const d = await apiFetch("");
      setMeta(d.data.meta || {});
      setShortWhy(d.data.short_term_why || []);
      setLongWhy(d.data.long_term_why || []);
      setAirbnbWhy(d.data.airbnb_why || []);
      setFaqItems(d.data.faq || []);
    } catch (e) {
      setFetchErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Single meta save shared by all tabs
  const {
    save: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  } = useSave(
    useCallback(async () => {
      await apiFetch("", {
        method: "PUT",
        body: JSON.stringify({
          intro_title: meta.intro_title,
          intro_para_1: meta.intro_para_1,
          intro_para_2: meta.intro_para_2,
          intro_image_id: meta.intro_image?.id ?? null,

          short_term_title: meta.short_term_title,
          short_term_subtitle: meta.short_term_subtitle,
          short_term_desc: meta.short_term_desc,
          short_term_cta_text: meta.short_term_cta_text,
          short_term_cta_href: meta.short_term_cta_href,
          short_term_why_title: meta.short_term_why_title,
          short_term_image_id: meta.short_term_image?.id ?? null,

          long_term_title: meta.long_term_title,
          long_term_subtitle: meta.long_term_subtitle,
          long_term_desc: meta.long_term_desc,
          long_term_cta_text: meta.long_term_cta_text,
          long_term_cta_href: meta.long_term_cta_href,
          long_term_why_title: meta.long_term_why_title,
          long_term_image_id: meta.long_term_image?.id ?? null,

          airbnb_title: meta.airbnb_title,
          airbnb_subtitle: meta.airbnb_subtitle,
          airbnb_desc: meta.airbnb_desc,
          airbnb_cta_text: meta.airbnb_cta_text,
          airbnb_cta_href: meta.airbnb_cta_href,
          airbnb_why_title: meta.airbnb_why_title,
          airbnb_image_id: meta.airbnb_image?.id ?? null,

          faq_title: meta.faq_title,
          faq_image_id: meta.faq_image?.id ?? null,
        }),
      });
    }, [meta]),
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-slate-100 rounded-2xl" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-52 bg-white rounded-2xl border border-slate-100"
          />
        ))}
      </div>
    );

  // ── Fetch error ──────────────────────────────────────────────────────────
  if (fetchErr)
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm p-4 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle size={16} /> {fetchErr}
      </div>
    );

  const commonSaveProps = {
    onSave: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  };

  return (
    <div>
      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "intro" && (
        <IntroTab meta={meta} setMeta={setMeta} {...commonSaveProps} />
      )}

      {activeTab === "short_term" && (
        <ServiceTab
          sectionKey="short_term"
          sectionName="Short-Term PM"
          imgSide="right"
          meta={meta}
          setMeta={setMeta}
          {...commonSaveProps}
          whyItems={shortWhy}
          setWhyItems={setShortWhy}
        />
      )}

      {activeTab === "long_term" && (
        <ServiceTab
          sectionKey="long_term"
          sectionName="Long-Term PM"
          imgSide="left"
          meta={meta}
          setMeta={setMeta}
          {...commonSaveProps}
          whyItems={longWhy}
          setWhyItems={setLongWhy}
        />
      )}

      {activeTab === "airbnb" && (
        <ServiceTab
          sectionKey="airbnb"
          sectionName="Hybrid PM"
          imgSide="right"
          meta={meta}
          setMeta={setMeta}
          {...commonSaveProps}
          whyItems={airbnbWhy}
          setWhyItems={setAirbnbWhy}
        />
      )}

      {activeTab === "faq" && (
        <FaqTab
          meta={meta}
          setMeta={setMeta}
          {...commonSaveProps}
          faqItems={faqItems}
          setFaqItems={setFaqItems}
        />
      )}
    </div>
  );
}
