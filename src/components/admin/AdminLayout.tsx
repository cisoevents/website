import { useState, ReactNode } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, List, Mic, Award,
  LogOut, Shield, Menu, X, ChevronRight, ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumb?: string;
}

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', Icon: LayoutDashboard },
  { label: 'Events', to: '/admin/events', Icon: Calendar },
  { label: 'Speakers', to: '/admin/speakers', Icon: Users },
  { label: 'Agenda', to: '/admin/agenda', Icon: List },
  { label: 'Podcasts', to: '/admin/podcasts', Icon: Mic },
  { label: 'Sponsors', to: '/admin/sponsors', Icon: Award },
];

export default function AdminLayout({ children, breadcrumb }: AdminLayoutProps) {
  const { adminUser, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#4E7F90] rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">CISOevents</span>
            <span className="block text-gray-400 text-xs">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#4E7F90] text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all"
        >
          <ExternalLink size={17} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 text-sm rounded-xl hover:bg-white/10 transition-all"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 xl:w-64 bg-[#1F2D3C] flex-col shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-[#1F2D3C] flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center gap-4 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-gray-400 min-w-0">
            <Link to="/admin/dashboard" className="hover:text-gray-700 transition-colors shrink-0">Admin</Link>
            {breadcrumb && (
              <>
                <ChevronRight size={14} className="shrink-0" />
                <span className="text-gray-700 font-medium truncate">{breadcrumb}</span>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">{adminUser?.username}</p>
              <p className="text-xs text-gray-400 capitalize">{adminUser?.role}</p>
            </div>
            <div className="w-8 h-8 bg-[#1F2D3C] rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
