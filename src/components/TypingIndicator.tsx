export default function TypingIndicator() {
  return (
    <div className="flex items-start message-fade-in px-4 py-2 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-1.5 px-3 py-3">
        <span className="typing-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--text-muted)' }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--text-muted)' }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}
