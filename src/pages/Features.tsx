import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import {
  IconBot, IconBook, IconScroll, IconClock, IconGear, IconCompass, IconLock,
  IconGlobe, IconRefresh, IconMoon, IconMic, IconAlarm, IconMosque, IconMedal,
  IconBookmark, IconBeads, IconStar, IconRocket, IconSparkle,
} from '../components/Icons'

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ── Core features data ────────────────────────────────────────────────────────
const coreFeatures = [
  {
    icon: <IconBot size={24} color="#16a34a" />,
    title: 'Smart Islamic Chatbot',
    badge: 'Core',
    color: '#16a34a',
    desc: 'Ask any Islamic question and receive instant, context-aware answers powered by AI — grounded in Quran and Sunnah.',
    bullets: ['Ask any Islamic question', 'Instant AI-powered answers', 'Context-aware responses'],
  },
  {
    icon: <IconBook size={24} color="#d4a017" />,
    title: 'Quran-Based Guidance',
    badge: 'Knowledge',
    color: '#d4a017',
    desc: 'Explore the meanings and explanations of Quranic verses with clarity and depth, simplified for every level of understanding.',
    bullets: ['Quran explanation support', 'Verse-based answers', 'Simplified meanings'],
  },
  {
    icon: <IconScroll size={24} color="#0891b2" />,
    title: 'Hadith Support',
    badge: 'Authentic',
    color: '#0891b2',
    desc: 'Receive answers backed by authentic Hadith collections, with references to help you verify and learn further.',
    bullets: ['Answers based on Hadith', 'Authentic references', 'Traceable sources'],
  },
  {
    icon: <IconClock size={24} color="#7c3aed" />,
    title: 'Chat History Management',
    badge: 'Organised',
    color: '#7c3aed',
    desc: 'Every conversation is saved so you can revisit, rename, or delete chats — keeping your Islamic learning journey organised.',
    bullets: ['Save all conversations', 'Rename & delete chats', 'Organised learning experience'],
  },
]

// ── Secondary features data ───────────────────────────────────────────────────
const secondaryFeatures = [
  { icon: <IconGear size={20} color="#16a34a" />, title: 'Personalised Responses', desc: 'Smart replies that adapt to your queries and learning style over time.', color: '#16a34a' },
  { icon: <IconCompass size={20} color="#d4a017" />, title: 'Easy Navigation UI', desc: 'Sidebar with chat list, settings, and account access — clean and distraction-free.', color: '#d4a017' },
  { icon: <IconLock size={20} color="#0891b2" />, title: 'Secure Login', desc: 'Sign in with Google or email. Your data is protected with row-level security.', color: '#0891b2' },
  { icon: <IconGlobe size={20} color="#7c3aed" />, title: 'Multi-Language Support', desc: 'Ask in Arabic, English, Urdu, Malayalam, or any language you prefer.', color: '#7c3aed' },
  { icon: <IconRefresh size={20} color="#f97316" />, title: 'Regenerate Answers', desc: 'Not satisfied? Regenerate any response with one tap for a fresh perspective.', color: '#f97316' },
  { icon: <IconMoon size={20} color="#6366f1" />, title: 'Dark & Light Mode', desc: 'Comfortable reading in any environment — switch themes to suit your preference.', color: '#6366f1' },
]

// ── Coming soon features ──────────────────────────────────────────────────────
const comingSoon = [
  { icon: <IconMic size={22} color="#d4a017" />, title: 'Voice Input', desc: 'Ask questions by speaking — hands-free Islamic guidance.' },
  { icon: <IconAlarm size={22} color="#d4a017" />, title: 'Daily Reminders', desc: 'Personalised Islamic reminders and daily Hadith notifications.' },
  { icon: <IconMosque size={22} color="#d4a017" />, title: 'Prayer Times', desc: 'Accurate prayer time integration based on your location.' },
  { icon: <IconMedal size={22} color="#d4a017" />, title: 'Scholar-Verified', desc: 'Answers reviewed and verified by qualified Islamic scholars.' },
  { icon: <IconBookmark size={22} color="#d4a017" />, title: 'Bookmarks', desc: 'Save your favourite answers and revisit them anytime.' },
  { icon: <IconBeads size={22} color="#d4a017" />, title: 'Quran Citations', desc: 'Direct links to Quran verses and Hadith references.' },
]

// ── Main feature card with spotlight glow ────────────────────────────────────
function CoreCard({ icon, title, badge, color, desc, bullets, index }: {
  icon: React.ReactNode; title: string; badge: string; color: string; desc: string; bullets: string[]; index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false })
  const { ref: revealRef, visible } = useScrollReveal()

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current!.getBoundingClientRect()
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true })
  }

  return (
    <div
      ref={revealRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={() => setSpot(s => ({ ...s, on: false }))}
        className="core-card"
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: '20px',
          padding: 'clamp(20px,4vw,28px)', display: 'flex', flexDirection: 'column', gap: '18px',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          cursor: 'default', height: '100%',
          transition: 'border-color 0.45s ease, box-shadow 0.45s ease, transform 0.45s cubic-bezier(0.34,1.4,0.64,1), background 0.35s ease',
        }}
      >
        {/* Spotlight */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px',
          background: `radial-gradient(circle 240px at ${spot.x}% ${spot.y}%, ${color}28, transparent 70%)`,
          opacity: spot.on ? 1 : 0, transition: 'opacity 0.4s ease',
        }} />
        {/* Top shimmer */}
        <div className="c-shimmer" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${color}cc, transparent)`,
          opacity: 0, transition: 'opacity 0.45s ease',
        }} />
        {/* Bottom bar */}
        <div className="c-bar" style={{
          position: 'absolute', bottom: 0, left: '30%', right: '30%', height: '2px', borderRadius: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0, transition: 'opacity 0.45s ease, left 0.5s cubic-bezier(0.34,1.2,0.64,1), right 0.5s cubic-bezier(0.34,1.2,0.64,1)',
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
          <div className="c-icon" style={{
            width: '52px', height: '52px', borderRadius: '14px', fontSize: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${color}18`, border: `1px solid ${color}33`,
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.45s ease, background 0.35s ease',
          }}>
            {icon}
          </div>
          <span style={{
            fontSize: '10px', padding: '4px 10px', borderRadius: '999px', fontWeight: 700,
            background: `${color}15`, color, border: `1px solid ${color}33`, letterSpacing: '0.06em',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}>
            {badge.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', fontFamily: "'Georgia', serif", letterSpacing: '-0.01em' }}>
            {title}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '14px' }}>
            {desc}
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {bullets.map(b => (
              <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span className="c-bullet" style={{ color, fontSize: '10px', flexShrink: 0, transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>✦</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <style>{`
          .core-card:hover {
            border-color: ${color}55 !important;
            box-shadow: 0 0 0 1px ${color}22, 0 8px 24px ${color}14, 0 24px 56px rgba(0,0,0,0.32) !important;
            transform: translateY(-7px) scale(1.015) !important;
          }
          .core-card:hover .c-shimmer { opacity: 1 !important; }
          .core-card:hover .c-bar { opacity: 1 !important; left: 0% !important; right: 0% !important; }
          .core-card:hover .c-icon {
            transform: scale(1.18) rotate(-6deg) !important;
            box-shadow: 0 0 22px ${color}55 !important;
            background: ${color}28 !important;
          }
          .core-card:hover .c-bullet { transform: scale(1.4) rotate(45deg) !important; }
          .core-card:active { transform: translateY(-2px) scale(0.98) !important; transition-duration: 0.12s !important; }
        `}</style>
      </div>
    </div>
  )
}

// ── Secondary card with tilt ──────────────────────────────────────────────────
function SecCard({ icon, title, desc, color, index }: {
  icon: React.ReactNode; title: string; desc: string; color: string; index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, on: false })
  const { ref: revealRef, visible } = useScrollReveal()

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current!.getBoundingClientRect()
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -8
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8
    setTilt({ rx, ry, on: true })
  }

  return (
    <div
      ref={revealRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${(index % 3) * 0.08}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${(index % 3) * 0.08}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0, on: false })}
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: '16px',
          padding: 'clamp(14px,3vw,20px)', display: 'flex', gap: '14px', alignItems: 'flex-start',
          background: 'var(--bg-secondary)', cursor: 'default', height: '100%',
          border: `1px solid ${tilt.on ? color + '55' : 'var(--border)'}`,
          transform: tilt.on
            ? `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.04) translateY(-4px)`
            : 'perspective(700px) rotateX(0) rotateY(0) scale(1) translateY(0)',
          boxShadow: tilt.on
            ? `0 8px 24px ${color}18, 0 20px 48px rgba(0,0,0,0.28), 0 0 0 1px ${color}22`
            : 'none',
          transition: tilt.on
            ? 'transform 0.08s ease, border-color 0.2s ease, box-shadow 0.2s ease'
            : 'transform 0.5s cubic-bezier(0.34,1.4,0.64,1), border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {/* Flood */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${color}0c, transparent)`,
          opacity: tilt.on ? 1 : 0, transition: 'opacity 0.35s ease',
        }} />
        {/* Icon */}
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}18`, border: `1px solid ${color}33`, position: 'relative',
          transform: tilt.on ? 'scale(1.2) rotate(-8deg)' : 'scale(1) rotate(0deg)',
          boxShadow: tilt.on ? `0 0 18px ${color}66` : 'none',
          transition: tilt.on
            ? 'transform 0.08s ease, box-shadow 0.2s ease'
            : 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease',
        }}>
          {icon}
        </div>
        {/* Text */}
        <div style={{ position: 'relative', minWidth: 0 }}>
          <p style={{
            fontSize: '13px', fontWeight: 700, marginBottom: '5px',
            color: tilt.on ? color : 'var(--text-primary)',
            transition: 'color 0.3s ease', letterSpacing: '-0.01em',
          }}>{title}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
        </div>
        {/* Corner dot */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          width: '7px', height: '7px', borderRadius: '50%', background: color,
          opacity: tilt.on ? 1 : 0,
          transform: tilt.on ? 'scale(1)' : 'scale(0)',
          transition: 'opacity 0.3s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}66`,
        }} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Features() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />

        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none fade-in"
          style={{ background: 'radial-gradient(ellipse 65% 38% at 50% 0%, var(--accent-subtle) 0%, transparent 65%)', zIndex: 0 }}
        />

        <div className="relative" style={{ zIndex: 1 }}>

          {/* ── HERO ── */}
          <section className="text-center px-5 pt-20 pb-16 max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 fade-up"
              style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', color: 'var(--accent)', letterSpacing: '0.07em' }}
            >
              <IconStar size={13} color="var(--accent)" /> WHAT YOU CAN DO
            </div>
            <h1
              className="text-4xl sm:text-6xl font-bold mb-5 fade-up fade-up-delay-1"
              style={{ letterSpacing: '-0.03em', fontFamily: "'Georgia', serif" }}
            >
              Features Built for{' '}
              <span style={{ color: 'var(--accent)' }}>Islamic Learning</span>
            </h1>
            <p
              className="text-base sm:text-lg max-w-xl mx-auto fade-up fade-up-delay-2"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
            >
              Powerful tools designed to help you learn and practice Islam with ease —
              grounded in authenticity, built for every level.
            </p>
          </section>

          {/* ── CORE FEATURES ── */}
          <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {coreFeatures.map((f, i) => (
              <CoreCard key={f.title} {...f} index={i} />
            ))}
          </section>

          {/* ── DIVIDER ── */}
          <div className="flex items-center gap-4 max-w-5xl mx-auto px-4 sm:px-8 pb-10">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span
              className="text-xs font-bold px-4 py-1.5 rounded-full"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', letterSpacing: '0.1em' }}
            >
              AND MORE
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* ── SECONDARY FEATURES ── */}
          <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {secondaryFeatures.map((f, i) => (
              <SecCard key={f.title} {...f} index={i} />
            ))}
          </section>

          {/* ── DIVIDER ── */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── COMING SOON ── */}
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-20">
            <Reveal>
              <div className="text-center mb-12">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                  style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', color: '#d4a017', letterSpacing: '0.07em' }}
                >
                  <IconRocket size={13} color="#d4a017" /> COMING SOON
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}>
                  Future Enhancements
                </h2>
                <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  We're constantly building. Here's what's coming next for AI Islam.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {comingSoon.map(({ icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <div
                    className="coming-soon-card rounded-2xl p-4 flex flex-col gap-2 text-center h-full"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(212,160,23,0.15)',
                      opacity: 0.8,
                      transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s ease, border-color 0.35s ease, opacity 0.35s ease',
                    }}
                  >
                    <span
                      className="cs-icon flex items-center justify-center"
                      style={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}
                    >{icon}</span>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                    <span
                      className="mt-auto text-xs px-2 py-0.5 rounded-full self-center"
                      style={{ background: 'rgba(212,160,23,0.1)', color: '#d4a017', border: '1px solid rgba(212,160,23,0.2)', fontSize: '9px', letterSpacing: '0.05em' }}
                    >
                      SOON
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <style>{`
              .coming-soon-card:hover {
                transform: translateY(-6px) scale(1.04) !important;
                box-shadow: 0 0 0 1px rgba(212,160,23,0.35), 0 8px 24px rgba(212,160,23,0.1), 0 20px 48px rgba(0,0,0,0.28) !important;
                border-color: rgba(212,160,23,0.4) !important;
                opacity: 1 !important;
              }
              .coming-soon-card:hover .cs-icon {
                transform: scale(1.3) rotate(-8deg) !important;
              }
              .coming-soon-card:active {
                transform: translateY(-2px) scale(0.97) !important;
                transition-duration: 0.12s !important;
              }
            `}</style>
          </section>

          {/* ── DIVIDER ── */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── CTA ── */}
          <section className="text-center px-5 py-20">
            <Reveal>
              <div
                className="max-w-2xl mx-auto rounded-2xl p-10 flex flex-col items-center gap-5"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, var(--accent-subtle), transparent)', pointerEvents: 'none' }} />
                <div className="relative text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
                      <IconSparkle size={28} color="var(--accent)" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                    All Features. No Paywalls.
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '380px', margin: '0 auto 24px' }}>
                    Every feature is free to use. Start your Islamic learning journey today with no barriers.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 rounded-xl text-sm font-bold"
                    style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 24px var(--accent-subtle)' }}
                  >
                    Start for Free
                  </button>
                </div>
              </div>
            </Reveal>
          </section>

          {/* Footer */}
          <footer className="text-center pb-10 text-xs fade-in" style={{ color: 'var(--text-muted)', animationDelay: '0.6s' }}>
            © {new Date().getFullYear()}{' '}
            <span style={{
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: '13px',
              background: 'linear-gradient(135deg, #4ade80, #d4a017, #16a34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>AI Islam</span>. All rights reserved.
          </footer>

        </div>
      </div>
    </PageTransition>
  )
}
