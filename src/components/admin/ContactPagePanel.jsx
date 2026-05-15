/**
 * ContactPagePanel.jsx
 * Admin panel tab for the Contact Us page.
 * Import this into ContentEditor.jsx and add to TABS + renderPanel.
 *
 * API used:
 *   GET/PUT /api/pages/contact
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  Check,
  Loader2,
  AlertCircle,
  Upload,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { getStoredToken } from "../../services/authApi"; // adjust path as needed
import { BaseUrl, MediaUrl } from "../Config/BaseUrl";

const PAGES_API = `${BaseUrl}pages`;
const MEDIA_API = MediaUrl;
const SERVER_ROOT = BaseUrl.replace(/\/api\/?$/, "");

// ─── Shared mini-UI (self-contained copy) ─────────────────────────────────────
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
            <GoldBtn onClick={onSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving…
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

function ImgSlot({ label, value, onUpload, onClear, section = "contact" }) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
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
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`rounded-xl overflow-hidden border-2 transition-all ${drag ? "border-amber-400" : previewUrl ? "border-slate-200" : "border-dashed border-slate-200 hover:border-amber-300"}`}
      >
        {busy ? (
          <div className="h-32 flex flex-col items-center justify-center bg-amber-50 gap-2">
            <Loader2 size={22} className="animate-spin text-amber-500" />
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
                onClick={() => ref.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
              >
                <RefreshCw size={11} /> Replace
              </button>
              <button
                onClick={onClear}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 flex items-center gap-1"
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
              {label || "Upload image"}
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

// ─── useSave hook ─────────────────────────────────────────────────────────────
function useSave(fn) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const save = useCallback(
    async (...args) => {
      setSaving(true);
      setStatus({ type: "saving" });
      try {
        await fn(...args);
        setStatus({ type: "success", message: "Saved!" });
        setTimeout(() => setStatus(null), 3000);
      } catch (err) {
        setStatus({ type: "error", message: err.message || "Save failed" });
      } finally {
        setSaving(false);
      }
    },
    [fn],
  );
  return { save, saving, status };
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function ContactPagePanel() {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  // Load
  useEffect(() => {
    const token = getStoredToken();
    fetch(`${PAGES_API}/contact`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setDraft(d.data);
        else setFetchErr(d.message);
      })
      .catch((e) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const {
    save: saveMeta,
    saving: savingMeta,
    status: statusMeta,
  } = useSave(
    useCallback(async () => {
      if (!draft) return;
      const token = getStoredToken();
      const res = await fetch(`${PAGES_API}/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          banner_image_id: draft.banner_image?.id ?? null,
          banner_title: draft.banner_title,
          banner_subtitle: draft.banner_subtitle,
          section_heading: draft.section_heading,
          section_description: draft.section_description,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.message || "Save failed");
      setDraft(d.data);
    }, [draft]),
  );

  const F = (key) => ({
    value: draft?.[key] ?? "",
    onChange: (e) => setDraft((p) => ({ ...p, [key]: e.target.value })),
  });

  if (loading)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-white rounded-2xl border border-slate-100" />
        <div className="h-48 bg-white rounded-2xl border border-slate-100" />
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
      {/* ── Banner section ─────────────────────────────────────────────── */}
      <SCard
        title="Contact Page — Banner"
        subtitle="Hero image, title and subtitle shown at the top of the Contact page"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="space-y-4">
          <div className="sm:w-1/2">
            <ImgSlot
              label="Banner Background Image"
              section="contact"
              value={draft?.banner_image}
              onUpload={(m) => setDraft((p) => ({ ...p, banner_image: m }))}
              onClear={() => setDraft((p) => ({ ...p, banner_image: null }))}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AInput
              label="Page Title"
              {...F("banner_title")}
              placeholder="Contact Ever North…"
              className="sm:col-span-2"
            />
            <ATextarea
              label="Subtitle / Tagline"
              rows={3}
              {...F("banner_subtitle")}
              className="sm:col-span-2"
            />
          </div>
        </div>
      </SCard>

      {/* ── Form intro section ─────────────────────────────────────────── */}
      <SCard
        title="Contact Page — Form Section"
        subtitle="Heading and description shown above the contact form"
        onSave={saveMeta}
        saving={savingMeta}
        status={statusMeta}
      >
        <div className="space-y-4">
          <AInput
            label="Section Heading"
            {...F("section_heading")}
            placeholder="Get In Touch"
          />
          <ATextarea
            label="Section Description"
            rows={4}
            {...F("section_description")}
            placeholder="Whether you're a property owner…"
          />
        </div>
      </SCard>
    </div>
  );
}
