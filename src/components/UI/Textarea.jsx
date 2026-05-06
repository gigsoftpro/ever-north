export function Textarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  className = "",
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm
          text-slate-800 placeholder-slate-400 resize-none outline-none transition-all
          focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 focus:bg-white"
      />
    </div>
  );
}
