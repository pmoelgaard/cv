import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ft-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      role="switch"
      class="ft-toggle-row"
      [attr.aria-checked]="checked()"
      (click)="checkedChange.emit(!checked())"
    >
      <span class="ft-toggle-label">{{ label() }}</span>
      <span class="ft-track" [class.on]="checked()" aria-hidden="true">
        <span class="ft-thumb"></span>
      </span>
    </button>
  `,
  styles: [`
    :host { display: block; }

    .ft-toggle-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.42rem 0.55rem;
      border: 1px solid var(--grid-line);
      border-radius: var(--radius, 6px);
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: border-color 0.18s ease, background-color 0.18s ease;
    }

    .ft-toggle-row:hover {
      border-color: var(--grid-strong);
      background: var(--bg-panel);
    }

    .ft-track {
      position: relative;
      width: 40px;
      height: 22px;
      border-radius: 3px;
      border: 1px solid var(--grid-strong);
      background: var(--bg-panel);
      flex: 0 0 auto;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .ft-track.on {
      background: var(--accent);
      border-color: var(--accent);
    }

    .ft-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      background: var(--text-primary);
      transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease;
    }

    .ft-track.on .ft-thumb {
      transform: translateX(18px);
      background: var(--accent-contrast);
    }
  `],
})
export class FtToggleComponent {
  readonly label = input.required<string>();
  readonly checked = input<boolean>(false);
  readonly checkedChange = output<boolean>();
}
