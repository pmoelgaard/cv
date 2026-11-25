import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CAREER_ERAS,
  CAREER_ROLES,
  CV_PROFILE,
  EDUCATION_ITEMS,
  MEMBERSHIPS,
  PUBLICATIONS,
  SPECIALTIES,
  TECH_TIMELINE_GROUPS,
} from '../../core/data/cv.data';
import { EraId } from '../../core/models/cv.models';
import { SeoService } from '../../core/services/seo.service';
import { UserPreferencesService } from '../../core/services/user-preferences.service';

@Component({
  selector: 'app-dossier',
  standalone: true,
  templateUrl: './dossier.component.html',
  styleUrl: './dossier.component.scss',
})
export class DossierComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly prefs = inject(UserPreferencesService);

  readonly profile = CV_PROFILE;
  readonly eras = CAREER_ERAS;
  readonly techGroups = TECH_TIMELINE_GROUPS;
  readonly specialties = SPECIALTIES;
  readonly memberships = MEMBERSHIPS;
  readonly education = EDUCATION_ITEMS;
  readonly publications = PUBLICATIONS;

  readonly techStatusFilter = signal<'all' | 'active' | 'legacy' | 'retired'>('all');

  readonly filteredRoles = computed(() => {
    const era = this.prefs.selectedEra();
    if (era === 'all') return CAREER_ROLES;
    return CAREER_ROLES.filter((r) => r.era === era);
  });

  readonly filteredTechGroups = computed(() => {
    const status = this.techStatusFilter();
    if (status === 'all') return this.techGroups;
    return this.techGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.status === status),
      }))
      .filter((g) => g.items.length > 0);
  });

  ngOnInit(): void {
    this.seo.setCvMeta();
  }

  selectEra(era: EraId): void {
    this.prefs.setSelectedEra(era);
  }

  barLeftPct(startYear: number): number {
    const min = 1997;
    const max = 2026;
    return Math.max(0, ((startYear - min) / (max - min)) * 100);
  }

  barWidthPct(startYear: number, endYear: number): number {
    const min = 1997;
    const max = 2026;
    const span = Math.max(1, endYear - startYear);
    return Math.min(100 - this.barLeftPct(startYear), (span / (max - min)) * 100);
  }

  printCv(): void {
    if (this.isBrowser) {
      window.print();
    }
  }
}
