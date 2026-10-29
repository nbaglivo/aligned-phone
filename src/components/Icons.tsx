// Thin stroke icons, drawn to match the line illustrations on nbaglivo.dev.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth={1.2} {...base}>
    <path d="M10 3 L5 8 L10 13" />
  </svg>
)

export const Play = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" strokeWidth={1.2} {...base}>
    <path d="M8 4.5 L17 11 L8 17.5 Z" />
  </svg>
)

export const Pause = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" strokeWidth={1.4} {...base}>
    <path d="M8 5 V17 M14 5 V17" />
  </svg>
)

export const Prev = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" strokeWidth={1.2} {...base}>
    <path d="M17 4 L7 11 L17 18 Z" />
    <path d="M5 4 V18" />
  </svg>
)

export const Next = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" strokeWidth={1.2} {...base}>
    <path d="M5 4 L15 11 L5 18 Z" />
    <path d="M17 4 V18" />
  </svg>
)

export const Backspace = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" strokeWidth={1.1} {...base}>
    <path d="M7 1 H20 V15 H7 L1 8 Z" />
    <path d="M11 5 L16 11 M16 5 L11 11" />
  </svg>
)

export const Squiggle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 326 40" strokeWidth={1} {...base}>
    <path d="M2 30 C 40 30, 52 12, 92 14 S 150 34, 196 26 S 270 6, 324 18" />
    <circle cx="196" cy="26" r="2.5" />
  </svg>
)
