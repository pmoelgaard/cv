import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AccentColor,
  AnimationLevel,
  EraId,
  FontScale,
  ThemeMode,
  UserPreferences,
} from '../models/cv.models';

const STORAGE_KEY = 'cv_user_prefs_v1';

const DEFAULT_PREFS: UserPreferences = {
  theme: 'system',
  accent: 'canopy',
  animationLevel: 'full',
  fontScale: 'md',
  showHud: true,
  compactMode: false,
  selectedEra: 'all',
};

@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly systemPrefersDark = signal(false);

  private readonly state = signal<UserPreferences>(this.loadInitial());

  readonly prefs = this.state.asReadonly();
  readonly theme = computed(() => this.state().theme);
  readonly resolvedTheme = computed<'light' | 'dark' | 'jungle'>(() => {
    const mode = this.state().theme;
    if (mode === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return mode;
  });
  readonly accent = computed(() => this.state().accent);
  readonly animationLevel = computed(() => this.state().animationLevel);
  readonly fontScale = computed(() => this.state().fontScale);
  readonly showHud = computed(() => this.state().showHud);
  readonly compactMode = computed(() => this.state().compactMode);
  readonly selectedEra = computed(() => this.state().selectedEra);

  constructor() {
    if (this.isBrowser && typeof window.matchMedia === 'function') {
      const mqlDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPrefersDark.set(mqlDark.matches);
      mqlDark.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));

      const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mqlMotion.matches && !localStorage.getItem(STORAGE_KEY)) {
        this.state.update((s) => ({ ...s, animationLevel: 'reduced' }));
      }
    }

    effect(() => {
      const current = this.state();
      const resolved = this.resolvedTheme();
      if (!this.isBrowser) return;

      const root = document.documentElement;
      root.setAttribute('data-theme', resolved);
      root.setAttribute('data-accent', current.accent);
      root.setAttribute('data-motion', current.animationLevel);
      root.setAttribute('data-font-scale', current.fontScale);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        // Ignore quota / private browsing storage errors
      }
    });
  }

  private loadInitial(): UserPreferences {
    if (!this.isBrowser) return { ...DEFAULT_PREFS };
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('ft_user_prefs_v1');
      if (!raw) return { ...DEFAULT_PREFS };
      const parsed = JSON.parse(raw);
      const legacyThemeMap: Record<string, ThemeMode> = { aurora: 'jungle' };
      const legacyAccentMap: Record<string, AccentColor> = {
        cyan: 'canopy',
        emerald: 'canopy',
        indigo: 'cobalt',
        amber: 'ochre',
      };
      const theme: ThemeMode = legacyThemeMap[parsed.theme] || parsed.theme || 'system';
      const accent: AccentColor = legacyAccentMap[parsed.accent] || parsed.accent || 'canopy';
      return {
        ...DEFAULT_PREFS,
        theme: ['system', 'light', 'dark', 'jungle'].includes(theme) ? theme : 'system',
        accent: ['canopy', 'vermilion', 'cobalt', 'ochre'].includes(accent) ? accent : 'canopy',
        animationLevel: ['full', 'subtle', 'reduced'].includes(parsed.animationLevel)
          ? parsed.animationLevel
          : 'full',
        fontScale: ['sm', 'md', 'lg'].includes(parsed.fontScale) ? parsed.fontScale : 'md',
        showHud: typeof parsed.showHud === 'boolean' ? parsed.showHud : true,
        compactMode: typeof parsed.compactMode === 'boolean' ? parsed.compactMode : false,
        selectedEra: ['all', '2021-2026', '2014-2020', '2007-2013', '1997-2006'].includes(
          parsed.selectedEra
        )
          ? parsed.selectedEra
          : 'all',
      };
    } catch {
      return { ...DEFAULT_PREFS };
    }
  }

  setTheme(theme: ThemeMode): void {
    this.state.update((s) => ({ ...s, theme }));
  }

  setAccent(accent: AccentColor): void {
    this.state.update((s) => ({ ...s, accent }));
  }

  setAnimationLevel(animationLevel: AnimationLevel): void {
    this.state.update((s) => ({ ...s, animationLevel }));
  }

  setFontScale(fontScale: FontScale): void {
    this.state.update((s) => ({ ...s, fontScale }));
  }

  setShowHud(showHud: boolean): void {
    this.state.update((s) => ({ ...s, showHud }));
  }

  setCompactMode(compactMode: boolean): void {
    this.state.update((s) => ({ ...s, compactMode }));
  }

  setSelectedEra(selectedEra: EraId): void {
    this.state.update((s) => ({ ...s, selectedEra }));
  }

  resetAll(): void {
    this.state.set({ ...DEFAULT_PREFS });
  }
}
