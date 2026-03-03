import { useState } from 'react';
import { Search, Linkedin, ChevronRight } from 'lucide-react';
import { speakers } from '../data/mockData';
import SpeakerModal from '../components/SpeakerModal';
import type { Speaker } from '../types';

export default function Speakers() {
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [selected, setSelected] = useState<Speaker | null>(null);

  const tracks = ['all', 'AI', 'Cyber', 'Startup'];

  const filtered = speakers.filter(sp => {
    const matchTrack = trackFilter === 'all' || sp.track === trackFilter;
    const q = search.toLowerCase();
    const matchSearch = sp.name.toLowerCase().includes(q) ||
      sp.company.toLowerCase().includes(q) ||
      sp.title.toLowerCase().includes(q);
    return matchTrack && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F2D3C] pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#4E7F90] font-semibold text-sm uppercase tracking-widest mb-2">CISOevents 2026</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Meet Our Speakers</h1>
          <p className="text-gray-400 text-lg">World-class practitioners, innovators, and executives.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search speakers by name, title, company..."
              className="form-input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1">
            {tracks.map(t => (
              <button
                key={t}
                onClick={() => setTrackFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  trackFilter === t
                    ? t === 'AI' ? 'bg-purple-500 text-white'
                      : t === 'Cyber' ? 'bg-blue-500 text-white'
                      : t === 'Startup' ? 'bg-orange-500 text-white'
                      : 'bg-[#1F2D3C] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t === 'all' ? 'All Tracks' : t}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-400">{filtered.length} speaker{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No speakers found</h3>
            <p className="text-gray-400 text-sm">Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(sp => (
              <div
                key={sp.id}
                className="card p-6 text-center group cursor-pointer"
                onClick={() => setSelected(sp as Speaker)}
              >
                <div className="relative mx-auto mb-4 w-24 h-24">
                  <img
                    src={sp.photo}
                    alt={sp.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 group-hover:border-[#4E7F90] transition-all duration-300"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold ${
                    sp.track === 'AI' ? 'bg-purple-500' :
                    sp.track === 'Startup' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {sp.track[0]}
                  </div>
                </div>

                <h3 className="font-bold text-[#1F2D3C] text-sm leading-tight group-hover:text-[#4E7F90] transition-colors">{sp.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{sp.title}</p>
                <p className="text-[#4E7F90] text-xs font-semibold mt-0.5 mb-4">{sp.company}</p>

                <div className="flex gap-2 justify-center">
                  <a
                    href={sp.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="w-8 h-8 bg-[#0077B5] text-white rounded-lg flex items-center justify-center hover:bg-[#006399] transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                  <button
                    className="flex-1 text-xs font-semibold text-[#1F2D3C] border border-[#1F2D3C] rounded-lg hover:bg-[#1F2D3C] hover:text-white transition-all py-1.5 flex items-center justify-center gap-1"
                  >
                    View Bio <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
