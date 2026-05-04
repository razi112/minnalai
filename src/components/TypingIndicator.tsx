export default function TypingIndicator() {
  return (
    <div className="flex items-start message-fade-in px-4 py-2 max-w-3xl mx-auto w-full">
      <style>{`
        @keyframes typewriter {
          0%  { width: 0ch; }
          40% { width: 10ch; }
          60% { width: 10ch; }
          80% { width: 0ch; }
          100%{ width: 0ch; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 4px var(--accent), 0 0 12px var(--accent-subtle); }
          50%       { text-shadow: 0 0 10px var(--accent), 0 0 28px var(--accent-subtle), 0 0 48px var(--accent-subtle); }
        }
        @keyframes dotDrift {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50%       { transform: translateY(-3px); opacity: 1; }
        }

        .typing-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          animation: fadeSlideIn 0.35s ease forwards;
        }

        .typing-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent-subtle);
          border: 1px solid var(--accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          animation: glowPulse 2.4s ease-in-out infinite;
        }

        .typing-icon svg {
          width: 14px;
          height: 14px;
          fill: var(--accent);
        }

        .typewriter-box {
          display: flex;
          align-items: center;
          gap: 2px;
          background: var(--bg-secondary);
          border: 1px solid var(--accent-border);
          border-radius: 10px;
          padding: 6px 12px;
          box-shadow: 0 0 12px var(--accent-subtle);
        }

        .typewriter-text {
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', monospace;
          color: var(--accent);
          overflow: hidden;
          white-space: nowrap;
          width: 0ch;
          animation: typewriter 3s steps(10, end) infinite, glowPulse 2.4s ease-in-out infinite;
          letter-spacing: 0.03em;
        }

        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 14px;
          background: var(--accent);
          border-radius: 2px;
          margin-left: 1px;
          animation: blink 0.85s step-end infinite;
          box-shadow: 0 0 6px var(--accent);
          flex-shrink: 0;
        }

        .typing-dots {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-left: 4px;
        }

        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: dotDrift 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="typing-wrapper">
        {/* Glowing AI icon */}
        <div className="typing-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a1 1 0 0 1 1 1v1.07A8.001 8.001 0 0 1 20 12h1a1 1 0 1 1 0 2h-1a8.001 8.001 0 0 1-7 7.93V23a1 1 0 1 1-2 0v-1.07A8.001 8.001 0 0 1 4 14H3a1 1 0 1 1 0-2h1a8.001 8.001 0 0 1 7-7.93V3a1 1 0 0 1 1-1zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
        </div>

        {/* Typewriter box */}
        <div className="typewriter-box">
          <span className="typewriter-text">Thinking…</span>
          <span className="typewriter-cursor" />
          <div className="typing-dots">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  )
}
