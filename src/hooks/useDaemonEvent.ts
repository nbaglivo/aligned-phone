import { useEffect, useState } from 'react'

// One EventSource for the whole shell. The daemon sends every event's current
// value on connect and then only changes, so the last value is cached here for
// components that mount later.

type Listener = (data: unknown) => void

let source: EventSource | null = null
const last = new Map<string, unknown>()
const listeners = new Map<string, Set<Listener>>()

function subscribe(event: string, listener: Listener): () => void {
  source ??= new EventSource('/events')

  let set = listeners.get(event)
  if (!set) {
    const subscribers = new Set<Listener>()
    listeners.set(event, subscribers)
    source.addEventListener(event, (e) => {
      const data = JSON.parse((e as MessageEvent<string>).data)
      last.set(event, data)
      for (const l of subscribers) l(data)
    })
    set = subscribers
  }

  set.add(listener)
  if (last.has(event)) listener(last.get(event))
  return () => set.delete(listener)
}

/** Latest payload of a daemon event (see docs/architecture.md), or null before the first one. */
export function useDaemonEvent<T>(event: string): T | null {
  const [data, setData] = useState<T | null>(() => (last.get(event) as T | undefined) ?? null)

  useEffect(() => subscribe(event, (d) => setData(d as T)), [event])

  return data
}
