import { useEffect, useState } from 'react'

/**
 * useState that survives reloads. Local-first by default: everything lives on
 * the device. Swap this for your sync layer later without touching the apps.
 */
export function useStoredState<T>(key: string, initial: T) {
  const storageKey = `calm:${key}`
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // storage unavailable — keep working in memory
    }
  }, [storageKey, value])

  return [value, setValue] as const
}
