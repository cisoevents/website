// Simple placeholder pages for sidebar items not yet built out
import AdminLayout from '../../components/admin/AdminLayout';
import { speakers } from '../../data/mockData';
import { agendaItems } from '../../data/mockData';
import { podcasts } from '../../data/mockData';
import { sponsors } from '../../data/mockData';
import { Linkedin } from 'lucide-react';

export function AdminSpeakers() {
  return (
    <AdminLayout breadcrumb="Speakers">
      <div className="p-6 max-w-7xl">
        <h1 className="text-2xl font-black text-[#1F2D3C] mb-6">Speakers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {speakers.map(sp => (
            <div key={sp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
              <img src={sp.photo} alt={sp.name} className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 mx-auto mb-3" />
              <p className="font-bold text-[#1F2D3C] text-sm">{sp.name}</p>
              <p className="text-gray-500 text-xs">{sp.title}</p>
              <p className="text-[#4E7F90] text-xs font-medium">{sp.company}</p>
              <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                sp.track === 'AI' ? 'bg-purple-100 text-purple-700' :
                sp.track === 'Startup' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>{sp.track}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminAgenda() {
  return (
    <AdminLayout breadcrumb="Agenda">
      <div className="p-6 max-w-5xl">
        <h1 className="text-2xl font-black text-[#1F2D3C] mb-6">Agenda Items</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Day', 'Time', 'Title', 'Track', 'Location'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agendaItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-gray-500">Day {item.day}</td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{item.startTime}</td>
                  <td className="px-5 py-3 font-medium text-[#1F2D3C]">{item.title}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.track === 'AI' ? 'bg-purple-100 text-purple-700' :
                      item.track === 'Startup' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{item.track}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminPodcasts() {
  return (
    <AdminLayout breadcrumb="Podcasts">
      <div className="p-6 max-w-7xl">
        <h1 className="text-2xl font-black text-[#1F2D3C] mb-6">Podcasts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {podcasts.map(pod => (
            <div key={pod.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <img src={pod.thumbnail} alt={pod.title} className="w-full h-36 object-cover" />
              <div className="p-4">
                <p className="font-bold text-[#1F2D3C] text-sm line-clamp-2 mb-1">{pod.title}</p>
                <p className="text-gray-400 text-xs">{pod.duration} · {pod.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminSponsors() {
  const tiers = [
    { name: 'Platinum', items: sponsors.platinum, color: 'bg-gray-900 text-white' },
    { name: 'Gold', items: sponsors.gold, color: 'bg-amber-500 text-white' },
    { name: 'Silver', items: sponsors.silver, color: 'bg-gray-400 text-white' },
  ];
  return (
    <AdminLayout breadcrumb="Sponsors">
      <div className="p-6 max-w-5xl">
        <h1 className="text-2xl font-black text-[#1F2D3C] mb-6">Sponsors</h1>
        {tiers.map(({ name, items, color }) => (
          <div key={name} className="mb-8">
            <h2 className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${color}`}>{name}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map(sp => (
                <div key={sp.id} className="bg-white border border-gray-200 rounded-xl p-5 text-center font-bold text-[#1F2D3C] hover:border-[#4E7F90] transition-colors">
                  {sp.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
