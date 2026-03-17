import { X, Linkedin, Building2, Briefcase } from 'lucide-react';
import type { Speaker } from '../types';

interface SpeakerModalProps {
  speaker: Speaker | null;
  onClose: () => void;
}

export default function SpeakerModal({ speaker, onClose }: SpeakerModalProps) {
  if (!speaker) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${speaker.name} — Speaker Bio`}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header strip */}
        <div className="bg-[#1F2D3C] px-6 py-5 flex items-start gap-4">
          <img
            src={speaker.photo}
            alt={speaker.name}
            className="w-20 h-20 rounded-full border-4 border-[#4E7F90] object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-xl leading-tight">{speaker.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Briefcase size={13} className="text-[#4E7F90]" />
              <span className="text-[#4E7F90] text-sm font-medium">{speaker.title}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 size={13} className="text-gray-400" />
              <span className="text-gray-400 text-sm">{speaker.company}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mt-0.5"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Biography</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{speaker.bio}</p>

          <div className="mt-5 flex items-center justify-between">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              speaker.track === 'AI' ? 'bg-purple-100 text-purple-700' :
              speaker.track === 'Startup' ? 'bg-orange-100 text-orange-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {speaker.track} Track
            </span>
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[#0077B5] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006399] transition-colors"
            >
              <Linkedin size={15} /> LinkedIn Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
