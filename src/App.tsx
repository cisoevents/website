import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CalendlyModal from './components/CalendlyModal';
import RegisterModal from './components/RegisterModal';

// Public pages
import Home from './pages/Home';
import Events from './pages/Events';
import Speakers from './pages/Speakers';
import Gallery from './pages/Gallery';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Podcasts from './pages/Podcasts';

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
function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{
        backgroundColor: '#dc2626',
        color: '#fff',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        position: 'relative',
        zIndex: 9999,
      }}>
        This site is currently under construction. Please contact admin for more information.
      </div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Guard for admin routes
function RequireAuth({ children }: { children: ReactNode }) {
  const { adminUser } = useApp();
  if (!adminUser) return <Navigate to="/admin" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
      <Route path="/speakers" element={<PublicLayout><Speakers /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/podcasts" element={<PublicLayout><Podcasts /></PublicLayout>} />

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
        <CalendlyModal />
        <RegisterModal />
      </AppProvider>
    </BrowserRouter>
  );
}
