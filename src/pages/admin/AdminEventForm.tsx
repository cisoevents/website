import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useApp } from '../../context/AppContext';

type FormState = {
  title: string; year: string; startDate: string; endDate: string;
  location: string; description: string; image: string; status: string;
  attendees: string; tags: string;
};

const EMPTY: FormState = {
  title: '', year: '2026', startDate: '', endDate: '',
  location: '', description: '', image: '', status: 'draft',
  attendees: '', tags: '',
};

export default function AdminEventForm() {
  const { id } = useParams<{ id: string }>();
  const { events, addEvent, updateEvent } = useApp();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const ev = events.find(e => String(e.id) === id);
      if (ev) {
        setForm({
          ...ev,
          tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : ev.tags || '',
        });
      }
    }
  }, [id, events, isEdit]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      ...form,
      year: Number(form.year),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: form.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    };
    setTimeout(() => {
      if (isEdit) updateEvent(Number(id), payload);
      else addEvent(payload);
      navigate('/admin/events');
    }, 500);
  };

  const field = (key: keyof FormState, val: string) => setForm(p => ({ ...p, [key]: val }));

  const F = ({ label, name, children, required }: { label: string; name: string; children: ReactNode; required?: boolean }) => (
    <div>
      <label className="form-label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <AdminLayout breadcrumb={isEdit ? 'Edit Event' : 'New Event'}>
      <div className="p-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/admin/events')} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1F2D3C] hover:text-[#1F2D3C] transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#1F2D3C]">{isEdit ? 'Edit Event' : 'Add New Event'}</h1>
            <p className="text-gray-500 text-sm">{isEdit ? 'Update event details below.' : 'Fill in the details to create a new event.'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 space-y-5">
          <F label="Event Title" name="title" required>
            <input
              type="text"
              value={form.title}
              onChange={e => field('title', e.target.value)}
              className={`form-input ${errors.title ? 'border-red-400' : ''}`}
              placeholder="e.g. CISOevents 2026"
            />
          </F>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <F label="Year" name="year">
              <select value={form.year} onChange={e => field('year', e.target.value)} className="form-input">
                {['2024', '2025', '2026', '2027'].map(y => <option key={y}>{y}</option>)}
              </select>
            </F>
            <F label="Start Date" name="startDate" required>
              <input
                type="date"
                value={form.startDate}
                onChange={e => field('startDate', e.target.value)}
                className={`form-input ${errors.startDate ? 'border-red-400' : ''}`}
              />
            </F>
            <F label="End Date" name="endDate">
              <input
                type="date"
                value={form.endDate}
                onChange={e => field('endDate', e.target.value)}
                className="form-input"
              />
            </F>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <F label="Location" name="location" required>
              <input
                type="text"
                value={form.location}
                onChange={e => field('location', e.target.value)}
                className={`form-input ${errors.location ? 'border-red-400' : ''}`}
                placeholder="e.g. Toronto, Canada"
              />
            </F>
            <F label="Expected Attendees" name="attendees">
              <input
                type="text"
                value={form.attendees}
                onChange={e => field('attendees', e.target.value)}
                className="form-input"
                placeholder="e.g. 500+"
              />
            </F>
          </div>

          <F label="Description" name="description" required>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => field('description', e.target.value)}
              className={`form-input resize-none ${errors.description ? 'border-red-400' : ''}`}
              placeholder="Describe the event..."
            />
          </F>

          <F label="Tags (comma-separated)" name="tags">
            <input
              type="text"
              value={form.tags}
              onChange={e => field('tags', e.target.value)}
              className="form-input"
              placeholder="Cybersecurity, AI, Leadership"
            />
          </F>

          <F label="Image URL" name="image">
            <div className="flex gap-3">
              <input
                type="url"
                value={form.image}
                onChange={e => field('image', e.target.value)}
                className="form-input flex-1"
                placeholder="https://..."
              />
              <button type="button" className="shrink-0 border border-gray-200 rounded-lg px-4 py-2 text-gray-500 hover:border-[#4E7F90] hover:text-[#4E7F90] text-sm flex items-center gap-2 transition-colors">
                <Upload size={14} /> Upload
              </button>
            </div>
          </F>

          <F label="Status" name="status">
            <select value={form.status} onChange={e => field('status', e.target.value)} className="form-input">
              <option value="draft">Draft</option>
              <option value="upcoming">Published (Upcoming)</option>
              <option value="past">Past</option>
              <option value="archived">Archived</option>
            </select>
          </F>

          {/* Preview image */}
          {form.image && (
            <div>
              <p className="form-label">Image Preview</p>
              <img src={form.image} alt="preview" className="w-full h-36 object-cover rounded-xl border border-gray-100" />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-navy flex items-center gap-2 text-sm px-6 py-2.5 disabled:opacity-60"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={15} /> {isEdit ? 'Save Changes' : 'Create Event'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
