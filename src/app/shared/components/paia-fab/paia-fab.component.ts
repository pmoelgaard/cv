import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paia-fab',
  standalone: true,
  template: `
    @if (!hidden) {
      <button
        type="button"
        class="paia-fab"
        (click)="activate.emit()"
        aria-label="Open PAIA, Peter's AI Assistant"
        title="Ask PAIA · Peter's AI Assistant"
      >
        <span class="fab-aura" aria-hidden="true"></span>
        <span class="fab-ring" aria-hidden="true"></span>
        <span class="fab-core">
          <span class="fab-sheen" aria-hidden="true"></span>
          <svg viewBox="0 0 24 24" class="fab-star" aria-hidden="true">
            <path
              class="star-main"
              fill="currentColor"
              d="M12 2.5 14.3 9.7 21.5 12l-7.2 2.3L12 21.5l-2.3-7.2L2.5 12l7.2-2.3L12 2.5Z"
            />
            <circle class="star-spark s1" cx="19" cy="5.5" r="1.25" fill="currentColor" />
            <circle class="star-spark s2" cx="5.2" cy="18.6" r="1" fill="currentColor" />
          </svg>
          <span class="fab-label font-mono">Ask PAIA</span>
        </span>
      </button>
    }
  `,
  styles: [`
    .paia-fab {
      position: fixed;
      right: 12px;
      bottom: 10px;
      z-index: 600;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .paia-fab:hover {
      transform: translateY(-2px) scale(1.03);
    }

    .paia-fab:active {
      transform: translateY(0) scale(0.98);
    }

    .fab-aura {
      position: absolute;
      inset: -6px;
      border-radius: 999px;
      background: radial-gradient(circle, color-mix(in srgb, var(--accent) 42%, transparent) 0%, transparent 70%);
      filter: blur(8px);
      opacity: 0.65;
      animation: fabBreathe 4s ease-in-out infinite;
      pointer-events: none;
    }

    .fab-ring {
      position: absolute;
      inset: -2px;
      border-radius: 999px;
      padding: 2px;
      background: conic-gradient(
        from 0deg,
        var(--accent),
        var(--space),
        var(--ochre),
        var(--accent)
      );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: fabOrbit 8s linear infinite;
      pointer-events: none;
    }

    .fab-core {
      position: relative;
      height: 48px;
      min-width: 48px;
      padding: 0 14px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--bg-surface) 90%, var(--accent) 10%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--grid-strong));
      box-shadow: 0 10px 26px -8px rgba(0, 0, 0, 0.45);
      color: var(--accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      overflow: hidden;
      transition: gap 220ms cubic-bezier(0.22, 1, 0.36, 1), padding 220ms cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms ease;
    }

    .fab-sheen {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        transparent 25%,
        color-mix(in srgb, var(--accent) 26%, #ffffff 18%) 50%,
        transparent 75%
      );
      transform: translateX(-130%);
      transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
      pointer-events: none;
    }

    .paia-fab:hover .fab-sheen {
      transform: translateX(130%);
    }

    .fab-star {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .paia-fab:hover .fab-star {
      transform: rotate(15deg) scale(1.08);
    }

    .star-spark.s1 {
      animation: fabTwinkle 3.2s ease-in-out infinite;
    }

    .star-spark.s2 {
      animation: fabTwinkle 3.2s ease-in-out 1.4s infinite;
    }

    .fab-label {
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      white-space: nowrap;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: var(--text-primary);
      transition: max-width 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
    }

    .paia-fab:hover .fab-core,
    .paia-fab:focus-visible .fab-core {
      gap: 0.48rem;
      padding: 0 16px;
      background: color-mix(in srgb, var(--bg-surface) 84%, var(--accent) 16%);
    }

    .paia-fab:hover .fab-label,
    .paia-fab:focus-visible .fab-label {
      max-width: 84px;
      opacity: 1;
    }

    @keyframes fabOrbit {
      to { transform: rotate(360deg); }
    }

    @keyframes fabBreathe {
      0%, 100% { transform: scale(0.96); opacity: 0.5; }
      50% { transform: scale(1.08); opacity: 0.85; }
    }

    @keyframes fabTwinkle {
      0%, 100% { opacity: 0.25; transform: scale(0.8); transform-origin: center; }
      50% { opacity: 1; transform: scale(1.2); transform-origin: center; }
    }

    @media (prefers-reduced-motion: reduce) {
      .fab-aura,
      .fab-ring,
      .star-spark.s1,
      .star-spark.s2 {
        animation: none;
      }
      .fab-sheen {
        display: none;
      }
    }
  `],
})
export class PaiaFabComponent {
  @Input() hidden = false;
  @Output() activate = new EventEmitter<void>();
}
