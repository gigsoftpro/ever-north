import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAppStore } from "./adminStore";

// ── Layout & shared ───────────────────────────────────────────────────────────
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SiteDataProvider } from "./components/SiteDataContext";

// ── Public pages ──────────────────────────────────────────────────────────────
import Home from "./pages/home/Home";
import AboutUs from "./pages/aboutus/AboutUs";
import ContactUs from "./pages/contact/ContactUs";
import OurServices from "./pages/services/OurServices";
import ServicePage from "./pages/services/ServicePage";
import Management from "./pages/management/management";
import AreaWeServe from "./pages/areaweserve/AreaWeServe";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";

function PublicLayout() {
  return (
    <SiteDataProvider>
      <Header />
      <Outlet />
      <Footer />
    </SiteDataProvider>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────────
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

// ── Route guards ──────────────────────────────────────────────────────────────
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
          <Route path="/area-we-cover" element={<AreaWeServe />} />

          <Route path="/our-services/:serviceType" element={<ServicePage />} />

          <Route
            path="/long-term-management"
            element={
              <Navigate to="/our-services/long-term-management" replace />
            }
          />
          <Route
            path="/short-term-management"
            element={
              <Navigate to="/our-services/short-term-management" replace />
            }
          />
          <Route
            path="/hybrid-management"
            element={<Navigate to="/our-services/hybrid-management" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Existing panels */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="content" element={<AdminDashboard />} />
          <Route path="contact" element={<AdminDashboard />} />
          <Route path="areaswecover" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminDashboard />} />
          <Route path="about" element={<AdminDashboard />} />
          <Route path="ourservices" element={<AdminDashboard />} />

          {/* NEW: dedicated service pages panel (Long-Term / Short-Term / Hybrid) */}
          <Route path="service-pages" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
