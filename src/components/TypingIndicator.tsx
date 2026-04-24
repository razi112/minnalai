export default function TypingIndicator() {
  return (
    <div className="flex items-start message-fade-in px-4 py-2 max-w-3xl mx-auto w-full">
      <style>{`
        @keyframes orbitPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(0.4); opacity: 0.3; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>
      <div className="flex items-center gap-3 px-1 py-2">
        {/* Animated orbs */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                animation: `orbitPulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        {/* Shimmer text */}
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            background: 'linear-gradient(90deg, var(--text-muted) 25%, var(--accent) 50%, var(--text-muted) 75%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 2s linear infinite',
          }}
        >
          Thinking…
        </span>
      </div>
    </div>
  )
}
