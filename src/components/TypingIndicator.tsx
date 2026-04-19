export default function TypingIndicator() {
  return (
    <div className="flex items-start message-fade-in px-4 py-2 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-1.5 px-1 py-3">
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Thinking…</span>
      </div>
    </div>
  )
}
