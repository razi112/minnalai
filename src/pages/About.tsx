import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { Bot, Code2, Globe } from 'lucide-react'

const stack = [
  { icon: <Bot size={22} />, name: 'AI Core', role: 'Gemini 2.5 Flash', desc: 'State-of-the-art language model for fast, accurate responses.' },
  { icon: <Code2 size={22} />, name: 'Built with React', role: 'TypeScript + Vite', desc: 'Modern frontend stack for a snappy, reliable experience.' },
  { icon: <Globe size={22} />, name: 'Supabase Auth', role: 'Secure backend', desc: 'Row-level security and OAuth so your data stays yours.' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />

        <div
          className="fixed inset-0 pointer-events-none fade-in"
          style={{ background: 'radial-gradient(ellipse 60% 35% at 50% 0%, var(--accent-subtle) 0%, transparent 65%)', animationDelay: '0.1s' }}
        />

        {/* Hero */}
        <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-16 gap-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 scale-in"
            style={{ background: 'var(--accent)', boxShadow: '0 8px 28px var(--accent-subtle)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1
            className="text-5xl sm:text-6xl font-bold max-w-2xl fade-up fade-up-delay-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            About this project
          </h1>

          <p
            className="text-lg max-w-xl fade-up fade-up-delay-2"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}
          >
            AI Chatbot is an open, minimal chat interface built to make AI conversations feel natural and fast.
            No clutter, no noise — just you and the model.
          </p>
        </section>

        {/* Story */}
        <section className="relative max-w-3xl mx-auto px-4 sm:px-8 pb-16 sm:pb-20 fade-up fade-up-delay-3">
          <div
            className="glow-card hover-scale rounded-2xl p-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Why we built this</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Most AI chat apps are bloated with features you never use. We wanted something different — a focused,
              distraction-free space where the conversation is the product.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Every design decision here prioritizes speed, clarity, and privacy. Your chats are yours.
              The interface stays out of the way.
            </p>
          </div>
        </section>

        {/* Stack */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-8 pb-20 sm:pb-32">
          <h2
            className="text-lg font-semibold mb-5 text-center fade-up fade-up-delay-3"
            style={{ color: 'var(--text-primary)' }}
          >
            What's under the hood
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stack.map(({ icon, name, role, desc }, i) => (
              <div
                key={name}
                className={`glow-card hover-scale rounded-2xl p-6 flex flex-col gap-3 fade-up fade-up-delay-${i + 2}`}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div
                  className="icon-bounce w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', animationDelay: `${0.35 + i * 0.1}s` }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                  <p className="text-xs mb-2" style={{ color: 'var(--accent)' }}>{role}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative text-center px-6 pb-24 fade-up fade-up-delay-4">
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Ready to try it?</p>
          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3 rounded-full text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-subtle)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Start chatting
          </button>
        </section>

        <footer className="text-center pb-8 text-xs fade-in" style={{ color: 'var(--text-muted)', animationDelay: '0.7s' }}>
          © {new Date().getFullYear()} AI Chatbot. All rights reserved.
        </footer>
      </div>
    </PageTransition>
  )
}
