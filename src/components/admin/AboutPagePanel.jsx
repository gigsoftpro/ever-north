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
  LayoutList,
  Users,
  Heart,
  BarChart2,
  Megaphone,
} from "lucide-react";
import { getStoredToken } from "../../services/authApi";
import { BaseUrl, MediaUrl } from "../Config/BaseUrl";

const PAGES_API = `${BaseUrl}pages`;
const MEDIA_API = MediaUrl;
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "banner", label: "Banner", icon: Image, short: "Banner" },
  { id: "why", label: "Why Choose", icon: LayoutList, short: "Why Choose" },
  { id: "who", label: "Who We Are", icon: Users, short: "Who We Are" },
  { id: "values", label: "Core Values", icon: Heart, short: "Values" },
  { id: "stats", label: "Stats Banner", icon: BarChart2, short: "Stats" },
  { id: "cta", label: "CTA Section", icon: Megaphone, short: "CTA" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────
function FL({ children }) {
  return (
    <label className="block text-xs font-semibold text-slate-600 mb-1">
      {children}
    </label>
  );
}
function AInput({
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
function ATextarea({
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
function GoldBtn({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}) {
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
function DarkBtn({ children, onClick, disabled }) {
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
  if (!status || status === "idle") return null;
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

// ─── Section wrapper (replaces SCard — no outer card chrome needed inside tabs) ──
function Section({ title, subtitle, onSave, saving, status, children }) {
  return (
    <div className="space-y-5">
      {/* Section header row */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <p className="text-base font-bold text-slate-800">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Pill status={status?.type} message={status?.message} />
          {onSave && (
            <GoldBtn onClick={onSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={14} /> Save Changes
                </>
              )}
            </GoldBtn>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function CRow({ children, onEdit, onDelete, onToggle, active }) {
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
  const [pending, setPending] = useState(null);
  const ask = (label, fn) => setPending({ label, fn });
  const Modal = pending ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4">
        <p className="text-sm font-bold text-slate-800 mb-1">Delete?</p>
        <p className="text-xs text-slate-500 mb-4">{pending.label}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              pending.fn();
              setPending(null);
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setPending(null)}
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
      } catch (err) {
        setStatus({ type: "error", message: err.message });
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
  if (!res.ok) throw new Error(d.message || "Upload failed");
  const m = d.media;
  return {
    ...m,
    url: m.path?.startsWith("http") ? m.path : `${SERVER_ROOT}${m.path}`,
  };
}

async function apiFetch(path, options = {}) {
  const token = getStoredToken();
  const res = await fetch(`${PAGES_API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message || "Request failed");
  return d;
}

function ImgSlot({ label, value, onUpload, onClear, section = "about" }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  const previewUrl = value?.url || (typeof value === "string" ? value : null);
  const handleFile = async (file) => {
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
        className={`rounded-xl overflow-hidden border-2 transition-all ${previewUrl ? "border-slate-200" : "border-dashed border-slate-200 hover:border-amber-300"}`}
      >
        {busy ? (
          <div className="h-32 flex items-center justify-center bg-amber-50 gap-2">
            <Loader2 size={20} className="animate-spin text-amber-500" />
            <span className="text-xs text-slate-500">Uploading…</span>
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
                onClick={() => ref.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
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
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB NAV COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function TabNav({ activeTab, onTabChange, statusMap }) {
  const scrollRef = useRef(null);

  return (
    <div className="rounded-2xl overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const tabStatus = statusMap?.[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex gap-2 flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 
                ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }`}
            >
              <Icon
                size={14}
                className={isActive ? "text-black" : "text-slate-400"}
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
              {/* Saved dot indicator */}
              {tabStatus === "success" && (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-green-500" />
              )}
              {tabStatus === "error" && (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Prev / Next footer navigation ───────────────────────────────────────────
function TabFooter({ activeTab, onTabChange }) {
  const idx = TABS.findIndex((t) => t.id === activeTab);
  const prev = TABS[idx - 1];
  const next = TABS[idx + 1];
  return (
    <div className="flex items-center justify-between pt-2">
      {prev ? (
        <button
          onClick={() => onTabChange(prev.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          ← {prev.label}
        </button>
      ) : (
        <span />
      )}
      {next && (
        <button
          onClick={() => onTabChange(next.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(0deg,#8f7334,#b7a170)" }}
        >
          {next.label} →
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export default function AboutPagePanel() {
  const [activeTab, setActiveTab] = useState("banner");
  const [tabStatuses, setTabStatuses] = useState({});

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  const [meta, setMeta] = useState({});
  const [whyItems, setWhyItems] = useState([]);
  const [whoStats, setWhoStats] = useState([]);
  const [bannerStats, setBannerStats] = useState([]);
  const [coreVals, setCoreVals] = useState([]);

  const [editingWhy, setEditingWhy] = useState(null);
  const [editingStat, setEditingStat] = useState(null);
  const [editingVal, setEditingVal] = useState(null);
  const [formErr, setFormErr] = useState("");
  const [inlineSaving, setInlineSaving] = useState(false);

  const { ask: askDel, Modal: DelModal } = useConfirm();

  // Helper: flash a dot on the tab that just saved
  const flashTab = (tabId, type) => {
    setTabStatuses((p) => ({ ...p, [tabId]: type }));
    setTimeout(() => setTabStatuses((p) => ({ ...p, [tabId]: null })), 3000);
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      const d = await apiFetch("/about");
      const pd = d.data;
      setPageData(pd);
      setMeta(pd.meta || {});
      setWhyItems(pd.why_choose_items || []);
      setWhoStats(pd.stats?.who_we_are || []);
      setBannerStats(pd.stats?.banner || []);
      setCoreVals(pd.core_values || []);
    } catch (err) {
      setFetchErr(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Save meta (reused across Banner, Why, Who, CTA tabs) ──────────────────
  const metaSaveFn = useCallback(async () => {
    await apiFetch("/about", {
      method: "PUT",
      body: JSON.stringify({
        banner_image_id: meta.banner_image?.id ?? null,
        banner_title: meta.banner_title,
        banner_subtitle: meta.banner_subtitle,
        banner_cta_text: meta.banner_cta_text,
        banner_cta_href: meta.banner_cta_href,
        why_choose_title: meta.why_choose_title,
        why_choose_image_id: meta.why_choose_image?.id ?? null,
        who_we_are_heading: meta.who_we_are_heading,
        who_we_are_text: meta.who_we_are_text,
        who_we_are_image_id: meta.who_we_are_image?.id ?? null,
        core_values_heading: meta.core_values_heading,
        cta_bg_image_id: meta.cta_bg_image?.id ?? null,
        cta_heading: meta.cta_heading,
        cta_description: meta.cta_description,
        cta_btn1_text: meta.cta_btn1_text,
        cta_btn1_href: meta.cta_btn1_href,
        cta_btn2_text: meta.cta_btn2_text,
        cta_btn2_href: meta.cta_btn2_href,
      }),
    });
  }, [meta]);

  // Per-tab save hooks (all call the same API but track status independently)
  const {
    save: saveBanner,
    saving: savingBanner,
    status: statusBanner,
  } = useSave(
    useCallback(async () => {
      await metaSaveFn();
      flashTab("banner", "success");
    }, [metaSaveFn]),
  );
  const {
    save: saveWhy0,
    saving: savingWhy0,
    status: statusWhy0,
  } = useSave(
    useCallback(async () => {
      await metaSaveFn();
      flashTab("why", "success");
    }, [metaSaveFn]),
  );
  const {
    save: saveWho0,
    saving: savingWho0,
    status: statusWho0,
  } = useSave(
    useCallback(async () => {
      await metaSaveFn();
      flashTab("who", "success");
    }, [metaSaveFn]),
  );
  const {
    save: saveValues0,
    saving: savingValues0,
    status: statusValues0,
  } = useSave(
    useCallback(async () => {
      await metaSaveFn();
      flashTab("values", "success");
    }, [metaSaveFn]),
  );
  const {
    save: saveCta,
    saving: savingCta,
    status: statusCta,
  } = useSave(
    useCallback(async () => {
      await metaSaveFn();
      flashTab("cta", "success");
    }, [metaSaveFn]),
  );

  const M = (key) => ({
    value: meta[key] ?? "",
    onChange: (e) => setMeta((p) => ({ ...p, [key]: e.target.value })),
  });

  // ── Why Choose CRUD ────────────────────────────────────────────────────────
  const saveWhy = async () => {
    if (!editingWhy?.item?.text?.trim()) {
      setFormErr("Text is required.");
      return;
    }
    setInlineSaving(true);
    try {
      const payload = {
        text: editingWhy.item.text,
        sort_order: editingWhy.item.sort_order ?? 0,
      };
      if (editingWhy.item.id) {
        const r = await apiFetch(`/about/why-choose/${editingWhy.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setWhyItems((p) =>
          p.map((x) => (x.id === editingWhy.item.id ? r.data : x)),
        );
      } else {
        const r = await apiFetch("/about/why-choose", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setWhyItems((p) => [...p, r.data]);
      }
      setEditingWhy(null);
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setInlineSaving(false);
    }
  };
  const delWhy = (id) =>
    askDel("Delete this bullet point?", async () => {
      await apiFetch(`/about/why-choose/${id}`, { method: "DELETE" });
      setWhyItems((p) => p.filter((x) => x.id !== id));
    });
  const toggleWhy = async (item) => {
    const r = await apiFetch(`/about/why-choose/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setWhyItems((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  // ── Stats CRUD ─────────────────────────────────────────────────────────────
  const saveStat = async (section) => {
    if (
      !editingStat?.item?.value?.trim() ||
      !editingStat?.item?.label?.trim()
    ) {
      setFormErr("Value and label are required.");
      return;
    }
    setInlineSaving(true);
    try {
      const payload = {
        value: editingStat.item.value,
        label: editingStat.item.label,
        section,
        sort_order: editingStat.item.sort_order ?? 0,
      };
      if (editingStat.item.id) {
        const r = await apiFetch(`/about/stats/${editingStat.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        section === "who_we_are"
          ? setWhoStats((p) =>
              p.map((x) => (x.id === editingStat.item.id ? r.data : x)),
            )
          : setBannerStats((p) =>
              p.map((x) => (x.id === editingStat.item.id ? r.data : x)),
            );
      } else {
        const r = await apiFetch("/about/stats", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        section === "who_we_are"
          ? setWhoStats((p) => [...p, r.data])
          : setBannerStats((p) => [...p, r.data]);
      }
      setEditingStat(null);
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setInlineSaving(false);
    }
  };
  const delStat = (id, section) =>
    askDel("Delete this stat?", async () => {
      await apiFetch(`/about/stats/${id}`, { method: "DELETE" });
      section === "who_we_are"
        ? setWhoStats((p) => p.filter((x) => x.id !== id))
        : setBannerStats((p) => p.filter((x) => x.id !== id));
    });

  // ── Core Values CRUD ───────────────────────────────────────────────────────
  const saveVal = async () => {
    if (!editingVal?.item?.title?.trim()) {
      setFormErr("Title is required.");
      return;
    }
    setInlineSaving(true);
    try {
      const payload = {
        emoji: editingVal.item.emoji || "⭐",
        title: editingVal.item.title,
        description: editingVal.item.description,
        sort_order: editingVal.item.sort_order ?? 0,
      };
      if (editingVal.item.id) {
        const r = await apiFetch(`/about/values/${editingVal.item.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCoreVals((p) =>
          p.map((x) => (x.id === editingVal.item.id ? r.data : x)),
        );
      } else {
        const r = await apiFetch("/about/values", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCoreVals((p) => [...p, r.data]);
      }
      setEditingVal(null);
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setInlineSaving(false);
    }
  };
  const delVal = (id) =>
    askDel("Delete this value card?", async () => {
      await apiFetch(`/about/values/${id}`, { method: "DELETE" });
      setCoreVals((p) => p.filter((x) => x.id !== id));
    });
  const toggleVal = async (item) => {
    const r = await apiFetch(`/about/values/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ is_active: item.is_active ? 0 : 1 }),
    });
    setCoreVals((p) => p.map((x) => (x.id === item.id ? r.data : x)));
  };

  // ── Inline form helpers ────────────────────────────────────────────────────
  const openEdit = (setter, item) => {
    setter({ item: { ...item } });
    setFormErr("");
  };
  const openNew = (setter, defaults) => {
    setter({ item: defaults });
    setFormErr("");
  };

  function EditBlock({ title, onSave, onCancel, children }) {
    return (
      <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 space-y-3">
        <p className="text-xs font-bold text-amber-700">{title}</p>
        {formErr && <p className="text-xs text-red-600">{formErr}</p>}
        {children}
        <div className="flex gap-2">
          <GoldBtn onClick={onSave} disabled={inlineSaving}>
            {inlineSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Check size={13} /> Save
              </>
            )}
          </GoldBtn>
          <DarkBtn onClick={onCancel}>
            <X size={13} /> Cancel
          </DarkBtn>
        </div>
      </div>
    );
  }

  // ── Loading / error states ─────────────────────────────────────────────────
  if (loading)
    return (
      <div className="space-y-4">
        {/* Skeleton tab strip */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
          <div className="flex border-b border-slate-100">
            {TABS.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-12 bg-slate-100 first:bg-amber-50"
              />
            ))}
          </div>
          <div className="h-8 bg-gradient-to-r from-amber-50 to-white" />
        </div>
        {/* Skeleton content */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-${i === 0 ? 10 : 12} bg-slate-100 rounded-xl`}
            />
          ))}
        </div>
      </div>
    );

  if (fetchErr)
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm p-4 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle size={16} /> {fetchErr}
      </div>
    );

  // ─── Tab content map ───────────────────────────────────────────────────────
  const tabContent = {
    // ── BANNER ──────────────────────────────────────────────────────────────
    banner: (
      <Section
        title="Banner"
        subtitle="Hero banner at the top of the About Us page"
        onSave={saveBanner}
        saving={savingBanner}
        status={statusBanner}
      >
        <div className="space-y-4">
          <div className="sm:w-1/2">
            <ImgSlot
              label="Banner Background Image"
              value={meta.banner_image}
              onUpload={(m) => setMeta((p) => ({ ...p, banner_image: m }))}
              onClear={() => setMeta((p) => ({ ...p, banner_image: null }))}
            />
          </div>
          <AInput label="Page Title" {...M("banner_title")} />
          <ATextarea label="Subtitle" rows={2} {...M("banner_subtitle")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <AInput
              label="CTA Button Text"
              {...M("banner_cta_text")}
              placeholder="Contact Us"
            />
            <AInput
              label="CTA Button Link"
              {...M("banner_cta_href")}
              placeholder="#contact"
            />
          </div>
        </div>
      </Section>
    ),

    // ── WHY CHOOSE ──────────────────────────────────────────────────────────
    why: (
      <Section
        title="Why Choose Section"
        subtitle="Section title, image, and bullet points"
        onSave={saveWhy0}
        saving={savingWhy0}
        status={statusWhy0}
      >
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <AInput label="Section Title" {...M("why_choose_title")} />
            <ImgSlot
              label="Section Image"
              value={meta.why_choose_image}
              onUpload={(m) => setMeta((p) => ({ ...p, why_choose_image: m }))}
              onClear={() => setMeta((p) => ({ ...p, why_choose_image: null }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <FL>Bullet Points</FL>
              <GoldBtn
                onClick={() =>
                  openNew(setEditingWhy, {
                    text: "",
                    sort_order: whyItems.length,
                  })
                }
                className="py-1 px-3 text-xs"
              >
                <Plus size={12} /> Add
              </GoldBtn>
            </div>
            <div className="space-y-2">
              {editingWhy && !editingWhy.item.id && (
                <EditBlock
                  title="New Bullet Point"
                  onSave={saveWhy}
                  onCancel={() => setEditingWhy(null)}
                >
                  <AInput
                    label="Text *"
                    value={editingWhy.item.text}
                    onChange={(e) =>
                      setEditingWhy((p) => ({
                        item: { ...p.item, text: e.target.value },
                      }))
                    }
                  />
                  <AInput
                    label="Sort Order"
                    type="number"
                    value={editingWhy.item.sort_order}
                    onChange={(e) =>
                      setEditingWhy((p) => ({
                        item: { ...p.item, sort_order: Number(e.target.value) },
                      }))
                    }
                    className="sm:w-1/3"
                  />
                </EditBlock>
              )}
              {whyItems.map((item) =>
                editingWhy?.item?.id === item.id ? (
                  <EditBlock
                    key={item.id}
                    title="Edit Bullet Point"
                    onSave={saveWhy}
                    onCancel={() => setEditingWhy(null)}
                  >
                    <AInput
                      label="Text *"
                      value={editingWhy.item.text}
                      onChange={(e) =>
                        setEditingWhy((p) => ({
                          item: { ...p.item, text: e.target.value },
                        }))
                      }
                    />
                    <AInput
                      label="Sort Order"
                      type="number"
                      value={editingWhy.item.sort_order}
                      onChange={(e) =>
                        setEditingWhy((p) => ({
                          item: {
                            ...p.item,
                            sort_order: Number(e.target.value),
                          },
                        }))
                      }
                      className="sm:w-1/3"
                    />
                  </EditBlock>
                ) : (
                  <CRow
                    key={item.id}
                    active={!!item.is_active}
                    onToggle={() => toggleWhy(item)}
                    onEdit={() => openEdit(setEditingWhy, item)}
                    onDelete={() => delWhy(item.id)}
                  >
                    <p className="text-sm text-slate-800">✓ {item.text}</p>
                  </CRow>
                ),
              )}
              {whyItems.length === 0 && !editingWhy && (
                <p className="text-xs text-slate-400 text-center py-4">
                  No bullet points yet — add one above.
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    ),

    // ── WHO WE ARE ──────────────────────────────────────────────────────────
    who: (
      <Section
        title="Who We Are Section"
        subtitle="Heading, body text, photo and stat cards"
        onSave={saveWho0}
        saving={savingWho0}
        status={statusWho0}
      >
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <AInput label="Section Heading" {...M("who_we_are_heading")} />
            <ImgSlot
              label="Section Photo"
              value={meta.who_we_are_image}
              onUpload={(m) => setMeta((p) => ({ ...p, who_we_are_image: m }))}
              onClear={() => setMeta((p) => ({ ...p, who_we_are_image: null }))}
            />
          </div>
          <ATextarea label="Body Text" rows={4} {...M("who_we_are_text")} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <FL>Stat Cards (right column)</FL>
              <GoldBtn
                onClick={() => {
                  openNew(setEditingStat, {
                    value: "",
                    label: "",
                    sort_order: whoStats.length,
                  });
                  setFormErr("");
                }}
                className="py-1 px-3 text-xs"
              >
                <Plus size={12} /> Add
              </GoldBtn>
            </div>
            <div className="space-y-2">
              {editingStat &&
                !editingStat.item.id &&
                editingStat.section === "who_we_are" && (
                  <EditBlock
                    title="New Stat Card"
                    onSave={() => saveStat("who_we_are")}
                    onCancel={() => setEditingStat(null)}
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <AInput
                        label="Value *"
                        value={editingStat.item.value}
                        placeholder="10+"
                        onChange={(e) =>
                          setEditingStat((p) => ({
                            ...p,
                            item: { ...p.item, value: e.target.value },
                          }))
                        }
                      />
                      <AInput
                        label="Label *"
                        value={editingStat.item.label}
                        placeholder="Years Experience"
                        onChange={(e) =>
                          setEditingStat((p) => ({
                            ...p,
                            item: { ...p.item, label: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </EditBlock>
                )}
              {whoStats.map((stat) =>
                editingStat?.item?.id === stat.id ? (
                  <EditBlock
                    key={stat.id}
                    title="Edit Stat Card"
                    onSave={() => saveStat("who_we_are")}
                    onCancel={() => setEditingStat(null)}
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <AInput
                        label="Value *"
                        value={editingStat.item.value}
                        onChange={(e) =>
                          setEditingStat((p) => ({
                            ...p,
                            item: { ...p.item, value: e.target.value },
                          }))
                        }
                      />
                      <AInput
                        label="Label *"
                        value={editingStat.item.label}
                        onChange={(e) =>
                          setEditingStat((p) => ({
                            ...p,
                            item: { ...p.item, label: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </EditBlock>
                ) : (
                  <CRow
                    key={stat.id}
                    onEdit={() =>
                      openEdit(setEditingStat, {
                        ...stat,
                        section: "who_we_are",
                      })
                    }
                    onDelete={() => delStat(stat.id, "who_we_are")}
                  >
                    <span className="text-sm font-bold text-amber-600">
                      {stat.value}
                    </span>
                    <span className="text-sm text-slate-600 ml-2">
                      {stat.label}
                    </span>
                  </CRow>
                ),
              )}
              {whoStats.length === 0 && !editingStat && (
                <p className="text-xs text-slate-400 text-center py-4">
                  No stat cards yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    ),

    // ── CORE VALUES ─────────────────────────────────────────────────────────
    values: (
      <Section
        title="Core Values Section"
        subtitle="Section heading and value cards"
        onSave={saveValues0}
        saving={savingValues0}
        status={statusValues0}
      >
        <div className="space-y-5">
          <AInput label="Section Heading" {...M("core_values_heading")} />

          <div>
            <div className="flex items-center justify-between mb-2">
              <FL>Value Cards</FL>
              <GoldBtn
                onClick={() =>
                  openNew(setEditingVal, {
                    emoji: "⭐",
                    title: "",
                    description: "",
                    sort_order: coreVals.length,
                  })
                }
                className="py-1 px-3 text-xs"
              >
                <Plus size={12} /> Add
              </GoldBtn>
            </div>
            <div className="space-y-2">
              {editingVal && !editingVal.item.id && (
                <EditBlock
                  title="New Value Card"
                  onSave={saveVal}
                  onCancel={() => setEditingVal(null)}
                >
                  <div className="grid sm:grid-cols-3 gap-3">
                    <AInput
                      label="Emoji"
                      value={editingVal.item.emoji}
                      placeholder="⭐"
                      onChange={(e) =>
                        setEditingVal((p) => ({
                          item: { ...p.item, emoji: e.target.value },
                        }))
                      }
                    />
                    <AInput
                      label="Title *"
                      value={editingVal.item.title}
                      className="sm:col-span-2"
                      onChange={(e) =>
                        setEditingVal((p) => ({
                          item: { ...p.item, title: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <ATextarea
                    label="Description"
                    rows={2}
                    value={editingVal.item.description}
                    onChange={(e) =>
                      setEditingVal((p) => ({
                        item: { ...p.item, description: e.target.value },
                      }))
                    }
                  />
                </EditBlock>
              )}
              {coreVals.map((val) =>
                editingVal?.item?.id === val.id ? (
                  <EditBlock
                    key={val.id}
                    title="Edit Value Card"
                    onSave={saveVal}
                    onCancel={() => setEditingVal(null)}
                  >
                    <div className="grid sm:grid-cols-3 gap-3">
                      <AInput
                        label="Emoji"
                        value={editingVal.item.emoji}
                        onChange={(e) =>
                          setEditingVal((p) => ({
                            item: { ...p.item, emoji: e.target.value },
                          }))
                        }
                      />
                      <AInput
                        label="Title *"
                        value={editingVal.item.title}
                        className="sm:col-span-2"
                        onChange={(e) =>
                          setEditingVal((p) => ({
                            item: { ...p.item, title: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <ATextarea
                      label="Description"
                      rows={2}
                      value={editingVal.item.description}
                      onChange={(e) =>
                        setEditingVal((p) => ({
                          item: { ...p.item, description: e.target.value },
                        }))
                      }
                    />
                  </EditBlock>
                ) : (
                  <CRow
                    key={val.id}
                    active={!!val.is_active}
                    onToggle={() => toggleVal(val)}
                    onEdit={() => openEdit(setEditingVal, val)}
                    onDelete={() => delVal(val.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{val.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {val.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  </CRow>
                ),
              )}
              {coreVals.length === 0 && !editingVal && (
                <p className="text-xs text-slate-400 text-center py-4">
                  No value cards yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    ),

    // ── STATS BANNER ────────────────────────────────────────────────────────
    stats: (
      <Section
        title="Stats Banner"
        subtitle="Full-width dark strip with key metrics"
      >
        <div className="space-y-3">
          <div className="flex justify-end">
            <GoldBtn
              onClick={() => {
                openNew(setEditingStat, {
                  value: "",
                  label: "",
                  sort_order: bannerStats.length,
                  section: "banner",
                });
                setFormErr("");
              }}
              className="py-1 px-3 text-xs"
            >
              <Plus size={12} /> Add Stat
            </GoldBtn>
          </div>
          {editingStat &&
            !editingStat.item.id &&
            editingStat.item.section === "banner" && (
              <EditBlock
                title="New Banner Stat"
                onSave={() => saveStat("banner")}
                onCancel={() => setEditingStat(null)}
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <AInput
                    label="Value *"
                    value={editingStat.item.value}
                    placeholder="500+"
                    onChange={(e) =>
                      setEditingStat((p) => ({
                        ...p,
                        item: { ...p.item, value: e.target.value },
                      }))
                    }
                  />
                  <AInput
                    label="Label *"
                    value={editingStat.item.label}
                    placeholder="Properties Managed"
                    onChange={(e) =>
                      setEditingStat((p) => ({
                        ...p,
                        item: { ...p.item, label: e.target.value },
                      }))
                    }
                  />
                </div>
              </EditBlock>
            )}
          {bannerStats.map((stat) =>
            editingStat?.item?.id === stat.id ? (
              <EditBlock
                key={stat.id}
                title="Edit Banner Stat"
                onSave={() => saveStat("banner")}
                onCancel={() => setEditingStat(null)}
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <AInput
                    label="Value *"
                    value={editingStat.item.value}
                    onChange={(e) =>
                      setEditingStat((p) => ({
                        ...p,
                        item: { ...p.item, value: e.target.value },
                      }))
                    }
                  />
                  <AInput
                    label="Label *"
                    value={editingStat.item.label}
                    onChange={(e) =>
                      setEditingStat((p) => ({
                        ...p,
                        item: { ...p.item, label: e.target.value },
                      }))
                    }
                  />
                </div>
              </EditBlock>
            ) : (
              <CRow
                key={stat.id}
                onEdit={() =>
                  openEdit(setEditingStat, { ...stat, section: "banner" })
                }
                onDelete={() => delStat(stat.id, "banner")}
              >
                <span className="text-sm font-bold text-amber-600">
                  {stat.value}
                </span>
                <span className="text-sm text-slate-600 ml-2">
                  {stat.label}
                </span>
              </CRow>
            ),
          )}
          {bannerStats.length === 0 && !editingStat && (
            <p className="text-xs text-slate-400 text-center py-4">
              No banner stats yet.
            </p>
          )}
        </div>
      </Section>
    ),

    // ── CTA ─────────────────────────────────────────────────────────────────
    cta: (
      <Section
        title="CTA Section"
        subtitle="Bottom call-to-action — background, heading and buttons"
        onSave={saveCta}
        saving={savingCta}
        status={statusCta}
      >
        <div className="space-y-4">
          <div className="sm:w-1/2">
            <ImgSlot
              label="CTA Background Image"
              value={meta.cta_bg_image}
              onUpload={(m) => setMeta((p) => ({ ...p, cta_bg_image: m }))}
              onClear={() => setMeta((p) => ({ ...p, cta_bg_image: null }))}
            />
          </div>
          <AInput label="Heading" {...M("cta_heading")} />
          <ATextarea label="Description" rows={2} {...M("cta_description")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <p className="text-xs font-bold text-slate-600">
                Button 1 (Gold)
              </p>
              <AInput label="Text" {...M("cta_btn1_text")} />
              <AInput label="Link" {...M("cta_btn1_href")} />
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <p className="text-xs font-bold text-slate-600">
                Button 2 (Dark)
              </p>
              <AInput label="Text" {...M("cta_btn2_text")} />
              <AInput label="Link" {...M("cta_btn2_href")} />
            </div>
          </div>
        </div>
      </Section>
    ),
  };

  // ── Handle tab switch — close any open edit forms ─────────────────────────
  const handleTabChange = (id) => {
    setActiveTab(id);
    setEditingWhy(null);
    setEditingStat(null);
    setEditingVal(null);
    setFormErr("");
  };

  return (
    <>
      {DelModal}
      <div className="space-y-3">
        {/* Tab navigation */}
        <TabNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          statusMap={tabStatuses}
        />

        {/* Active tab content card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {tabContent[activeTab]}
        </div>

        {/* Prev / Next footer */}
        <TabFooter activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </>
  );
}
