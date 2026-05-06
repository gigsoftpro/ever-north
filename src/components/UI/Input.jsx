export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  rightElement,
  className = "",
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={14} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-800
            placeholder-slate-400 transition-all outline-none
            focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 focus:bg-white
            ${Icon ? "pl-9 pr-3" : "px-3"}
            ${rightElement ? "pr-10" : ""}`}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
    </div>
  );
}
