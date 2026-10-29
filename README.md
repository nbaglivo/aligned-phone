# calm-shell

A minimal phone shell: time and day, and five apps — call, messages, notes, music, read.
Visual language from nbaglivo.dev: warm paper, warm ink, IBM Plex Sans Light + Plex Mono, thin line drawings.

React 19 + Vite + TypeScript. No router or UI library. Fonts are self-hosted (`@fontsource`), so it runs offline.

```sh
npm install
npm run dev       # http://localhost:5173 (also on your LAN, for testing on the phone)
npm run build     # static output in dist/
```

## Layout

```
src/
  App.tsx              screen switcher (home ⇄ app), Escape = home
  styles.css           tokens (light/dark via prefers-color-scheme or [data-theme]) + all styles
  hooks/useNow.ts      minute-aligned clock
  hooks/useStoredState.ts  localStorage-backed state (notes, message threads)
  components/          Back (doubles as the clock), Icons (stroke SVGs)
  apps/                Home, Call, Messages, Notes, Music, Read
  data/seed.ts         placeholder content — replace with real sources
```

## What's real and what isn't

- Clock, notes and message replies are real and persist locally.
- Calling, contacts, message delivery, playback and the reading list are stubs.
  Each lives in one component, ready to wire to the device (ModemManager/oFono,
  MPRIS, your P2P sync layer…).

## Running it as the shell on the phone

Build, then serve `dist/` and open it full-screen in a kiosk browser (e.g. `cage` + a WebKit/Chromium kiosk) on login.
