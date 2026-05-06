import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "../adminStore";

export default function AuthGuard({ children }) {
  const { isLoggedIn, authLoading } = useAppStore();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      // Preserve intended destination so we can redirect after login
      navigate("/admin/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isLoggedIn, authLoading, navigate, location]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">
            Verifying session…
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return children;
}