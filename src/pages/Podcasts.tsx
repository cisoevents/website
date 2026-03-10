import { useState, useEffect } from 'react';
import { Play, ExternalLink, Youtube, Mic, Loader, ListVideo, PlayCircle, RefreshCw } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'https://backend-website-mu.vercel.app';

// Hardcoded fallback in case API key is not set
const FALLBACK_PLAYLISTS = [
  {
    id: 'PL7oYSEYWENY6HzHJECx0GNOCuH2YNCxqf',
    title: 'Startup & Investor Podcast',
    description: 'Founders, investors and operators share what it really takes to build in cybersecurity.',
    thumbnail: '',
    itemCount: 0,
    publishedAt: '',
  },
  {
    id: 'PL7oYSEYWENY65aHxx_KoX0I9x_86xp-_w',
    title: 'Horizon Summit Series',
    description: 'In-depth conversations recorded live at the Horizon Summit gatherings.',
    thumbnail: '',
    itemCount: 0,
    publishedAt: '',
  },
];

interface YTPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  publishedAt: string;
}

interface YTVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

// Dynamically fetch all playlists from the channel (YouTube Data API v3)
function usePlaylists() {
  const [playlists, setPlaylists] = useState<YTPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/youtube/podcasts`)
      .then(r => r.json())
      .then((d: { ok: boolean; playlists?: YTPlaylist[] }) => {
        const list = d.ok && d.playlists?.length ? d.playlists : FALLBACK_PLAYLISTS;
        setPlaylists(list);
      })
      .catch(() => setPlaylists(FALLBACK_PLAYLISTS))
      .finally(() => setLoading(false));
  }, []);

  return { playlists, loading };
}

function usePlaylistVideos(playlistId: string) {
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE}/api/youtube/playlist/${playlistId}`)
      .then(r => r.json())
      .then((d: { ok: boolean; videos?: YTVideo[]; error?: string }) => {
        if (!d.ok) throw new Error(d.error ?? 'Failed to load');
        setVideos(d.videos ?? []);
      })
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false));
  }, [playlistId]);

  return { videos, loading, error };
}

// Single row in the episode queue
function QueueRow({ video, index, active, onClick }: {
  video: YTVideo;
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
      style={{
        backgroundColor: active ? 'var(--color-accent-10)' : 'transparent',
        border: active ? '1px solid var(--color-accent-30)' : '1px solid transparent',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {/* Index / play indicator */}
      <div className="shrink-0 w-6 text-center">
        {active
          ? <PlayCircle size={16} style={{ color: 'var(--color-accent)' }} className="mx-auto" />
          : <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>{index + 1}</span>
        }
      </div>

      {/* Thumbnail */}
      <div className="relative shrink-0 w-24 h-[54px] rounded overflow-hidden bg-black">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
              <Play size={11} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Title + date */}
      <div className="min-w-0 flex-1">
        <p
          className="text-xs font-semibold leading-snug line-clamp-2"
          style={{ color: active ? 'var(--color-accent)' : 'var(--color-heading)' }}
        >
          {video.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
          {new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </button>
  );
}

// Playlist panel - YouTube-style split layout
function PlaylistPanel({
  playlistId,
  playlistLabel,
  description,
}: {
  playlistId: string;
  playlistLabel: string;
  description: string;
}) {
  const { videos, loading, error } = usePlaylistVideos(playlistId);
  const [selected, setSelected] = useState(0);

  // Reset selection when playlist changes
  useEffect(() => { setSelected(0); }, [playlistId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading episodes...</p>
      </div>
    );
  }

  if (error || videos.length === 0) {
    const ytPlaylistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    return (
      <div className="text-center py-24">
        <Youtube size={36} className="mx-auto mb-4 opacity-40" style={{ color: 'var(--color-text-muted)' }} />
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-heading)' }}>
          {error ? 'Could not load episodes' : `No episodes cached for "${playlistLabel}"`}
        </p>
        <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
          {error
            ? 'The video feed is temporarily unavailable.'
            : 'A YouTube API key is needed to load individual playlist videos.'}
        </p>
        <a
          href={ytPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
        >
          <Youtube size={15} /> Watch on YouTube
        </a>
      </div>
    );
  }

  const current = videos[selected];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* Left: Player + info */}
      <div className="w-full lg:flex-1 lg:sticky lg:top-28">
        {/* Video thumbnail - click to open on YouTube */}
        <a
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full aspect-video rounded-2xl overflow-hidden bg-black mb-4"
        >
          <img
            src={current.thumbnail}
            alt={current.title}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <Play size={26} fill="white" className="text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-12 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-xs font-mono opacity-70">EP {String(selected + 1).padStart(2, '0')}</p>
            <p className="text-white font-bold text-sm leading-snug line-clamp-2">{current.title}</p>
          </div>
        </a>

        {/* Playlist meta */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--color-accent-10)' }}>
              <ListVideo size={18} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-snug" style={{ color: 'var(--color-heading)' }}>{playlistLabel}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>{videos.length} episodes</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>{description}</p>
          <a
            href={`https://www.youtube.com/playlist?list=${playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg w-full justify-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
          >
            <Youtube size={14} /> Open Full Playlist on YouTube
          </a>
        </div>
      </div>

      {/* Right: Episode queue */}
      <div
        className="w-full lg:w-80 xl:w-96 rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        {/* Queue header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <ListVideo size={15} style={{ color: 'var(--color-accent)' }} />
            <span className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>Queue</span>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>
            {selected + 1} / {videos.length}
          </span>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto max-h-[70vh] p-2 space-y-0.5">
          {videos.map((v, i) => (
            <QueueRow
              key={v.id}
              video={v}
              index={i}
              active={i === selected}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>

        {/* Footer: open selected on YouTube */}
        <div className="border-t px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
          <a
            href={current.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg w-full transition-colors"
            style={{ color: 'var(--color-accent)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-10)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ExternalLink size={13} /> Watch EP {String(selected + 1).padStart(2, '0')} on YouTube
          </a>
        </div>
      </div>

    </div>
  );
}

// Main Page
export default function Podcasts() {
  const [activeTab, setActiveTab] = useState(0);
  const { playlists, loading: playlistsLoading } = usePlaylists();

  // Reset to first tab whenever the playlist list changes
  useEffect(() => { setActiveTab(0); }, [playlists]);

  const active = playlists[activeTab];

  return (
    <>
      {/* Hero */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>
                On-Demand
              </p>
              <h1 className="section-title mb-3">CISOevents Podcasts</h1>
              <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
                Deep-dive conversations with security leaders, founders and innovators.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@horizonsummit/podcasts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg shrink-0 transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              <Mic size={15} style={{ color: 'var(--color-accent)' }} /> View on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* TODO: Playlist tabs — re-enable once YOUTUBE_API_KEY is set on Vercel.
           Without a key the /api/youtube/podcasts endpoint returns fallback stubs
           and /api/youtube/playlist/:id returns empty, so the tabs are useless for now. */}
      {false && (
      <section className="sticky top-16 z-30 border-b" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {playlistsLoading ? (
            <div className="flex items-center gap-2 py-4 px-1">
              <RefreshCw size={14} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading playlists…</span>
            </div>
          ) : (
            <div className="flex gap-0 overflow-x-auto">
              {playlists.map((pl, i) => (
                <button
                  key={pl.id}
                  onClick={() => setActiveTab(i)}
                  className="shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap"
                  style={{
                    borderColor: activeTab === i ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === i ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  }}
                >
                  {pl.title}
                  {pl.itemCount > 0 && (
                    <span className="ml-1.5 text-xs opacity-60">({pl.itemCount})</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Content */}
      <section className="py-10" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {active && (
            <PlaylistPanel
              key={active.id}
              playlistId={active.id}
              playlistLabel={active.title}
              description={active.description}
            />
          )}
        </div>
      </section>
    </>
  );
}