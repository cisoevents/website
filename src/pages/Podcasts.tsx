import { Play, Eye, Clock, ExternalLink } from 'lucide-react';
import { podcasts } from '../data/mockData';

function PodcastCard({ pod, featured }) {
  if (featured) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
        <div className="grid md:grid-cols-2">
          <div className="relative bg-gray-900 min-h-[280px]">
            <img src={pod.thumbnail} alt={pod.title} className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={`https://www.youtube.com/watch?v=${pod.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="w-20 h-20 bg-[#4E7F90] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                <Play size={32} fill="white" className="text-white ml-2" />
              </a>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Featured</span>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2 text-white text-xs">
              <span className="bg-black/60 px-2 py-1 rounded flex items-center gap-1">
                <Clock size={11} /> {pod.duration}
              </span>
              <span className="bg-black/60 px-2 py-1 rounded flex items-center gap-1">
                <Eye size={11} /> {pod.views}
              </span>
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-[#4E7F90] text-xs font-bold uppercase tracking-widest mb-3">Latest Episode</span>
            <h2 className="text-2xl font-bold text-[#1F2D3C] mb-4 leading-snug">{pod.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{pod.description}</p>
            <a
              href={`https://www.youtube.com/watch?v=${pod.youtubeId}`}
              target="_blank"
              rel="noreferrer"
              className="btn-cyan inline-flex items-center gap-2 self-start"
            >
              <Play size={16} fill="white" /> Watch Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden group">
      <div className="relative bg-gray-900 overflow-hidden h-44">
        <img
          src={pod.thumbnail}
          alt={pod.title}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#4E7F90] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Play size={18} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            <Clock size={10} /> {pod.duration}
          </span>
          <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            <Eye size={10} /> {pod.views}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#1F2D3C] text-sm leading-snug mb-2 group-hover:text-[#4E7F90] transition-colors line-clamp-2">
          {pod.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{pod.description}</p>
        <a
          href={`https://www.youtube.com/watch?v=${pod.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 btn-navy w-full text-xs py-2.5"
        >
          <ExternalLink size={13} /> Watch on YouTube
        </a>
      </div>
    </div>
  );
}

export default function Podcasts() {
  const featured = podcasts.find(p => p.featured);
  const rest = podcasts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F2D3C] pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#4E7F90] font-semibold text-sm uppercase tracking-widest mb-2">On-Demand</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">CISOevents Podcasts</h1>
          <p className="text-gray-400 text-lg">Deep-dive conversations with security leaders and innovators.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {featured && <PodcastCard pod={featured} featured />}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1F2D3C]">All Episodes</h2>
          <p className="text-gray-500 text-sm">{rest.length} episodes available</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(pod => (
            <PodcastCard key={pod.id} pod={pod} />
          ))}
        </div>
      </div>
    </div>
  );
}
