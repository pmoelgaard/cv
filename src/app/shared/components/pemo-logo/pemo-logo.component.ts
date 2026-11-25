import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pemo-logo',
  standalone: true,
  template: `
    @if (variant() === 'horizontal') {
      <svg class="pemo-svg horizontal" viewBox="0 0 156 36" fill="none" aria-label="PEMO">
        <defs>
          <linearGradient id="pemoGradH" x1="0" y1="0" x2="156" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="var(--text-primary)" />
            <stop offset="100%" stop-color="var(--accent)" />
          </linearGradient>
        </defs>
        <path d="M1 9V2H8 M148 2H155V9 M155 27V34H148 M8 34H1V27" stroke="var(--grid-strong)" stroke-width="1.2" />
        <path d="M14 27V9H27L31 13V17L27 21H17" stroke="url(#pemoGradH)" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter" />
        <path d="M50 9H67 M50 18H63 M50 27H67" stroke="url(#pemoGradH)" stroke-width="2.2" stroke-linecap="square" />
        <line x1="50" y1="9" x2="50" y2="27" stroke="url(#pemoGradH)" stroke-width="2.2" stroke-linecap="square" />
        <path d="M86 27V9L96.5 21L107 9V27" stroke="url(#pemoGradH)" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter" />
        <circle cx="133" cy="18" r="9" stroke="url(#pemoGradH)" stroke-width="2.2" />
        <circle cx="139.5" cy="11.5" r="2.2" fill="var(--terracotta)" />
      </svg>
    } @else {
      <svg class="pemo-svg monogram" viewBox="0 0 120 120" fill="none" aria-label="PEMO Monogram">
        <defs>
          <linearGradient id="pemoGradM" x1="12" y1="12" x2="108" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="var(--text-primary)" />
            <stop offset="100%" stop-color="var(--accent)" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="108" height="108" stroke="var(--grid-strong)" stroke-width="1.2" />
        <line x1="60" y1="6" x2="60" y2="114" stroke="var(--grid-line)" stroke-width="1" />
        <line x1="6" y1="60" x2="114" y2="60" stroke="var(--grid-line)" stroke-width="1" />
        <path d="M2 14V2H14 M106 2H118V14 M118 106V118H106 M14 118H2V106" stroke="var(--accent)" stroke-width="1.4" />
        <path d="M24 47V21H40L44 25V31L40 35H28" stroke="url(#pemoGradM)" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter" />
        <path d="M74 21H94 M74 34H89 M74 47H94" stroke="url(#pemoGradM)" stroke-width="3.2" stroke-linecap="square" />
        <line x1="74" y1="21" x2="74" y2="47" stroke="url(#pemoGradM)" stroke-width="3.2" stroke-linecap="square" />
        <path d="M21 98V72L33.5 87L46 72V98" stroke="url(#pemoGradM)" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter" />
        <circle cx="84" cy="85" r="13" stroke="url(#pemoGradM)" stroke-width="3.2" />
        <circle cx="93.5" cy="75.5" r="3" fill="var(--terracotta)" />
      </svg>
    }
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; }
    .pemo-svg.horizontal { width: 118px; height: 28px; display: block; }
    .pemo-svg.monogram { width: 100%; height: 100%; display: block; }
  `],
})
export class PemoLogoComponent {
  readonly variant = input<'horizontal' | 'monogram'>('horizontal');
}
