import Header from "./components/Header";
import Home from "./pages/home/Home";
import Footer from "./components/Footer";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { useAppStore } from "./adminStore.jsx";

const App = () => {
  const { isLoggedIn } = useAppStore();
  const isAdmin = window.location.pathname.startsWith("/admin");

  if (window.location.pathname === "/admin/login") return <AdminLogin />;
  if (isAdmin) return isLoggedIn ? <AdminDashboard /> : <AdminLogin />;

  return (
    <div>
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
