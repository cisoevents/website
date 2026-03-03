export interface CisoEvent {
  id: number;
  title: string;
  year: number;
  startDate: string;
  endDate: string;
  location: string;
  attendees: string;
  status: 'upcoming' | 'past' | 'draft' | 'archived';
  description: string;
  image: string;
  tags: string[];
}

export interface Speaker {
  id: number;
  name: string;
  title: string;
  company: string;
  bio: string;
  photo: string;
  linkedin: string;
  sessions: number[];
  track: 'Cyber' | 'AI' | 'Startup';
}

export interface AgendaItem {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speakerIds: number[];
  track: 'Cyber' | 'AI' | 'Startup';
  location: string;
  type: string;
}

export interface Podcast {
  id: number;
  title: string;
  description: string;
  duration: string;
  views: string;
  thumbnail: string;
  youtubeId: string;
  date: string;
  featured: boolean;
}

export interface Sponsor {
  id: number;
  name: string;
  logo: string | null;
  url: string;
}

export interface Sponsors {
  platinum: Sponsor[];
  gold: Sponsor[];
  silver: Sponsor[];
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}

export interface AppToast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface AdminUser {
  username: string;
  role: string;
}
