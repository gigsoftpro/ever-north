import { useState, useRef } from "react";
import { Upload, RefreshCw, Trash2 } from "lucide-react";
import { getIn, setIn } from "./adminUtils";
import { Badge } from "../UI/Badge";
import { Card } from "../UI/Card";
import { BaseUrl } from "../Config/BaseUrl";

const IMAGE_FIELDS = [
  ["images.heroBg", "Hero Background"],
  ["images.aboutMain", "About Image"],
  ["images.service1", "Service Card 1"],
  ["images.service2", "Service Card 2"],
  ["images.service3", "Service Card 3"],
  ["images.headerBg", "Header Background"],
  ["images.footerLogo", "Footer Logo"],
];

export { IMAGE_FIELDS };

// ── Single image slot ─────────────────────────────────────────────────────────
function ImageSlot({ label, value, onFile, onClear }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile({ target: { files: [file] } });
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
        dragging
          ? "border-amber-400 shadow-md shadow-amber-200"
          : value
            ? "border-slate-100"
            : "border-dashed border-slate-200 hover:border-amber-300"
      }`}
    >
      {value ? (
        /* ── Filled slot ── */
        <div className="relative group">
          <img src={value} alt={label} className="w-full h-36 object-cover" />
          {/* Hover actions overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <RefreshCw size={12} />
              Replace
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>
          {/* Label bar */}
          <div className="px-3 py-2.5 bg-white border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {label}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Hover to replace or remove
            </p>
          </div>
        </div>
      ) : (
        /* ── Empty slot ── */
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center h-36 cursor-pointer group bg-slate-50 hover:bg-amber-50/50 transition-colors"
        >
          <div className="p-3 rounded-xl bg-slate-200 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-600 transition-all mb-2">
            <Upload size={18} />
          </div>
          <p className="text-xs font-semibold text-slate-600">{label}</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Click or drag & drop
          </p>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
}

// ── ImageEditor ───────────────────────────────────────────────────────────────
export default function ImageEditor({ draft, setDraft }) {
  const handleFile = (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((prev) => setIn(prev, path, reader.result));
    reader.readAsDataURL(file);
  };

  const handleClear = (path) => {
    setDraft((prev) => setIn(prev, path, ""));
  };

  const filledCount = IMAGE_FIELDS.filter(([p]) => !!getIn(draft, p)).length;

  return (
    <Card>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="font-semibold text-slate-900">Media Vault</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage images across your site
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="green">{filledCount} uploaded</Badge>
          <Badge variant="amber">{IMAGE_FIELDS.length} total</Badge>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {IMAGE_FIELDS.map(([path, label]) => (
          <ImageSlot
            key={path}
            label={label}
            value={getIn(draft, path)}
            onFile={(e) => handleFile(e, path)}
            onClear={() => handleClear(path)}
          />
        ))}
      </div>
    </Card>
  );
}
