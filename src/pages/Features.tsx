import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import {
  Zap, Shield, MessageSquare, Sparkles, Brain, Code2,
  RefreshCw, Moon, Languages, History, Mic, ImageIcon,
  SlidersHorizontal, Layers, Lock, Wifi
} from 'lucide-react'

const mainFeatures = [
  {
    icon: <Brain size={24} />,
    title: 'Gemini 2.5 Flash',
    desc: 'Backed by Google\'s most capable multimodal model. Understands context, nuance, and complex instructions with ease.',
    badge: 'Core AI',
    color: '#7c3aed',
    
  },
  {
    icon: <Zap size={24} />,
    title: 'Near-instant Responses',
    desc: 'Streaming output means you see the answer as it\'s generated — no waiting for the full response to load.',
    badge: 'Performance',
    color: '#f59e0b',
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Multi-turn Conversations',
    desc: 'Full conversation memory within a session. The AI remembers what you said earlier and builds on it naturally.',
    badge: 'Chat',
    color: '#3b82f6',
  },
  {
    icon: <Code2 size={24} />,
    title: 'Code Generation & Review',
    desc: 'Write, debug, and explain code across 50+ languages. Syntax-highlighted output with copy-to-clipboard.',
    badge: 'Developer',
    color: '#10b981',
  },
]

const secondaryFeatures = [
  { icon: <RefreshCw size={16} />, title: 'Regenerate Responses', desc: 'Not happy with an answer? Regenerate with one click for a fresh take.', color: '#7c3aed' },
  { icon: <History size={16} />, title: 'Chat History', desc: 'All your conversations saved locally. Pick up right where you left off.', color: '#3b82f6' },
  { icon: <Moon size={16} />, title: 'Dark & Light Mode', desc: 'Fully themed UI with system preference detection and manual override.', color: '#6366f1' },
  { icon: <Languages size={16} />, title: 'Multilingual', desc: 'Chat in any language. The model understands and responds in your language.', color: '#f59e0b' },
  { icon: <SlidersHorizontal size={16} />, title: 'Customizable Accent', desc: 'Pick your accent color and make the interface feel like yours.', color: '#ec4899' },
  { icon: <Layers size={16} />, title: 'Markdown Rendering', desc: 'Responses render rich markdown — tables, lists, bold, italic, and more.', color: '#10b981' },
  { icon: <Mic size={16} />, title: 'Voice Input Ready', desc: 'Built with extensibility in mind — voice input support coming soon.', color: '#f97316' },
  { icon: <ImageIcon size={16} />, title: 'Image Understanding', desc: 'Multimodal support lets you share images and ask questions about them.', color: '#06b6d4' },
  { icon: <Lock size={16} />, title: 'Auth & Accounts', desc: 'Secure sign-in via email/password or Google OAuth powered by Supabase.', color: '#84cc16' },
  { icon: <Shield size={16} />, title: 'Private by Default', desc: 'No conversation data is stored on external servers without your consent.', color: '#22c55e' },
  { icon: <Sparkles size={16} />, title: 'Smart Prompt Chips', desc: 'Starter prompts on new chats to help you get going instantly.', color: '#a855f7' },
  { icon: <Wifi size={16} />, title: 'Offline-aware', desc: 'Graceful error handling when connectivity drops — no silent failures.', color: '#14b8a6' },
]

// Main card with mouse-tracking spotlight glow
function MainCard({ icon, title, desc, badge, color, index }: {
  icon: React.ReactNode; title: string; desc: string; badge: string; color: string; index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x, y, opacity: 1 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight(s => ({ ...s, opacity: 0 }))}
      className={`main-feat-card fade-up fade-up-delay-${index + 1}`}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', padding: 'clamp(18px, 4vw, 28px)', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', cursor: 'default', transition: 'border-color 0.5s ease, box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
    >
      {/* Mouse spotlight */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px',
        background: `radial-gradient(circle 180px at ${spotlight.x}% ${spotlight.y}%, ${color}22, transparent 70%)`,
        opacity: spotlight.opacity,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Top shimmer line */}
      <div className="feat-shimmer" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${color}88, transparent)`, opacity: 0, transition: 'opacity 0.5s ease' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div
          className="feat-icon"
          style={{
            width: '48px', height: '48px', borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${color}18`, color, border: `1px solid ${color}33`,
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease, background 0.5s ease',
          }}
        >
          {icon}
        </div>
        <span style={{
          fontSize: '11px', padding: '4px 10px', borderRadius: '999px', fontWeight: 600,
          background: `${color}15`, color, border: `1px solid ${color}33`,
          letterSpacing: '0.04em',
        }}>
          {badge}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
      </div>

      {/* Bottom accent bar */}
      <div className="feat-bar" style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '2px', borderRadius: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0, transition: 'opacity 0.5s ease, left 0.5s ease, right 0.5s ease' }} />

      <style>{`
        .main-feat-card:hover {
          border-color: ${color}44 !important;
          box-shadow: 0 0 0 1px ${color}22, 0 20px 48px rgba(0,0,0,0.35) !important;
          transform: translateY(-6px) scale(1.01) !important;
        }
        .main-feat-card:hover .feat-shimmer { opacity: 1 !important; }
        .main-feat-card:hover .feat-bar { opacity: 1 !important; left: 0% !important; right: 0% !important; }
        .main-feat-card:hover .feat-icon {
          transform: scale(1.18) rotate(-6deg) !important;
          box-shadow: 0 0 20px ${color}44 !important;
          background: ${color}28 !important;
        }
        .main-feat-card:active { transform: scale(0.98) !important; transition-duration: 0.1s !important; }      `}</style>
    </div>
  )
}

// Secondary card with tilt + color flood on hover
function SecondaryCard({ icon, title, desc, color, index }: {
  icon: React.ReactNode; title: string; desc: string; color: string; index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 8
    setTilt({ rx, ry, active: true })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, active: false })}
      className={`sec-feat-card fade-up fade-up-delay-${(index % 4) + 1}`}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '16px', padding: 'clamp(14px, 3vw, 20px)',
        display: 'flex', gap: '16px', alignItems: 'flex-start',
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        cursor: 'default',
        transform: tilt.active ? `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.03)` : 'perspective(600px) rotateX(0) rotateY(0) scale(1)',
        transition: tilt.active ? 'transform 0.1s ease' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, box-shadow 0.3s ease',
        borderColor: tilt.active ? `${color}55` : 'var(--border)',
        boxShadow: tilt.active ? `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}22` : 'none',
      }}
    >
      {/* Flood fill on hover */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `${color}08`,
        opacity: tilt.active ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />

      <div style={{
        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${color}18`, color, border: `1px solid ${color}33`,
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
        transform: tilt.active ? 'scale(1.2) rotate(-8deg)' : 'scale(1) rotate(0deg)',
        boxShadow: tilt.active ? `0 0 16px ${color}55` : 'none',
        position: 'relative',
      }}>
        {icon}
      </div>

      <div style={{ position: 'relative', minWidth: 0 }}>
        <p style={{
          fontSize: '13px', fontWeight: 700, marginBottom: '5px',
          color: tilt.active ? color : 'var(--text-primary)',
          transition: 'color 0.25s ease',
          letterSpacing: '-0.01em',
        }}>{title}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
      </div>

      {/* Corner dot */}
      <div style={{
        position: 'absolute', top: '14px', right: '14px',
        width: '6px', height: '6px', borderRadius: '50%',
        background: color,
        opacity: tilt.active ? 1 : 0,
        transform: tilt.active ? 'scale(1)' : 'scale(0)',
        transition: 'opacity 0.25s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: `0 0 8px ${color}`,
      }} />
    </div>
  )
}

export default function Features() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />

        <div
          className="fixed inset-0 pointer-events-none fade-in"
          style={{ background: 'radial-gradient(ellipse 65% 38% at 50% 0%, var(--accent-subtle) 0%, transparent 65%)' }}
        />

        {/* Hero */}
        <section className="relative text-center px-6 pt-20 pb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 fade-up"
            style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
          >
            <Sparkles size={12} /> Everything included
          </div>
          <h1
            className="text-4xl sm:text-6xl font-bold mb-5 fade-up fade-up-delay-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            Built for real{' '}
            <span style={{ color: 'var(--accent)' }}>AI conversations.</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto fade-up fade-up-delay-2"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}
          >
            Every feature is designed to make your AI interactions faster, smarter, and more enjoyable.
          </p>
        </section>

        {/* Main feature cards */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-8 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {mainFeatures.map((f, i) => (
            <MainCard key={f.title} {...f} index={i} />
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-5xl mx-auto px-4 sm:px-8 pb-8 fade-up fade-up-delay-2">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', letterSpacing: '0.08em' }}
          >
            AND MORE
          </span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Secondary features */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-8 pb-20 sm:pb-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {secondaryFeatures.map((f, i) => (
            <SecondaryCard key={f.title} {...f} index={i} />
          ))}
        </section>

        {/* CTA */}
        <section className="relative text-center px-6 pb-24 fade-up fade-up-delay-3">
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>All features. No paywalls.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3 rounded-full text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-subtle)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Start for free
          </button>
        </section>

        <footer className="text-center pb-8 text-xs fade-in" style={{ color: 'var(--text-muted)', animationDelay: '0.6s' }}>
          © {new Date().getFullYear()}{' '}
          <span style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: '13px',
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.04em',
          }}>Minnal AI</span>. All rights reserved.
        </footer>
      </div>
    </PageTransition>
  )
}
