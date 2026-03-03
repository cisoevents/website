import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Calendar, Search, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useApp } from '../../context/AppContext';
import type { CisoEvent } from '../../types';

interface DeleteModalProps {
  event: CisoEvent;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ event, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Event?</h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          This will permanently delete "<strong>{event?.title}</strong>". This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEvents() {
  const { events, deleteEvent } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<CisoEvent | null>(null);

  const filtered = events.filter(ev => {
    const matchStatus = statusFilter === 'all' || ev.status === statusFilter;
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDelete = () => {
    if (deleteTarget) deleteEvent(deleteTarget.id);
    setDeleteTarget(null);
  };

  const statusBadge = {
    upcoming: 'bg-green-100 text-green-700',
    past: 'bg-gray-100 text-gray-600',
    draft: 'bg-yellow-100 text-yellow-700',
    archived: 'bg-red-100 text-red-700',
  };

  return (
    <AdminLayout breadcrumb="Events">
      <div className="p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#1F2D3C]">Events</h1>
            <p className="text-gray-500 text-sm mt-0.5">{events.length} total events</p>
          </div>
          <Link to="/admin/events/new" className="btn-navy flex items-center gap-2 text-sm">
            <Plus size={16} /> Add New Event
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              className="form-input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1">
            {['all', 'upcoming', 'past', 'draft'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === s ? 'bg-[#1F2D3C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No events found</p>
              <Link to="/admin/events/new" className="text-[#4E7F90] text-sm mt-2 inline-block hover:underline">
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Event Title', 'Date', 'Location', 'Attendees', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(ev => (
                    <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1F2D3C]">{ev.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{ev.year}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{ev.location}</td>
                      <td className="px-5 py-4 text-gray-600">{ev.attendees}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusBadge[ev.status] || statusBadge.draft}`}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/events/edit/${ev.id}`)}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#4E7F90] hover:text-[#4E7F90] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ev)}
                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteModal
          event={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AdminLayout>
  );
}
