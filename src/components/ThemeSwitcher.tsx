import { useState, useEffect } from 'react';

const themes = [
  {
    id: 'a',
    label: 'Option A',
    name: 'Navy + Electric Blue',
    accent: '#00A8FF',
    bg: '#0A0E1A',
    desc: 'Industry-standard cybersecurity look',
  },
  {
    id: 'b',
    label: 'Option B',
    name: 'Charcoal + Gold',
    accent: '#C9A84C',
    bg: '#1C1C1E',
    desc: 'Premium private summit feel',
  },
  {
    id: 'c',
    label: 'Option C',
    name: 'Slate + Teal',
    accent: '#00BFA5',
    bg: '#0F2027',
    desc: 'Modern & fresh, stands out',
  },
];

export default function ThemeSwitcher() {
  const [active, setActive] = useState('a');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', active);
  }, [active]);

  // Set initial theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'a');
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-md border-b border-white/10" style={{ height: '52px' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <span className="text-white/70 text-sm font-medium hidden sm:block">
          Pick a color theme:
        </span>
        <div className="flex gap-2 flex-1 justify-center sm:justify-start">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActive(theme.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                active === theme.id
                  ? 'bg-white/15 ring-2 ring-white/40 text-white scale-105'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/90'
              }`}
            >
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.bg }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <span className="hidden md:inline">{theme.label}:</span>
              <span className="hidden lg:inline text-xs font-normal opacity-70">{theme.name}</span>
              <span className="md:hidden">{theme.label.replace('Option ', '')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
