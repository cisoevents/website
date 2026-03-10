﻿import { useState, useEffect, useCallback } from 'react';
import { Youtube, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Play, ListVideo } from 'lucide-react';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  publishedAt: string;
}

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const VIDEOS_PER_PAGE = 16;
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'https://backend-website-mu.vercel.app';

// Playlists that belong on the Podcasts page — hidden from Gallery tabs
const PODCAST_PLAYLIST_IDS = new Set([
  'PL7oYSEYWENY6HzHJECx0GNOCuH2YNCxqf', // Horizon Startup & Investor PodCast
  'PL7oYSEYWENY65aHxx_KoX0I9x_86xp-_w', // Horizon Summit AI, Cyber & FinTech
]);

// Exclude investor/startup/podcast videos from the Gallery — they belong on the Podcasts page
const GALLERY_EXCLUDE = /investor|startup|\bpodcast\b/i;

// â”€â”€ Hooks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useYouTubeVideos() {
  const [videos, setVideos]   = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/api/youtube/videos`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? 'Unknown error');
      setVideos(data.videos);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { videos, loading, error, refresh: load };
}

function usePlaylists() {
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/youtube/playlists`)
      .then(r => r.json())
      .then(data => { if (data.ok && data.playlists?.length) setPlaylists(data.playlists); })
      .catch(() => {/* silently ignore */});
  }, []);

  return playlists;
}

function usePlaylistVideos(playlistId: string | null) {
  const [videos, setVideos]   = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!playlistId) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/youtube/playlist/${playlistId}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setVideos(data.videos);
        else throw new Error(data.error ?? 'Unknown error');
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [playlistId]);

  return { videos, loading, error };
}

// â”€â”€ Embed Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VideoModal({ video, onClose }: { video: YouTubeVideo; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg leading-snug mb-1" style={{ color: 'var(--color-heading)' }}>{video.title}</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {new Date(video.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{ backgroundColor: '#FF0000', color: '#fff' }}
          >
            <Youtube size={15} /> Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Video Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VideoCard({ video, onClick }: { video: YouTubeVideo; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const thumb = imgErr
    ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
    : video.thumbnail;

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={thumb}
          alt={video.title}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: 'rgba(255,0,0,0.9)' }}
          >
            <Play size={22} className="text-white ml-1" fill="white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2">
          <span className="text-xs text-white font-semibold bg-black/70 px-1.5 py-0.5 rounded">
            {new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-sm leading-snug line-clamp-2 mb-1 transition-colors group-hover:text-blue-500"
          style={{ color: 'var(--color-heading)' }}
        >
          {video.title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{video.channelTitle}</p>
      </div>
    </button>
  );
}

// â”€â”€ Main Gallery Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Gallery() {
  const { videos: rawAllVideos, loading: allLoading, error: allError, refresh } = useYouTubeVideos();
  const playlists = usePlaylists();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const { videos: rawPlaylistVideos, loading: plLoading, error: plError } = usePlaylistVideos(selectedPlaylist);

  const [page, setPage]       = useState(1);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  // Strip podcast/investor content from gallery
  const allVideos     = rawAllVideos.filter(v => !GALLERY_EXCLUDE.test(v.title));
  const playlistVideos = rawPlaylistVideos.filter(v => !GALLERY_EXCLUDE.test(v.title));
  // Only show non-podcast playlists in tab filters
  const galleryPlaylists = playlists.filter(pl => !PODCAST_PLAYLIST_IDS.has(pl.id));

  const videos  = selectedPlaylist ? playlistVideos : allVideos;
  const loading = selectedPlaylist ? plLoading : allLoading;
  const error   = selectedPlaylist ? plError : allError;

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const paged      = videos.slice((page - 1) * VIDEOS_PER_PAGE, page * VIDEOS_PER_PAGE);

  const selectFilter = (id: string | null) => {
    setSelectedPlaylist(id);
    setPage(1);
  };

  return (
    <div className="pt-16" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Hero */}
      <div
        className="py-16 relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--page-hero-c1) 0%, var(--page-hero-c2) 55%, var(--page-hero-c3) 100%), url(https://i.pinimg.com/originals/5c/c6/2f/5cc62fdae848f7fde375a320265a1c9b.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-semibold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
            Media Gallery
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--color-heading)' }}>
            Video Gallery
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            Highlights, keynotes, panels, and networking moments from our cybersecurity and AI events worldwide.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

        {/* Channel header */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FF0000' }}>
            <Youtube size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>Horizon Summit</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {allVideos.length > 0 ? `${allVideos.length} videos` : 'Latest videos from our YouTube channel'}
              {rawAllVideos.length > allVideos.length && (
                <span className="ml-1 opacity-60">(filtered)</span>
              )}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-dim)', border: '1px solid var(--color-border)' }}
              title="Refresh"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
            >
              <RefreshCw size={14} className={allLoading ? 'animate-spin' : ''} />
            </button>
            <a
              href="https://www.youtube.com/@horizonsummit/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: '#FF0000', color: '#fff' }}
            >
              <ExternalLink size={12} /> View Channel
            </a>
          </div>
        </div>

        {/* Playlist filter tabs */}
        {galleryPlaylists.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => selectFilter(null)}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all"
              style={
                selectedPlaylist === null
                  ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                  : { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
              }
            >
              All Videos
              <span className="text-xs opacity-70">({allVideos.length})</span>
            </button>
            {galleryPlaylists.map(pl => (
              <button
                key={pl.id}
                onClick={() => selectFilter(pl.id)}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-all"
                style={
                  selectedPlaylist === pl.id
                    ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                    : { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
                }
                onMouseEnter={e => { if (selectedPlaylist !== pl.id) { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; } }}
                onMouseLeave={e => { if (selectedPlaylist !== pl.id) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; } }}
              >
                <ListVideo size={14} />
                {pl.title.length > 35 ? pl.title.substring(0, 35) + 'â€¦' : pl.title}
                <span className="text-xs opacity-70">({pl.itemCount})</span>
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            Could not load videos: {error}
            <button onClick={refresh} className="ml-3 underline">Retry</button>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ aspectRatio: '16/9', backgroundColor: 'var(--color-dark-bg)' }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-3 rounded w-2/3" style={{ backgroundColor: 'var(--color-border)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video grid */}
        {!loading && paged.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {paged.map(v => (
                <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = p === page;
                  const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  const showEllipsisBefore = p === page - 2 && page > 3;
                  const showEllipsisAfter  = p === page + 2 && page < totalPages - 2;
                  if (!show && !showEllipsisBefore && !showEllipsisAfter) return null;
                  if (showEllipsisBefore || showEllipsisAfter) {
                    return <span key={p} className="text-sm px-1" style={{ color: 'var(--color-text-dim)' }}>â€¦</span>;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                      style={isActive
                        ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                        : { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && !error && paged.length === 0 && (
          <div className="text-center py-20">
            <Youtube size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--color-text-dim)' }} />
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-muted)' }}>No videos found</p>
            <button onClick={refresh} className="mt-4 text-sm underline" style={{ color: 'var(--color-accent)' }}>Try again</button>
          </div>
        )}

      </div>

      {/* Video modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

    </div>
  );
}
