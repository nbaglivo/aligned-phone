import type { Battery } from '../hooks/useBattery'
import { BatteryIcon } from './Icons'

export function BatteryIndicator({ battery }: { battery: Battery }) {
  if (battery.level === null) return null
  const label = `${battery.level}%${battery.status === 'Charging' ? ' · charging' : ''}`
  return (
    <p className="battery mono muted" aria-label={`Battery ${label}`}>
      <BatteryIcon level={battery.level / 100} />
      <span aria-hidden>{label}</span>
    </p>
  )
}
