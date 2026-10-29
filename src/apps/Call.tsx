import { useState } from 'react'
import type { AppProps } from '../App'
import { Back } from '../components/Back'
import { Backspace } from '../components/Icons'
import { contacts, type Contact } from '../data/seed'

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

export function Call({ time, onExit }: AppProps) {
  const [dial, setDial] = useState('')
  const [calling, setCalling] = useState<Contact | null>(null)

  if (calling) {
    return (
      <div className="screen">
        <div className="in-call">
          <p className="mono muted">calling…</p>
          <p className="name">{calling.name}</p>
          <p className="mono muted">{calling.number}</p>
          <button className="round mono" onClick={() => setCalling(null)} aria-label="End call">
            end
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen" style={{ gap: 20 }}>
      <Back time={time} onClick={onExit} />
      <h1 className="title">Call</h1>
      <ul className="rows">
        {contacts.map((c) => (
          <li key={c.number}>
            <button className="contact" onClick={() => setCalling(c)} aria-label={`Call ${c.name}`}>
              <span>{c.name}</span>
              <span className="mono muted">{c.number}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="field dial">
        <output aria-live="polite" aria-label="Number">{dial || ' '}</output>
        <button className="icon-btn muted" onClick={() => setDial((d) => d.slice(0, -1))} aria-label="Delete last digit">
          <Backspace />
        </button>
      </div>
      <div className="keypad">
        {keys.map((k) => (
          <button key={k} onClick={() => setDial((d) => (d + k).slice(0, 16))}>
            {k}
          </button>
        ))}
      </div>
      <button
        className="pill mono"
        onClick={() => dial && setCalling({ name: dial, number: 'mobile' })}
        disabled={!dial}
      >
        call
      </button>
    </div>
  )
}
