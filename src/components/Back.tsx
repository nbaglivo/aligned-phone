import { Chevron } from './Icons'

/** The back control doubles as the clock, so the time is always on screen. */
export function Back({ time, onClick, label = 'Back to home' }: { time: string; onClick: () => void; label?: string }) {
  return (
    <button className="back mono" onClick={onClick} aria-label={`${label}, ${time}`}>
      <Chevron />
      <span>{time}</span>
    </button>
  )
}
