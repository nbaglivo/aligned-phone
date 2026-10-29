import { useEffect, useState } from 'react'

export interface Battery {
  level: number
  charging: boolean
}

interface BatteryManager extends EventTarget, Battery {}

/** Battery level (0–1) and charging state, or null where the Battery Status API is unavailable. */
export function useBattery(): Battery | null {
  const [battery, setBattery] = useState<Battery | null>(null)

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }
    if (!nav.getBattery) return

    let manager: BatteryManager | undefined
    let cancelled = false
    const update = () => manager && setBattery({ level: manager.level, charging: manager.charging })

    nav
      .getBattery()
      .then((m) => {
        if (cancelled) return
        manager = m
        update()
        m.addEventListener('levelchange', update)
        m.addEventListener('chargingchange', update)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      manager?.removeEventListener('levelchange', update)
      manager?.removeEventListener('chargingchange', update)
    }
  }, [])

  return battery
}
