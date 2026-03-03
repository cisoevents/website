import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Public pages
import Home from './pages/Home';
import Events from './pages/Events';
import Speakers from './pages/Speakers';
import Gallery from './pages/Gallery';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventForm from './pages/admin/AdminEventForm';
import {
  AdminSpeakers,
  AdminAgenda,
  AdminPodcasts,
  AdminSponsors,
} from './pages/admin/AdminSimple';

// Public layout wrapper (Navbar + Footer)
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Guard for admin routes
function RequireAuth({ children }) {
  const { adminUser } = useApp();
  if (!adminUser) return <Navigate to="/admin" replace />;
  return children;
}

function LumaInit() {
  const location = useLocation();
  useEffect(() => {
    // Re-initialize Luma checkout buttons after every React navigation
    if (window.luma) {
      window.luma.initCheckout();
    }
  }, [location.pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <LumaInit />
      <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
      <Route path="/speakers" element={<PublicLayout><Speakers /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/events" element={<RequireAuth><AdminEvents /></RequireAuth>} />
      <Route path="/admin/events/new" element={<RequireAuth><AdminEventForm /></RequireAuth>} />
      <Route path="/admin/events/edit/:id" element={<RequireAuth><AdminEventForm /></RequireAuth>} />
      <Route path="/admin/speakers" element={<RequireAuth><AdminSpeakers /></RequireAuth>} />
      <Route path="/admin/agenda" element={<RequireAuth><AdminAgenda /></RequireAuth>} />
      <Route path="/admin/podcasts" element={<RequireAuth><AdminPodcasts /></RequireAuth>} />
      <Route path="/admin/sponsors" element={<RequireAuth><AdminSponsors /></RequireAuth>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toast />
      </AppProvider>
    </BrowserRouter>
  );
}
