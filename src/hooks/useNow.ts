import { useEffect, useState } from 'react'

/** Current time, re-rendered at the top of every minute. */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer: number
    const tick = () => {
      const d = new Date()
      setNow(d)
      timer = window.setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()))
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [])

  return now
}

const pad = (n: number) => String(n).padStart(2, '0')

export const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

export const formatDate = (d: Date) =>
  d
    .toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    .toLowerCase()
