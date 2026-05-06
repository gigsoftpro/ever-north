export function StatCard({ label, value, icon: Icon, trend, color = "amber" }) {
  const palette = {
    amber: {
      wrap: "from-amber-500/10 to-amber-400/5",
      icon: "bg-amber-100 text-amber-600",
      trend: "text-amber-600",
    },
    blue: {
      wrap: "from-blue-500/10 to-blue-400/5",
      icon: "bg-blue-100 text-blue-600",
      trend: "text-blue-600",
    },
    green: {
      wrap: "from-emerald-500/10 to-emerald-400/5",
      icon: "bg-emerald-100 text-emerald-600",
      trend: "text-emerald-600",
    },
    violet: {
      wrap: "from-violet-500/10 to-violet-400/5",
      icon: "bg-violet-100 text-violet-600",
      trend: "text-violet-600",
    },
  };
  const c = palette[color] ?? palette.amber;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br ${c.wrap} p-5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-1 leading-none">
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-1.5 font-medium ${c.trend}`}>{trend}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl flex-shrink-0 ${c.icon}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
