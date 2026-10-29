import type { AppProps } from '../App'
import { Back } from '../components/Back'
import { articles } from '../data/seed'

const meta = (minutes: number | null, progress?: number) => {
  if (minutes === null) return 'saved · [reading time]'
  if (progress) return `continue · ${Math.round(minutes * (1 - progress))} min left`
  return `saved · ${minutes} min`
}

export function Read({ time, onExit }: AppProps) {
  return (
    <div className="screen">
      <Back time={time} onClick={onExit} />
      <h1 className="title">Read</h1>
      <ul className="rows rows--closed scroll">
        {articles.map((a) => (
          <li key={a.title} className="article">
            <span className="mono muted" style={{ fontSize: 12 }}>
              {meta(a.minutes, a.progress)}
            </span>
            <span className="headline">{a.title}</span>
            <span className="source">{a.source}</span>
            {a.progress ? (
              <div className="progress">
                <span style={{ width: `${a.progress * 100}%` }} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="caption">No feeds. Only what you chose to keep.</p>
    </div>
  )
}
