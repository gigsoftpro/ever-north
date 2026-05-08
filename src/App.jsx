import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAppStore } from "./adminStore";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/home/Home";
import AboutUs from "./pages/aboutus/AboutUs";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/contact/ContactUs";
import OurServices from "./pages/services/OurServices";
import { SiteDataProvider } from "./components/SiteDataContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Management from "./pages/management/management";

function PublicLayout() {
  return (
    <SiteDataProvider>
      <Header />
      <Outlet />
      <Footer />
    </SiteDataProvider>
  );
}

function SessionLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-11 h-11 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium tracking-wide">
        Verifying session…
      </p>
    </div>
  );
}

function ProtectedRoute() {
  const { isLoggedIn, authLoading } = useAppStore();
  const location = useLocation();

  if (authLoading) return <SessionLoader />;

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  );
}

function GuestRoute() {
  const { isLoggedIn, authLoading } = useAppStore();

  if (authLoading) return <SessionLoader />;

  return isLoggedIn ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/our-services" element={<OurServices />} />
          <Route path="/properties" element={<Home />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/property-management" element={<Management />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="content" element={<AdminDashboard />} />
          <Route path="images" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
