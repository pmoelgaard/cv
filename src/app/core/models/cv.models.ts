export type ThemeMode = 'system' | 'light' | 'dark' | 'jungle';
export type AccentColor = 'canopy' | 'vermilion' | 'cobalt' | 'ochre';
export type AnimationLevel = 'full' | 'subtle' | 'reduced';
export type FontScale = 'sm' | 'md' | 'lg';
export type EraId = 'all' | '2021-2026' | '2014-2020' | '2007-2013' | '1997-2006';

export interface UserPreferences {
  theme: ThemeMode;
  accent: AccentColor;
  animationLevel: AnimationLevel;
  fontScale: FontScale;
  showHud: boolean;
  compactMode: boolean;
  selectedEra: EraId;
}

export interface CareerRole {
  id: string;
  era: Exclude<EraId, 'all'>;
  timespan: string;
  startYear: number;
  endYear: number;
  title: string;
  company: string;
  location: string;
  annotation?: string;
  description: string[];
  tech: string[];
}

export interface TechTimelineItem {
  name: string;
  startYear: number;
  endYear: number;
  status: 'active' | 'legacy' | 'retired';
}

export interface TechTimelineGroup {
  category: string;
  items: TechTimelineItem[];
}

export interface EducationItem {
  year: string;
  title: string;
  institution: string;
  note?: string;
}

export interface PublicationItem {
  year: string;
  title: string;
  publisher: string;
  url: string;
}

export interface SpecialtyItem {
  title: string;
  detail: string;
}
