# Architecture

```
┌──────────────────────────── OnePlus 6 / postmarketOS ────────────────────────────┐
│                                                                                    │
│  tinydm ─▶ calm-session ─▶ cage (Wayland, single fullscreen app)                   │
│                              └─▶ chromium --kiosk http://127.0.0.1:8080            │
│                                     │  React shell                                 │
│                                     │  GET /            (static build)             │
│                                     │  GET /events      (SSE: state → shell)       │
│                                     │  POST /actions/*  (commands → system)        │
│                                     ▼                                              │
│                              daemon (Node, 127.0.0.1:8080)                         │
│                                     │                                              │
│                 ┌───────────────────┼────────────────────┐                         │
│              sysfs files        D-Bus (system bus)    /dev/input                   │
│        /sys/class/power_supply  ModemManager, UPower,  power button,               │
│        /sys/class/backlight     NetworkManager,        volume keys                 │
│                                 feedbackd                                          │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Daemon responsibilities

1. Serve the shell's `dist/` (with SPA fallback to `index.html`, and no path
   traversal outside the static dir).
2. Hold the current phone state in memory and push changes over SSE.
3. Accept actions from the shell and perform them on the system.
4. Later: host the P2P sync core (Hypercore/Holepunch) for local-first apps.

Config via env vars (with phone defaults), so it runs on the Mac against fixtures:

| Env                | Default                    |
| ------------------ | -------------------------- |
| `PORT`             | `8080`                     |
| `STATIC_DIR`       | `/opt/calm`                |
| `POWER_SUPPLY_DIR` | `/sys/class/power_supply`  |
| `BACKLIGHT_DIR`    | `/sys/class/backlight`     |
| `POLL_MS`          | `10000`                    |

## Event contract (`GET /events`, server-sent events)

- One SSE stream for the whole shell; the shell opens a single `EventSource`.
- Each feature is a named event. On connect, the daemon immediately sends the
  current value of every event, so the UI never waits for the first change.
- Only send when the value changed.

| Event      | Payload                                                                      | Source |
| ---------- | ---------------------------------------------------------------------------- | ------ |
| `battery`  | `{ level: 0-100 \| null, status: "Charging"\|"Discharging"\|"Full"\|"Not charging" \| null }` | sysfs `type == Battery` → `capacity`, `status` (later: UPower signals) |

Planned (not built yet): `network`, `modem` (signal, operator), `call`
(incoming/active), `sms`, `brightness`, `power-button`.

## Actions (`POST /actions/<name>`, JSON body)

Planned: `brightness { level }`, `call { number }`, `call/hangup`,
`sms/send { to, body }`, `suspend`. Return `204` on success, `4xx` with
`{ error }` on bad input. Validate everything — this endpoint can touch the modem.

## Shell side

- `src/hooks/useDaemonEvent.ts` — the one shared `EventSource`; `useDaemonEvent(name)`
  returns the latest payload of one event.
- `src/hooks/useBattery.ts` — the reference hook: subscribes
  to one event name. New hooks copy this shape.
- `src/components/BatteryIndicator.tsx` — the reference component.

## Roadmap

1. Daemon in `daemon/server.mjs`: static + SSE + battery (sysfs polling). ✓
2. Fixtures in `daemon/fixtures/` for running without the phone. ✓
3. Brightness (sysfs read + write action). ← next
4. Power button / suspend (`/dev/input`, logind).
5. Modem: calls + SMS via ModemManager (`dbus-next`).
6. Switch battery to UPower signals (no polling).
