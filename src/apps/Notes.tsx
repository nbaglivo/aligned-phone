import { useState, type FormEvent } from 'react'
import type { AppProps } from '../App'
import { Back } from '../components/Back'
import { useStoredState } from '../hooks/useStoredState'
import { notes as seed } from '../data/seed'

export function Notes({ time, onExit }: AppProps) {
  const [notes, setNotes] = useStoredState('notes', seed)
  const [draft, setDraft] = useState('')

  const add = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setNotes((ns) => [{ text, when: time }, ...ns])
    setDraft('')
  }

  return (
    <div className="screen">
      <Back time={time} onClick={onExit} />
      <h1 className="title">Notes</h1>
      <form onSubmit={add} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="new-note" className="mono muted">
          new note
        </label>
        <div className="field">
          <input
            id="new-note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write something down…"
            autoComplete="off"
          />
          <button type="submit" className="mono">
            add
          </button>
        </div>
      </form>
      <ul className="rows scroll">
        {notes.map((n, i) => (
          <li key={i} className="note">
            <span className="text">{n.text}</span>
            <span className="mono muted" style={{ fontSize: 12 }}>
              {n.when}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
