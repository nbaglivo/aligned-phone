import { useState, type FormEvent } from 'react'
import type { AppProps } from '../App'
import { Back } from '../components/Back'
import { useStoredState } from '../hooks/useStoredState'
import { threads as seed } from '../data/seed'

export function Messages({ time, onExit }: AppProps) {
  const [threads, setThreads] = useStoredState('threads', seed)
  const [open, setOpen] = useState<number | null>(null)
  const [reply, setReply] = useState('')

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = reply.trim()
    if (!text || open === null) return
    setThreads((ts) => ts.map((t, i) => (i === open ? { ...t, when: time, msgs: [...t.msgs, { text, me: true }] } : t)))
    setReply('')
  }

  if (open !== null) {
    const thread = threads[open]
    return (
      <div className="screen" style={{ gap: 16 }}>
        <Back time={time} onClick={() => setOpen(null)} label="Back to messages" />
        <h1 className="title">{thread.name}</h1>
        <div className="bubbles scroll" aria-live="polite">
          {thread.msgs.map((m, i) => (
            <p key={i} className={m.me ? 'bubble bubble--me' : 'bubble'}>
              {m.text}
            </p>
          ))}
        </div>
        <form className="field" onSubmit={send}>
          <label htmlFor="reply" className="sr-only">
            Reply to {thread.name}
          </label>
          <input id="reply" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply…" autoComplete="off" />
          <button type="submit" className="mono">
            send
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="screen">
      <Back time={time} onClick={onExit} />
      <h1 className="title">Messages</h1>
      <ul className="rows scroll">
        {threads.map((t, i) => (
          <li key={t.name}>
            <button className="thread-row" onClick={() => setOpen(i)}>
              <span className="head">
                <span className="name">{t.name}</span>
                <span className="mono muted">{t.when}</span>
              </span>
              <span className="last">{t.msgs[t.msgs.length - 1]?.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
