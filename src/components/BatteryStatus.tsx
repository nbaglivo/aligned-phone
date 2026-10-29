import type { Battery } from '../hooks/useBattery'
import { BatteryIcon } from './Icons'

export function BatteryStatus({ battery }: { battery: Battery }) {
  const percent = Math.round(battery.level * 100)
  const label = `${percent}%${battery.charging ? ' · charging' : ''}`
  return (
    <p className="battery mono muted" aria-label={`Battery ${label}`}>
      <BatteryIcon level={battery.level} />
      <span aria-hidden>{label}</span>
    </p>
  )
}
