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
} from "lucide-react";
import { getStoredToken } from "../../services/authApi"; // adjust path as needed
import { BaseUrl } from "../Config/BaseUrl";

const RENO_API = `${BaseUrl}renovation`;
const MEDIA_API = `${BaseUrl}media`;
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Shared mini-UI ───────────────────────────────────────────────────────────
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
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 disabled:opacity-50 transition"
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
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 disabled:opacity-50 transition resize-none"
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
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 hover:opacity-90 transition-opacity ${className}`}
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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 disabled:opacity-50 transition-colors"
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
                  <Save size={14} /> Save
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
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-amber-200 transition group">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggle && (
          <button
            onClick={onToggle}
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
function useConfirm() {
  const [p, setP] = useState(null);
  const ask = (label, fn) => setP({ label, fn });
  const Modal = p ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4">
        <p className="text-sm font-bold text-slate-800 mb-1">Delete?</p>
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
  const res = await fetch(`${RENO_API}${path}`, {
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
function ImgSlot({ label, value, onUpload, onClear, section = "renovation" }) {
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
        className={`rounded-xl overflow-hidden border-2 transition-all ${url ? "border-slate-200" : "border-dashed border-slate-200 hover:border-amber-300"}`}
      >
        {busy ? (
          <div className="h-32 flex items-center justify-center bg-amber-50 gap-2">
            <Loader2 size={20} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-500">Uploading…</span>
          </div>
        ) : url ? (
          <div className="relative group">
            <img src={url} alt={label} className="w-full h-32 object-cover" />
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
            className="w-full h-32 flex flex-col items-center justify-center bg-slate-50 hover:bg-amber-50/50 transition-colors gap-1.5 group"
          >
            <div className="p-2 rounded-xl bg-slate-200 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-500 transition-all">
              <Upload size={18} />
            </div>
            <p className="text-xs font-medium text-slate-500">
              {label || "Upload"}
            </p>
            <p className="text-[10px] text-slate-400">Click or drag & drop</p>
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

// ─── Generic CRUD list component ──────────────────────────────────────────────
function CrudList({
  title,
  subtitle,
  items,
  setItems,
  apiPath,
  renderRow,
  renderForm,
  emptyDefaults,
}) {
  const [editing, setEditing] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const { ask, Modal } = useConfirm();

  const openNew = () => {
    setEditing({ item: { ...emptyDefaults, sort_order: items.length } });
    setFormErr("");
  };
  const openEdit = (item) => {
    setEditing({ item: { ...item } });
    setFormErr("");
  };

  const save = async () => {
    const err = renderForm.validate?.(editing.item);
    if (err) {
      setFormErr(err);
      return;
    }
    setSaving(true);
    try {
      const payload = renderForm.toPayload(editing.item);
      if (editing.item.id) {
        const r = await apiFetch(`${apiPath}/${editing.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setItems((p) => p.map((x) => (x.id === editing.item.id ? r.data : x)));
      } else {
        const r = await apiFetch(apiPath, {
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
    ask("This item will be permanently deleted.", async () => {
      await apiFetch(`${apiPath}/${id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x.id !== id));
    });

  const toggle = async (item) => {
    const r = await apiFetch(`${apiPath}/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setItems((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  return (
    <>
      {Modal}
      <SCard title={title} subtitle={subtitle}>
        <div className="space-y-3">
          <div className="flex justify-end">
            <GB onClick={openNew}>
              <Plus size={14} /> Add
            </GB>
          </div>

          {editing && (
            <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
              <p className="text-xs font-bold text-amber-700">
                {editing.item.id ? "Edit" : "New"}
              </p>
              {formErr && (
                <p className="text-xs text-red-600 font-medium">{formErr}</p>
              )}
              {renderForm.fields(editing.item, (patch) =>
                setEditing((p) => ({ item: { ...p.item, ...patch } })),
              )}
              <div className="flex gap-2 pt-1">
                <GB onClick={save} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Check size={13} />{" "}
                      {editing.item.id ? "Update" : "Create"}
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
            <p className="text-sm text-slate-400 text-center py-8">
              No items yet.
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
              {renderRow(item)}
            </CRow>
          ))}
        </div>
      </SCard>
    </>
  );
}

export default function RenovationPagePanel() {
  const [meta, setMeta] = useState({});
  const [cards, setCards] = useState([]);
  const [owners, setOwners] = useState([]);
  const [whyItems, setWhyItems] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const d = await apiFetch("");
      setMeta(d.data.meta || {});
      setCards(d.data.cards || []);
      setOwners(d.data.owner_types || []);
      setWhyItems(d.data.why_items || []);
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

  // ── Meta save ─────────────────────────────────────────────────────────────
  const {
    save: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  } = useSave(
    useCallback(async () => {
      await apiFetch("", {
        method: "PUT",
        body: JSON.stringify({
          hero_image_id: meta.hero_image?.id ?? null,
          hero_title: meta.hero_title,
          hero_tagline: meta.hero_tagline,
          hero_para_1: meta.hero_para_1,
          hero_para_2: meta.hero_para_2,
          hero_para_3: meta.hero_para_3,
          hero_cta_text: meta.hero_cta_text,
          hero_cta_href: meta.hero_cta_href,
          renovate_title: meta.renovate_title,
          renovate_subtitle: meta.renovate_subtitle,
          upgrades_title: meta.upgrades_title,
          upgrades_subtitle: meta.upgrades_subtitle,
          upgrades_image_id: meta.upgrades_image?.id ?? null,
          why_image_id: meta.why_image?.id ?? null,
          why_title: meta.why_title,
          done_title: meta.done_title,
          done_para_1: meta.done_para_1,
          done_para_2: meta.done_para_2,
          done_btn1_text: meta.done_btn1_text,
          done_btn1_href: meta.done_btn1_href,
          done_btn2_text: meta.done_btn2_text,
          done_btn2_href: meta.done_btn2_href,
          done_image_id: meta.done_image?.id ?? null,
          faq_title: meta.faq_title,
          faq_image_id: meta.faq_image?.id ?? null,
        }),
      });
    }, [meta]),
  );

  const M = (k) => ({
    value: meta[k] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [k]: e.target.value })),
  });
  const Img = (k) => ({
    value: meta[k],
    onUpload: (m) => setMeta((p) => ({ ...p, [k]: m })),
    onClear: () => setMeta((p) => ({ ...p, [k]: null })),
  });

  if (loading)
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-36 bg-white rounded-2xl border border-slate-100"
          />
        ))}
      </div>
    );
  if (fetchErr)
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm p-4 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle size={16} /> {fetchErr}
      </div>
    );

  return (
    <div className="space-y-4">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <SCard
        title="Hero Section"
        subtitle="Banner background, headline, taglines and CTA"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="space-y-4">
          <div className="sm:w-1/2">
            <ImgSlot label="Background Image" {...Img("hero_image")} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AI label="Title" {...M("hero_title")} />
            <AI label="Tagline (gold text)" {...M("hero_tagline")} />
          </div>
          <AT label="Paragraph 1" rows={3} {...M("hero_para_1")} />
          <AT label="Paragraph 2" rows={2} {...M("hero_para_2")} />
          <AT label="Paragraph 3" rows={3} {...M("hero_para_3")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <AI label="CTA Button Text" {...M("hero_cta_text")} />
            <AI label="CTA Button Link" {...M("hero_cta_href")} />
          </div>
        </div>
      </SCard>

      {/* ── What We Renovate section labels ──────────────────────────── */}
      <SCard
        title="What We Renovate — Section Header"
        subtitle="Title and subtitle above the card grid"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="space-y-3">
          <AI label="Section Title" {...M("renovate_title")} />
          <AT label="Section Subtitle" rows={2} {...M("renovate_subtitle")} />
        </div>
      </SCard>

      {/* ── Renovation Cards CRUD ────────────────────────────────────── */}
      <CrudList
        title="Renovation Cards"
        subtitle="Emoji, title and description for each service card"
        items={cards}
        setItems={setCards}
        apiPath="/cards"
        emptyDefaults={{ emoji: "🏠", title: "", description: "" }}
        renderRow={(item) => (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {item.title}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">
                {item.description}
              </p>
            </div>
          </div>
        )}
        renderForm={{
          validate: (item) =>
            !item.title?.trim() ? "Title is required." : null,
          toPayload: (item) => ({
            emoji: item.emoji || "🏠",
            title: item.title,
            description: item.description,
            sort_order: item.sort_order ?? 0,
          }),
          fields: (item, patch) => (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <AI
                  label="Emoji"
                  value={item.emoji}
                  onChange={(e) => patch({ emoji: e.target.value })}
                  placeholder="🏠"
                />
                <AI
                  label="Title *"
                  value={item.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  className="sm:col-span-2"
                />
              </div>
              <AT
                label="Description"
                rows={3}
                value={item.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
              <AI
                label="Sort Order"
                type="number"
                value={item.sort_order}
                onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                className="sm:w-1/4"
              />
            </>
          ),
        }}
      />

      {/* ── Strategic Upgrades section labels ────────────────────────── */}
      <SCard
        title="Strategic Upgrades — Section Header"
        subtitle="Title, subtitle and right-side image"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="space-y-3">
          <AI label="Section Title" {...M("upgrades_title")} />
          <AT label="Section Subtitle" rows={2} {...M("upgrades_subtitle")} />
          <div className="sm:w-1/2">
            <ImgSlot label="Right-side Image" {...Img("upgrades_image")} />
          </div>
        </div>
      </SCard>

      {/* ── Owner Type Cards CRUD ────────────────────────────────────── */}
      <CrudList
        title="Owner Type Cards"
        subtitle="The four gold-bordered cards in the Strategic Upgrades section"
        items={owners}
        setItems={setOwners}
        apiPath="/owner-types"
        emptyDefaults={{ title: "", description: "" }}
        renderRow={(item) => (
          <div>
            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-400 truncate max-w-[320px]">
              {item.description}
            </p>
          </div>
        )}
        renderForm={{
          validate: (item) =>
            !item.title?.trim() ? "Title is required." : null,
          toPayload: (item) => ({
            title: item.title,
            description: item.description,
            sort_order: item.sort_order ?? 0,
          }),
          fields: (item, patch) => (
            <>
              <AI
                label="Title *"
                value={item.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
              <AT
                label="Description"
                rows={3}
                value={item.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
              <AI
                label="Sort Order"
                type="number"
                value={item.sort_order}
                onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                className="sm:w-1/4"
              />
            </>
          ),
        }}
      />

      {/* ── Why EverNorth section header ─────────────────────────────── */}
      <SCard
        title="Why EverNorth — Section Header"
        subtitle="Title and left-side image"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <AI label="Section Title" {...M("why_title")} />
          <ImgSlot label="Left-side Image" {...Img("why_image")} />
        </div>
      </SCard>

      {/* ── Why Bullet Items CRUD ────────────────────────────────────── */}
      <CrudList
        title="Why EverNorth — Bullet Points"
        items={whyItems}
        setItems={setWhyItems}
        apiPath="/why-items"
        emptyDefaults={{ text: "" }}
        renderRow={(item) => (
          <p className="text-sm text-slate-800">• {item.text}</p>
        )}
        renderForm={{
          validate: (item) => (!item.text?.trim() ? "Text is required." : null),
          toPayload: (item) => ({
            text: item.text,
            sort_order: item.sort_order ?? 0,
          }),
          fields: (item, patch) => (
            <>
              <AI
                label="Bullet Text *"
                value={item.text}
                onChange={(e) => patch({ text: e.target.value })}
              />
              <AI
                label="Sort Order"
                type="number"
                value={item.sort_order}
                onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                className="sm:w-1/4"
              />
            </>
          ),
        }}
      />

      {/* ── Done Right section ───────────────────────────────────────── */}
      <SCard
        title="Done Right Section"
        subtitle="Heading, paragraphs, two CTA buttons and right-side image"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="space-y-4">
          <AI label="Heading" {...M("done_title")} />
          <AT label="Paragraph 1" rows={3} {...M("done_para_1")} />
          <AT label="Paragraph 2" rows={3} {...M("done_para_2")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <p className="text-xs font-bold text-slate-600">
                Button 1 (Gold)
              </p>
              <AI label="Text" {...M("done_btn1_text")} />
              <AI label="Link" {...M("done_btn1_href")} />
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <p className="text-xs font-bold text-slate-600">
                Button 2 (Outline)
              </p>
              <AI label="Text" {...M("done_btn2_text")} />
              <AI label="Link" {...M("done_btn2_href")} />
            </div>
          </div>
          <div className="sm:w-1/2">
            <ImgSlot label="Right-side Image" {...Img("done_image")} />
          </div>
        </div>
      </SCard>

      {/* ── FAQ section header ───────────────────────────────────────── */}
      <SCard
        title="FAQ — Section Header"
        subtitle="Title and left-side image"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <AI label="Section Title" {...M("faq_title")} />
          <ImgSlot label="Left-side Image" {...Img("faq_image")} />
        </div>
      </SCard>

      {/* ── FAQ Items CRUD ───────────────────────────────────────────── */}
      <CrudList
        title="FAQ Items"
        items={faqItems}
        setItems={setFaqItems}
        apiPath="/faq"
        emptyDefaults={{ question: "", answer: "" }}
        renderRow={(item) => (
          <div>
            <p className="text-sm font-semibold text-slate-800 truncate max-w-[360px]">
              {item.question}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[360px]">
              {item.answer}
            </p>
          </div>
        )}
        renderForm={{
          validate: (item) =>
            !item.question?.trim() ? "Question is required." : null,
          toPayload: (item) => ({
            question: item.question,
            answer: item.answer,
            sort_order: item.sort_order ?? 0,
          }),
          fields: (item, patch) => (
            <>
              <AI
                label="Question *"
                value={item.question}
                onChange={(e) => patch({ question: e.target.value })}
              />
              <AT
                label="Answer"
                rows={4}
                value={item.answer}
                onChange={(e) => patch({ answer: e.target.value })}
              />
              <AI
                label="Sort Order"
                type="number"
                value={item.sort_order}
                onChange={(e) => patch({ sort_order: Number(e.target.value) })}
                className="sm:w-1/4"
              />
            </>
          ),
        }}
      />
    </div>
  );
}
