import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../adminStore";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors ${className}`}
    >
      <LogOut size={15} />
      Sign out
    </button>
  );
}
