import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CAREER_ERAS, CV_PROFILE } from './core/data/cv.data';
import { EraId } from './core/models/cv.models';
import { UserPreferencesService } from './core/services/user-preferences.service';
import { PaiaFabComponent } from './shared/components/paia-fab/paia-fab.component';
import { PemoLogoComponent } from './shared/components/pemo-logo/pemo-logo.component';
import { PreferencesDrawerComponent } from './shared/components/preferences-drawer/preferences-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PemoLogoComponent,
    PaiaFabComponent,
    PreferencesDrawerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly prefs = inject(UserPreferencesService);
  readonly profile = CV_PROFILE;
  readonly eras = CAREER_ERAS;

  readonly drawerOpen = signal(false);
  readonly drawerSection = signal<'theme' | 'display' | 'explorer' | 'paia'>('theme');

  openDrawer(section: 'theme' | 'display' | 'explorer' | 'paia' = 'theme'): void {
    this.drawerSection.set(section);
    this.drawerOpen.set(true);
  }

  selectEraAndScroll(era: EraId): void {
    this.prefs.setSelectedEra(era);
    this.scrollToSection('experience');
  }

  scrollToSection(id: string): void {
    if (!this.isBrowser) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  printCv(): void {
    if (this.isBrowser) {
      window.print();
    }
  }
}
