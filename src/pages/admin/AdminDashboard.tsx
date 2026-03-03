import { Link } from 'react-router-dom';
import { Calendar, Users, Mic, Award, TrendingUp, ArrowRight, type LucideIcon } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useApp } from '../../context/AppContext';
import { speakers, podcasts, sponsors } from '../../data/mockData';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  to: string;
}

function StatCard({ label, value, icon: Icon, color, to }: StatCardProps) {
  return (
    <Link to={to} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#4E7F90] transition-colors" />
      </div>
      <p className="text-3xl font-black text-[#1F2D3C] mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const { events } = useApp();
  const upcoming = events.filter(e => e.status === 'upcoming');
  const totalSponsors = Object.values(sponsors).flat().length;

  return (
    <AdminLayout breadcrumb="Dashboard">
      <div className="p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#1F2D3C]">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Events" value={events.length} icon={Calendar} color="bg-[#1F2D3C]" to="/admin/events" />
          <StatCard label="Speakers" value={speakers.length} icon={Users} color="bg-[#4E7F90]" to="/admin/speakers" />
          <StatCard label="Podcasts" value={podcasts.length} icon={Mic} color="bg-purple-500" to="/admin/podcasts" />
          <StatCard label="Sponsors" value={totalSponsors} icon={Award} color="bg-amber-500" to="/admin/sponsors" />
        </div>

        {/* Upcoming events table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#1F2D3C]">Upcoming Events</h2>
            <Link to="/admin/events" className="text-[#4E7F90] text-sm font-medium hover:underline flex items-center gap-1">
              Manage Events <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  {['Event', 'Date', 'Location', 'Attendees', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcoming.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#1F2D3C]">{ev.title}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{ev.location}</td>
                    <td className="px-6 py-4 text-gray-500">{ev.attendees}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Add New Event', to: '/admin/events/new', Icon: Calendar, desc: 'Create and publish an event' },
            { label: 'View Speakers', to: '/admin/speakers', Icon: Users, desc: 'Manage speaker roster' },
            { label: 'View Analytics', to: '/admin/dashboard', Icon: TrendingUp, desc: 'Track event performance' },
          ].map(({ label, to, Icon, desc }) => (
            <Link
              key={label}
              to={to}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-[#4E7F90] hover:shadow-sm transition-all group"
            >
              <Icon size={20} className="text-[#4E7F90] mb-3" />
              <p className="font-semibold text-[#1F2D3C] text-sm group-hover:text-[#4E7F90] transition-colors">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
