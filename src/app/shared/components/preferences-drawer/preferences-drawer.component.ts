import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccentColor,
  AnimationLevel,
  EraId,
  FontScale,
  ThemeMode,
} from '../../../core/models/cv.models';
import { CAREER_ERAS, CV_PROFILE } from '../../../core/data/cv.data';
import { PaiaService } from '../../../core/services/paia.service';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';
import { FtToggleComponent } from '../ui/ft-toggle.component';

type StudioTab = 'theme' | 'display' | 'explorer' | 'paia';

interface ThemeCardDef {
  id: ThemeMode;
  label: string;
  tag: string;
  bg: string;
  surface: string;
  ink: string;
  accent: string;
  node: string;
  grid: string;
}

@Component({
  selector: 'app-preferences-drawer',
  standalone: true,
  imports: [FormsModule, FtToggleComponent],
  template: `
    @if (open) {
      <div class="studio-backdrop" (click)="closeDrawer()"></div>
      <aside class="studio-sidebar" role="dialog" aria-modal="true" aria-label="Studio Double Sidebar">
        <nav class="ds-rail" aria-label="Studio sections">
          <div class="ds-brand" title="Studio">
            <span class="ds-mark font-mono">ST</span>
          </div>

          <button
            type="button"
            class="ds-tab"
            [class.active]="activeTab() === 'theme'"
            (click)="setTab('theme')"
            title="Appearance &amp; Theme"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z" />
            </svg>
            <span>Theme</span>
          </button>

          <button
            type="button"
            class="ds-tab"
            [class.active]="activeTab() === 'display'"
            (click)="setTab('display')"
            title="Display &amp; Print"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Display</span>
          </button>

          <button
            type="button"
            class="ds-tab"
            [class.active]="activeTab() === 'explorer'"
            (click)="setTab('explorer')"
            title="Eras &amp; Export"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span>Dossier</span>
          </button>

          <button
            type="button"
            class="ds-tab"
            [class.active]="activeTab() === 'paia'"
            (click)="setTab('paia')"
            title="PAIA · Peter's AI Assistant"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3l2.1 6.4L20.5 11.5l-6.4 2.1L12 20l-2.1-6.4L3.5 11.5l6.4-2.1L12 3z" />
            </svg>
            <span>PAIA</span>
          </button>

          <div class="ds-rail-foot">
            <button type="button" class="ds-close font-mono" (click)="closeDrawer()" aria-label="Close Studio">✕</button>
          </div>
        </nav>

        <div class="ds-pane">
          <header class="studio-head">
            <div>
              <div class="studio-eyebrow font-mono">Studio · {{ activeTab() }}</div>
              <h2 class="studio-title font-display">{{ tabTitle() }}</h2>
            </div>
            <button type="button" class="close-btn font-mono" (click)="closeDrawer()" aria-label="Close Studio">✕</button>
          </header>

          <div class="ds-scroll">
            @if (activeTab() === 'theme') {
              <div class="ds-tab-panel">
                <section class="deck-section">
                  <div class="section-label">Theme spectrum · Hover to preview live</div>
                  <div class="ts-grid">
                    @for (t of themes; track t.id) {
                      <button
                        type="button"
                        class="ts-card"
                        [class.active]="prefs.theme() === t.id"
                        (mouseenter)="previewTheme(t.id)"
                        (mouseleave)="restoreTheme()"
                        (click)="selectTheme(t.id)"
                      >
                        <div class="mini-cockpit" [class.is-split]="t.id === 'system'" [style.background]="t.bg">
                          @if (t.id === 'system') {
                            <div class="split-dark" aria-hidden="true"></div>
                          }
                          <div class="mc-top" [style.border-color]="t.grid" [style.background]="t.surface">
                            <span class="mc-dot" [style.background]="t.accent"></span>
                            <span class="mc-bar-sm" [style.background]="t.ink"></span>
                          </div>
                          <div class="mc-mid">
                            <div class="mc-rail" [style.border-color]="t.grid" [style.background]="t.surface"></div>
                            <div class="mc-stage">
                              <div class="mc-copy">
                                <span class="mc-h1" [style.background]="t.ink"></span>
                                <span class="mc-h2" [style.background]="t.ink"></span>
                                <span class="mc-cta" [style.background]="t.accent"></span>
                              </div>
                            </div>
                            <div class="mc-rail" [style.border-color]="t.grid" [style.background]="t.surface"></div>
                          </div>
                          <div class="mc-bot" [style.border-color]="t.grid" [style.background]="t.surface">
                            <span class="mc-pulse" [style.background]="t.accent"></span>
                          </div>
                        </div>

                        <div class="ts-card-meta font-mono">
                          <span class="ts-card-name">{{ t.label }}</span>
                          <span class="ts-card-tag">{{ prefs.theme() === t.id ? 'ACTIVE' : t.tag }}</span>
                        </div>
                      </button>
                    }
                  </div>
                </section>

                <section class="deck-section">
                  <div class="section-label">Accent frequency</div>
                  <div class="segmented-track cols-2">
                    @for (a of accents; track a.id) {
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="prefs.accent() === a.id"
                        (click)="selectAccent(a.id)"
                      >
                        <span class="swatch" [style.background]="a.color"></span>
                        <span>{{ a.label }}</span>
                      </button>
                    }
                  </div>
                </section>
              </div>
            }

            @if (activeTab() === 'display') {
              <div class="ds-tab-panel">
                <section class="deck-section">
                  <div class="section-label">Motion &amp; layout</div>
                  <div class="segmented-track cols-3">
                    @for (m of motionLevels; track m.id) {
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="prefs.animationLevel() === m.id"
                        (click)="selectMotion(m.id)"
                      >
                        {{ m.label }}
                      </button>
                    }
                  </div>
                  <div class="toggle-pair">
                    <app-ft-toggle
                      label="Compact role cards"
                      [checked]="prefs.compactMode()"
                      (checkedChange)="prefs.setCompactMode($event)"
                    />
                    <app-ft-toggle
                      label="Bottom status bar"
                      [checked]="prefs.showHud()"
                      (checkedChange)="prefs.setShowHud($event)"
                    />
                  </div>
                </section>

                <section class="deck-section">
                  <div class="section-label">Reading typography</div>
                  <div class="segmented-track cols-3">
                    @for (f of fontScales; track f.id) {
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="prefs.fontScale() === f.id"
                        (click)="prefs.setFontScale(f.id)"
                      >
                        {{ f.label }}
                      </button>
                    }
                  </div>
                </section>

                <section class="deck-section">
                  <button type="button" class="action-btn danger" (click)="prefs.resetAll()">Reset preferences</button>
                </section>
              </div>
            }

            @if (activeTab() === 'explorer') {
              <div class="ds-tab-panel">
                <section class="deck-section">
                  <div class="section-label">Filter by career era</div>
                  <div class="era-list">
                    @for (era of eras; track era.id) {
                      <button
                        type="button"
                        class="era-btn"
                        [class.active]="prefs.selectedEra() === era.id"
                        (click)="selectEra(era.id)"
                      >
                        <span class="font-mono">{{ era.label }}</span>
                        <span class="era-sub">{{ era.short }}</span>
                      </button>
                    }
                  </div>
                </section>

                <section class="deck-section">
                  <div class="section-label">Export &amp; Ecosystem</div>
                  <div class="action-stack">
                    <button type="button" class="action-btn primary" (click)="triggerPrint()">Print / Export PDF</button>
                    <a class="action-btn" [href]="profile.legacyPdfUrl" target="_blank" rel="noopener">Legacy 2022 PDF ↗</a>
                    <a class="action-btn" [href]="profile.forwardThinkingUrl" target="_blank" rel="noopener">Forward Thinking (640 Essays) ↗</a>
                    <a class="action-btn" [href]="profile.contactHubUrl" target="_blank" rel="noopener">Contact Hub (9 Channels) ↗</a>
                  </div>
                </section>
              </div>
            }

            @if (activeTab() === 'paia') {
              <div class="ds-tab-panel paia-panel">
                <div class="paia-feed">
                  @for (msg of paia.messages(); track msg.id) {
                    <div class="paia-msg" [class.from-user]="msg.sender === 'user'">
                      <div class="paia-who font-mono">{{ msg.sender === 'paia' ? 'PAIA' : 'YOU' }}</div>
                      <div class="paia-bubble">
                        <p>{{ msg.text }}</p>
                        @if (msg.roles && msg.roles.length > 0) {
                          <div class="paia-roles">
                            @for (role of msg.roles; track role.id) {
                              <div class="paia-role-card">
                                <span class="font-mono">{{ role.timespan }}</span>
                                <strong>{{ role.title }} · {{ role.company }}</strong>
                                <small>{{ role.location }}</small>
                              </div>
                            }
                          </div>
                        }
                        @if (msg.actions && msg.actions.length > 0) {
                          <div class="paia-actions">
                            @for (act of msg.actions; track act.label) {
                              <a class="paia-act-btn font-mono" [href]="act.url" target="_blank" rel="noopener">{{ act.label }} ↗</a>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  }
                  @if (paia.typing()) {
                    <div class="paia-msg">
                      <div class="paia-who font-mono">PAIA</div>
                      <div class="paia-bubble font-mono">Indexing dossier…</div>
                    </div>
                  }
                </div>

                <div class="paia-prompts">
                  @for (p of quickPrompts; track p) {
                    <button type="button" class="prompt-chip font-mono" (click)="askPaia(p)">{{ p }}</button>
                  }
                </div>

                <form class="paia-form" (ngSubmit)="submitPaia()">
                  <input
                    type="text"
                    name="paiaQuery"
                    [(ngModel)]="paiaInput"
                    placeholder="Ask about Angular, CTO roles, SatCom, MSc..."
                    autocomplete="off"
                  />
                  <button type="submit" class="btn btn-primary">Ask</button>
                </form>
              </div>
            }
          </div>
        </div>
      </aside>
    }
  `,
  styles: [`
    .studio-backdrop {
      position: fixed;
      inset: 0;
      z-index: 900;
      background: rgba(10, 14, 12, 0.54);
      backdrop-filter: blur(4px);
    }

    .studio-sidebar {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(460px, 100vw);
      z-index: 950;
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      background: var(--bg-surface);
      border-left: 1px solid var(--grid-strong);
      box-shadow: var(--shadow-popover);
    }

    .ds-rail {
      display: flex;
      flex-direction: column;
      background: var(--bg-panel);
      border-right: 1px solid var(--grid-line);
    }

    .ds-brand {
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--grid-line);
    }

    .ds-mark {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 0.08em;
    }

    .ds-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.28rem;
      padding: 0.85rem 0.25rem;
      border: 0;
      border-bottom: 1px solid var(--grid-line);
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.66rem;
      font-weight: 600;
    }

    .ds-tab svg { width: 18px; height: 18px; }

    .ds-tab:hover,
    .ds-tab.active {
      background: var(--bg-surface);
      color: var(--accent);
      box-shadow: inset 3px 0 0 var(--accent);
    }

    .ds-rail-foot {
      margin-top: auto;
      padding: 0.75rem;
      display: flex;
      justify-content: center;
    }

    .ds-close,
    .close-btn {
      width: 32px;
      height: 32px;
      border: 1px solid var(--grid-strong);
      border-radius: var(--radius);
      background: var(--bg-surface);
      color: var(--text-primary);
      cursor: pointer;
    }

    .ds-pane {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .studio-head {
      height: 54px;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--grid-line);
    }

    .studio-eyebrow {
      font-size: 0.66rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }

    .studio-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .ds-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .ds-tab-panel {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .section-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 0.55rem;
    }

    .ts-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.65rem;
    }

    .ts-card {
      padding: 0.45rem;
      border: 1px solid var(--grid-line);
      border-radius: var(--radius);
      background: var(--bg-base);
      cursor: pointer;
      text-align: left;
      transition: border-color 0.18s ease, transform 0.18s ease;
    }

    .ts-card:hover,
    .ts-card.active {
      border-color: var(--accent);
    }

    .mini-cockpit {
      position: relative;
      height: 64px;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(128, 128, 128, 0.2);
    }

    .split-dark {
      position: absolute;
      inset: 0 0 0 50%;
      background: #131518;
      opacity: 0.85;
    }

    .mc-top, .mc-bot {
      position: relative;
      z-index: 1;
      height: 11px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 5px;
      border-bottom: 1px solid;
    }

    .mc-bot { border-bottom: 0; border-top: 1px solid; }
    .mc-dot, .mc-pulse { width: 5px; height: 5px; border-radius: 99px; }
    .mc-bar-sm { width: 18px; height: 2px; opacity: 0.6; }

    .mc-mid {
      position: relative;
      z-index: 1;
      flex: 1;
      display: grid;
      grid-template-columns: 8px 1fr 8px;
    }

    .mc-rail { border-right: 1px solid; }
    .mc-rail:last-child { border-right: 0; border-left: 1px solid; }
    .mc-stage { padding: 6px; display: flex; align-items: center; }
    .mc-copy { display: flex; flex-direction: column; gap: 3px; width: 70%; }
    .mc-h1 { height: 4px; width: 90%; opacity: 0.85; }
    .mc-h2 { height: 3px; width: 65%; opacity: 0.5; }
    .mc-cta { height: 5px; width: 32%; margin-top: 2px; }

    .ts-card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.4rem;
      font-size: 0.68rem;
      color: var(--text-primary);
    }

    .ts-card-tag { color: var(--accent); font-size: 0.62rem; }

    .segmented-track {
      display: grid;
      gap: 0.45rem;
    }

    .cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

    .seg-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.5rem 0.6rem;
      border: 1px solid var(--grid-line);
      border-radius: var(--radius);
      background: var(--bg-base);
      color: var(--text-secondary);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }

    .seg-btn.active,
    .seg-btn:hover {
      border-color: var(--accent);
      background: var(--accent-soft);
      color: var(--text-primary);
    }

    .swatch { width: 10px; height: 10px; border-radius: 2px; }

    .toggle-pair {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.65rem;
    }

    .era-list, .action-stack {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }

    .era-btn, .action-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--grid-line);
      border-radius: var(--radius);
      background: var(--bg-base);
      color: var(--text-primary);
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: none;
    }

    .era-btn.active,
    .era-btn:hover,
    .action-btn:hover {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .action-btn.primary {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--accent-contrast);
      font-weight: 600;
    }

    .action-btn.danger {
      color: var(--terracotta);
      border-color: color-mix(in srgb, var(--terracotta) 40%, var(--grid-line));
    }

    .era-sub { font-size: 0.74rem; color: var(--text-muted); }

    .paia-panel { min-height: 100%; }

    .paia-feed {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .paia-msg {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .paia-msg.from-user { align-items: flex-end; }

    .paia-who {
      font-size: 0.64rem;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .paia-bubble {
      max-width: 92%;
      padding: 0.65rem 0.8rem;
      border: 1px solid var(--grid-line);
      border-radius: var(--radius);
      background: var(--bg-base);
      font-size: 0.84rem;
      line-height: 1.5;
    }

    .paia-msg.from-user .paia-bubble {
      background: var(--accent-soft);
      border-color: var(--accent);
    }

    .paia-bubble p { margin: 0; }

    .paia-roles {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 0.55rem;
    }

    .paia-role-card {
      display: flex;
      flex-direction: column;
      padding: 0.45rem 0.55rem;
      border-left: 2px solid var(--accent);
      background: var(--bg-surface);
      font-size: 0.76rem;
    }

    .paia-role-card span { font-size: 0.68rem; color: var(--text-muted); }
    .paia-role-card small { color: var(--text-secondary); }

    .paia-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.55rem;
    }

    .paia-act-btn {
      padding: 0.28rem 0.55rem;
      border: 1px solid var(--grid-strong);
      border-radius: var(--radius);
      font-size: 0.68rem;
      color: var(--accent);
      background: var(--bg-surface);
    }

    .paia-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .prompt-chip {
      padding: 0.3rem 0.55rem;
      border: 1px solid var(--grid-line);
      border-radius: var(--radius);
      background: var(--bg-panel);
      color: var(--text-secondary);
      font-size: 0.68rem;
      cursor: pointer;
    }

    .prompt-chip:hover { border-color: var(--accent); color: var(--text-primary); }

    .paia-form {
      display: flex;
      gap: 0.45rem;
    }

    .paia-form input {
      flex: 1;
      min-width: 0;
      padding: 0.55rem 0.7rem;
      border: 1px solid var(--grid-strong);
      border-radius: var(--radius);
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 0.84rem;
    }
  `],
})
export class PreferencesDrawerComponent {
  @Input() open = false;
  @Input() set initialSection(val: StudioTab) {
    if (val) this.activeTab.set(val);
  }
  @Output() close = new EventEmitter<void>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly prefs = inject(UserPreferencesService);
  readonly paia = inject(PaiaService);

  readonly activeTab = signal<StudioTab>('theme');
  readonly eras = CAREER_ERAS;
  readonly profile = CV_PROFILE;
  paiaInput = '';

  readonly quickPrompts = [
    'CTO & Founder roles',
    'SatCom & Aviation',
    'Angular & TypeScript',
    'Education & MSc',
    'How to contact Peter?',
  ];

  readonly themes: ThemeCardDef[] = [
    { id: 'system', label: 'System', tag: 'AUTO', bg: '#f6f4f0', surface: '#fbfaf7', ink: '#1c1d1b', accent: '#3d6356', node: '#9e6248', grid: 'rgba(28,29,27,0.14)' },
    { id: 'light', label: 'Light', tag: 'PAPER', bg: '#f6f4f0', surface: '#fbfaf7', ink: '#1c1d1b', accent: '#3d6356', node: '#9e6248', grid: 'rgba(28,29,27,0.14)' },
    { id: 'jungle', label: 'Jungle', tag: 'CANOPY', bg: '#edf1ed', surface: '#f4f7f4', ink: '#1a241f', accent: '#2f5a4a', node: '#965d45', grid: 'rgba(26,36,31,0.16)' },
    { id: 'dark', label: 'Dark', tag: 'SPACE', bg: '#131518', surface: '#191c20', ink: '#e8e6e1', accent: '#6fa18e', node: '#c28a70', grid: 'rgba(232,230,225,0.14)' },
  ];

  readonly accents: { id: AccentColor; label: string; color: string }[] = [
    { id: 'canopy', label: 'Canopy', color: '#3d6356' },
    { id: 'vermilion', label: 'Vermilion', color: '#9e6248' },
    { id: 'cobalt', label: 'Cobalt', color: '#3b5573' },
    { id: 'ochre', label: 'Ochre', color: '#9a7b3e' },
  ];

  readonly motionLevels: { id: AnimationLevel; label: string }[] = [
    { id: 'full', label: 'Full' },
    { id: 'subtle', label: 'Subtle' },
    { id: 'reduced', label: 'Reduced' },
  ];

  readonly fontScales: { id: FontScale; label: string }[] = [
    { id: 'sm', label: 'Compact' },
    { id: 'md', label: 'Standard' },
    { id: 'lg', label: 'Large' },
  ];

  readonly tabTitle = computed(() => {
    switch (this.activeTab()) {
      case 'theme':
        return 'Theme & Accent';
      case 'display':
        return 'Display & Typography';
      case 'explorer':
        return 'Dossier & Export';
      case 'paia':
        return 'PAIA · AI Assistant';
    }
  });

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) this.closeDrawer();
  }

  setTab(tab: StudioTab): void {
    this.activeTab.set(tab);
  }

  previewTheme(mode: ThemeMode): void {
    if (!this.isBrowser) return;
    const resolved =
      mode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : mode;
    document.documentElement.setAttribute('data-theme', resolved);
  }

  restoreTheme(): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('data-theme', this.prefs.resolvedTheme());
  }

  selectTheme(mode: ThemeMode): void {
    this.prefs.setTheme(mode);
  }

  selectAccent(accent: AccentColor): void {
    this.prefs.setAccent(accent);
  }

  selectMotion(level: AnimationLevel): void {
    this.prefs.setAnimationLevel(level);
  }

  selectEra(era: EraId): void {
    this.prefs.setSelectedEra(era);
  }

  triggerPrint(): void {
    this.closeDrawer();
    if (this.isBrowser) {
      setTimeout(() => window.print(), 120);
    }
  }

  askPaia(prompt: string): void {
    this.paia.ask(prompt);
  }

  submitPaia(): void {
    if (!this.paiaInput.trim()) return;
    this.paia.ask(this.paiaInput);
    this.paiaInput = '';
  }

  closeDrawer(): void {
    this.restoreTheme();
    this.close.emit();
  }
}
