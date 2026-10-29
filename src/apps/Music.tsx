import { useEffect, useState } from 'react'
import type { AppProps } from '../App'
import { Back } from '../components/Back'
import { Next, Pause, Play, Prev } from '../components/Icons'
import { tracks } from '../data/seed'

const toSeconds = (len: string) => {
  const [m, s] = len.split(':').map(Number)
  return m * 60 + s
}
const toClock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`

// Playback is simulated with a timer. Wire `playing`/`index` to a real
// player (HTMLAudioElement, MPRIS over D-Bus…) when you have one.
export function Music({ time, onExit }: AppProps) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(102)

  const track = tracks[index]
  const length = toSeconds(track.length)

  const go = (i: number) => {
    setIndex((i + tracks.length) % tracks.length)
    setElapsed(0)
  }

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(t)
  }, [playing])

  useEffect(() => {
    if (elapsed >= length) go(index + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, length])

  return (
    <div className="screen">
      <Back time={time} onClick={onExit} />
      <h1 className="title">Music</h1>

      <div className="now">
        <p className="mono muted">{playing ? 'now playing' : 'paused'}</p>
        <p className="track">{track.title}</p>
        <p className="muted" style={{ fontSize: 15 }}>
          {track.artist}
        </p>
      </div>

      <div>
        <div className="progress" role="progressbar" aria-label="Track progress" aria-valuemin={0} aria-valuemax={length} aria-valuenow={elapsed}>
          <span style={{ width: `${(elapsed / length) * 100}%` }} />
        </div>
        <div className="times mono muted" style={{ fontSize: 12 }}>
          <span>{toClock(elapsed)}</span>
          <span>{track.length}</span>
        </div>
      </div>

      <div className="transport">
        <button className="icon-btn" onClick={() => go(index - 1)} aria-label="Previous track">
          <Prev />
        </button>
        <button className="round" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause /> : <Play />}
        </button>
        <button className="icon-btn" onClick={() => go(index + 1)} aria-label="Next track">
          <Next />
        </button>
      </div>

      <ol className="rows queue">
        {tracks.map((t, i) => (
          <li key={t.title}>
            <button
              aria-current={i === index}
              onClick={() => {
                go(i)
                setPlaying(true)
              }}
            >
              <span className="mono n" style={{ fontSize: 12 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="t">{t.title}</span>
              <span className="mono" style={{ fontSize: 12 }}>
                {t.length}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
