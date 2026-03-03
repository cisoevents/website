import { useState } from 'react';
import { Clock, MapPin, Download, CalendarPlus, Users } from 'lucide-react';
import { agendaItems, speakers } from '../data/mockData';

const trackColors = {
  AI: 'badge-ai',
  Cyber: 'badge-cyber',
  Startup: 'badge-startup',
};

const typeIcons = {
  keynote: '🎤',
  panel: '👥',
  workshop: '🛠',
  pitch: '🚀',
  fireside: '🔥',
  session: '💡',
};

function SessionCard({ item }) {
  const sessionSpeakers = speakers.filter(s => item.speakerIds.includes(s.id));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 flex gap-4 group">
      {/* Time column */}
      <div className="w-28 shrink-0 text-right hidden sm:block">
        <span className="text-[#1F2D3C] font-bold text-sm">{item.startTime}</span>
        <div className="text-gray-400 text-xs mt-0.5">to {item.endTime}</div>
      </div>

      {/* Divider line */}
      <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#4E7F90] border-2 border-white ring-2 ring-[#4E7F90]/30 mt-0.5" />
        <div className="w-0.5 flex-1 bg-gray-200" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile time */}
        <div className="sm:hidden flex items-center gap-2 text-gray-500 text-xs mb-2">
          <Clock size={12} />
          <span>{item.startTime} – {item.endTime}</span>
        </div>

        <div className="flex flex-wrap items-start gap-2 mb-2">
          <span className="text-lg" title={item.type}>{typeIcons[item.type] || '📋'}</span>
          <h3 className="font-bold text-[#1F2D3C] text-base leading-snug flex-1 group-hover:text-[#4E7F90] transition-colors">
            {item.title}
          </h3>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.description}</p>

        {/* Speakers */}
        <div className="flex flex-wrap gap-3 mb-3">
          {sessionSpeakers.map(sp => (
            <div key={sp.id} className="flex items-center gap-2">
              <img src={sp.photo} alt={sp.name} className="w-7 h-7 rounded-full object-cover border-2 border-gray-100" />
              <div>
                <span className="text-xs font-semibold text-gray-800">{sp.name}</span>
                <span className="text-gray-400 text-xs ml-1">· {sp.company}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={trackColors[item.track]}>{item.track} Track</span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={11} />
            <span>{item.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Agenda() {
  const [dayFilter, setDayFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');

  const tracks = ['all', 'AI', 'Cyber', 'Startup'];

  const filtered = agendaItems.filter(item => {
    const matchDay = dayFilter === 'all' || String(item.day) === dayFilter;
    const matchTrack = trackFilter === 'all' || item.track === trackFilter;
    return matchDay && matchTrack;
  });

  const day1 = filtered.filter(i => i.day === 1);
  const day2 = filtered.filter(i => i.day === 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F2D3C] pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#4E7F90] font-semibold text-sm uppercase tracking-widest mb-2">CISOevents 2026</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Event Agenda</h1>
          <p className="text-gray-400">August 28–29, 2026 · Metro Toronto Convention Centre</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex flex-wrap gap-4 items-center justify-between">
          {/* Day tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[['all', 'All Days'], ['1', 'Day 1 · Aug 28'], ['2', 'Day 2 · Aug 29']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setDayFilter(val)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  dayFilter === val ? 'bg-[#1F2D3C] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Track filter */}
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

          {/* Action buttons */}
          <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg hover:border-[#4E7F90] hover:text-[#4E7F90] transition-colors">
              <CalendarPlus size={14} /> Add to Calendar
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg hover:border-[#4E7F90] hover:text-[#4E7F90] transition-colors">
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs">
          {Object.entries(typeIcons).map(([type, icon]) => (
            <span key={type} className="flex items-center gap-1.5 text-gray-500 capitalize">
              <span>{icon}</span> {type}
            </span>
          ))}
        </div>

        {/* Sessions */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No sessions match your current filters.</p>
          </div>
        ) : (
          <>
            {(dayFilter === 'all' || dayFilter === '1') && day1.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-[#1F2D3C] mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#1F2D3C] text-white rounded-lg flex items-center justify-center text-sm font-black">1</span>
                  Day 1 — August 28, 2026
                </h2>
                <div className="flex flex-col gap-4">
                  {day1.map(item => <SessionCard key={item.id} item={item} />)}
                </div>
              </div>
            )}

            {(dayFilter === 'all' || dayFilter === '2') && day2.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#1F2D3C] mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#1F2D3C] text-white rounded-lg flex items-center justify-center text-sm font-black">2</span>
                  Day 2 — August 29, 2026
                </h2>
                <div className="flex flex-col gap-4">
                  {day2.map(item => <SessionCard key={item.id} item={item} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
