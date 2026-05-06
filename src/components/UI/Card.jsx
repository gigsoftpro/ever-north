export function Card({ children, className = "", noPadding = false }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${
        noPadding ? "" : "p-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
