export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  icon: Icon,
  disabled = false,
  type = "button",
}) {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-900/20 hover:brightness-110 active:scale-[0.97]",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.97]",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.97]",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 active:scale-[0.97]",
    danger:
      "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-[0.97]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 13 : size === "lg" ? 17 : 15} />}
      {children}
    </button>
  );
}
