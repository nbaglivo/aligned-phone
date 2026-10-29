import { useDaemonEvent } from './useDaemonEvent'

export interface Battery {
  /** 0–100, or null when the phone reports no battery. */
  level: number | null
  status: 'Charging' | 'Discharging' | 'Full' | 'Not charging' | null
}

/** The daemon's `battery` event, or null until the daemon has sent it. */
export const useBattery = () => useDaemonEvent<Battery>('battery')
