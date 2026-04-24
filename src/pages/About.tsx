import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import {
  IconTarget, IconMoon, IconChat, IconBook, IconScroll, IconFolder, IconGlobe,
  IconGraduation, IconSprout, IconCalendar, IconSearch, IconShield, IconHands,
  IconBuilding, IconWarning,
} from '../components/Icons'

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
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

function RevealBlock({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────
const features = [
  { icon: <IconChat size={22} color="var(--accent)" />, title: 'Islamic Q&A Chatbot', desc: 'Ask any question about Islam and receive clear, context-aware answers instantly.' },
  { icon: <IconBook size={22} color="var(--accent)" />, title: 'Quran Explanation', desc: 'Explore the meanings and tafsir of Quranic verses with ease.' },
  { icon: <IconScroll size={22} color="var(--accent)" />, title: 'Hadith-Based Answers', desc: 'Responses grounded in authentic Hadith collections and Islamic scholarship.' },
  { icon: <IconMoon size={22} color="var(--accent)" />, title: 'Daily Guidance', desc: 'Get practical Islamic guidance for everyday situations and questions.' },
  { icon: <IconFolder size={22} color="var(--accent)" />, title: 'Chat History', desc: 'All your conversations saved — rename, revisit, or delete anytime.' },
  { icon: <IconGlobe size={22} color="var(--accent)" />, title: 'Multilingual', desc: 'Ask in Arabic, English, Urdu, Malayalam, or any language you prefer.' },
]

const audience = [
  { icon: <IconGraduation size={28} color="var(--accent)" />, label: 'Students of Islam', desc: 'Deepen your knowledge with instant, reliable answers.' },
  { icon: <IconSprout size={28} color="var(--accent)" />, label: 'Beginners', desc: 'Start your Islamic learning journey without feeling overwhelmed.' },
  { icon: <IconCalendar size={28} color="var(--accent)" />, label: 'Daily Learners', desc: 'Build a habit of learning something new about Islam every day.' },
  { icon: <IconSearch size={28} color="var(--accent)" />, label: 'Curious Minds', desc: 'Explore Islamic history, ethics, and jurisprudence freely.' },
]

const howItWorks = [
  { step: '01', title: 'You Ask', desc: 'Type your question in any language — about Quran, Hadith, Fiqh, or daily Islamic life.' },
  { step: '02', title: 'AI Processes', desc: 'The AI, trained on authentic Islamic sources, understands your intent and context.' },
  { step: '03', title: 'You Receive', desc: 'A clear, respectful answer is delivered instantly — with relevant references where applicable.' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function About() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div
        className="min-h-screen"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}
      >
        <Navbar />

        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, var(--accent-subtle) 0%, transparent 65%)', zIndex: 0 }}
        />

        <div className="relative" style={{ zIndex: 1 }}>

          {/* ── HERO ── */}
          <section className="flex flex-col items-center text-center px-5 pt-20 pb-20 gap-6 max-w-3xl mx-auto">
            {/* Crescent badge */}
            <div
              className="scale-in w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--accent)', boxShadow: '0 8px 32px var(--accent-subtle)' }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="white" />
                <circle cx="17.5" cy="5.5" r="1.5" fill="white" />
              </svg>
            </div>

            {/* Pill label */}
            <span
              className="fade-up text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', color: 'var(--accent)', letterSpacing: '0.08em' }}
            >
              ABOUT AI ISLAM
            </span>

            <h1
              className="fade-up fade-up-delay-1 text-4xl sm:text-6xl font-bold leading-tight"
              style={{ letterSpacing: '-0.03em', fontFamily: "'Georgia', serif" }}
            >
              What is{' '}
              <span style={{ color: 'var(--accent)' }}>AI Islam?</span>
            </h1>

            <p
              className="fade-up fade-up-delay-2 text-lg max-w-2xl"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}
            >
              AI Islam is an intelligent assistant designed to help you explore Islam with
              clarity, authenticity, and ease — powered by AI, grounded in Quran and Sunnah.
            </p>

            <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-subtle)' }}
              >
                Start Exploring
              </button>
              <button
                onClick={() => navigate('/features')}
                className="px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                View Features
              </button>
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── MISSION & VISION ── */}
          <section className="max-w-5xl mx-auto px-5 py-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RevealBlock delay={0}>
              <div
                className="card-hover h-full rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="icon-bounce w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
                  <IconTarget size={20} color="var(--accent)" />
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Georgia', serif", color: 'var(--text-primary)' }}>Our Mission</h2>
                <ul className="space-y-3">
                  {[
                    'Provide correct Islamic knowledge to every user',
                    'Make Quran & Hadith explanations easily accessible',
                    'Bridge the gap between technology and Islamic learning',
                    'Serve Muslims and curious learners worldwide',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealBlock>

            <RevealBlock delay={0.1}>
              <div
                className="card-hover h-full rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="icon-bounce w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
                  <IconMoon size={20} color="var(--accent)" />
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Georgia', serif", color: 'var(--text-primary)' }}>Our Vision</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  To become the most trusted AI-powered Islamic companion for daily life — helping
                  millions of Muslims and seekers access authentic knowledge anytime, anywhere,
                  in any language.
                </p>
                <div
                  className="mt-auto rounded-xl px-4 py-3 text-sm italic"
                  style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', color: 'var(--accent)', lineHeight: 1.7 }}
                >
                  "Seek knowledge from the cradle to the grave." — Prophet Muhammad ﷺ
                </div>
              </div>
            </RevealBlock>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── WHAT AI ISLAM DOES ── */}
          <section className="max-w-5xl mx-auto px-5 py-20">
            <RevealBlock>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}>
                  What AI Islam Does
                </h2>
                <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  A focused set of capabilities built around authentic Islamic knowledge.
                </p>
              </div>
            </RevealBlock>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map(({ icon, title, desc }, i) => (
                <RevealBlock key={title} delay={i * 0.07}>
                  <div
                    className="glow-card rounded-2xl p-5 flex flex-col gap-3 h-full"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <span className="icon-bounce flex items-center">{icon}</span>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── HOW IT WORKS ── */}
          <section className="max-w-4xl mx-auto px-5 py-20">
            <RevealBlock>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}>
                  How It Works
                </h2>
                <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  Simple, fast, and context-aware — no technical knowledge needed.
                </p>
              </div>
            </RevealBlock>

            <div className="flex flex-col sm:flex-row gap-4 relative">
              {/* Connector line — desktop only */}
              <div
                className="hidden sm:block absolute top-10 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent-border), transparent)', zIndex: 0 }}
              />
              {howItWorks.map(({ step, title, desc }, i) => (
                <RevealBlock key={step} delay={i * 0.12} className="flex-1">
                  <div
                    className="card-hover relative rounded-2xl p-6 flex flex-col gap-3 text-center"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', zIndex: 1 }}
                  >
                    <div
                      className="step-badge w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto"
                      style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 0 16px var(--accent-subtle)' }}
                    >
                      {step}
                    </div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── AUTHENTICITY & TRUST ── */}
          <section className="max-w-3xl mx-auto px-5 py-20">
            <RevealBlock>
              <div
                className="rounded-2xl p-8 sm:p-10 flex flex-col gap-6 text-center"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', position: 'relative', overflow: 'hidden' }}
              >
                {/* Glow */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-subtle), transparent)', pointerEvents: 'none' }} />

                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
                    <IconShield size={24} color="var(--accent)" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                    Authenticity & Trust
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 24px' }}>
                    AI Islam provides guidance based on authentic Islamic sources — the Quran and
                    the Sunnah of Prophet Muhammad ﷺ. Every effort is made to ensure accuracy,
                    but for important religious matters, always consult qualified scholars.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {[
                      { icon: <IconBook size={20} color="#16a34a" />, label: 'Quran-Based', desc: 'Answers rooted in the Holy Quran' },
                      { icon: <IconScroll size={20} color="#0891b2" />, label: 'Hadith-Grounded', desc: 'Supported by authentic Hadith' },
                      { icon: <IconHands size={20} color="var(--accent)" />, label: 'Scholar-Advised', desc: 'Encourages consulting scholars' },
                    ].map(({ icon, label, desc }) => (
                      <div
                        key={label}
                        className="card-hover rounded-xl p-4 flex flex-col gap-1"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                      >
                        <span className="icon-bounce flex items-center">{icon}</span>
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer box */}
                  <div
                    className="rounded-xl px-5 py-4 text-sm text-left"
                    style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)', color: 'var(--text-secondary)', lineHeight: 1.75 }}
                  >
                    <span style={{ color: '#d4a017', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <IconWarning size={15} color="#d4a017" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }} /> Disclaimer:{' '}
                    </span>
                    AI Islam is an educational tool and may not always be 100% accurate. It is
                    not a replacement for qualified Islamic scholars. For fatwas and important
                    religious rulings, please consult a certified scholar.
                  </div>
                </div>
              </div>
            </RevealBlock>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── WHO IS IT FOR ── */}
          <section className="max-w-5xl mx-auto px-5 py-20">
            <RevealBlock>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}>
                  Who Is It For?
                </h2>
                <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  AI Islam is built for anyone who wants to learn, explore, or deepen their understanding of Islam.
                </p>
              </div>
            </RevealBlock>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {audience.map(({ icon, label, desc }, i) => (
                <RevealBlock key={label} delay={i * 0.08}>
                  <div
                    className="glow-card rounded-2xl p-5 flex flex-col gap-3 text-center h-full"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <span className="icon-bounce flex items-center justify-center">{icon}</span>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 5%' }} />

          {/* ── BUILT BY ── */}
          <section className="max-w-3xl mx-auto px-5 py-20">
            <RevealBlock>
              <div
                className="card-hover rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-start"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="icon-bounce w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-subtle)' }}>
                  <IconBuilding size={24} color="var(--accent)" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Georgia', serif", color: 'var(--text-primary)' }}>
                    Built by Students of Islamic Da'wa Academy
                  </h2>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    AI Islam was conceived and developed by the students of{' '}
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Islamic Da'wa Academy, Akode</span>,
                    mainly led by{' '}
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Hafiz Muhammed Razi</span> — a 10th grade
                    student pursuing his studies while maintaining Hifz Doura and Islamic Studies.
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    The institution is a prime example of higher studies for Huffaz — those who have
                    completed the memorisation of the Holy Quran.
                  </p>
                  {/* Hikma Class Union badge */}
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                    style={{
                      background: 'var(--accent-subtle)',
                      border: '1px solid var(--accent-border)',
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 8px var(--accent)' }} />
                    <span style={{
                      background: 'linear-gradient(90deg, var(--accent), #d4a017)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '0.06em',
                    }}>
                      HIKMA CLASS UNION
                    </span>
                  </div>
                </div>
              </div>
            </RevealBlock>
          </section>

          {/* ── CTA ── */}
          <section className="text-center px-5 pb-24">
            <RevealBlock>
              <div
                className="max-w-2xl mx-auto rounded-2xl p-10 flex flex-col items-center gap-5"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent-border)', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, var(--accent-subtle), transparent)', pointerEvents: 'none' }} />
                <div className="relative">
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
                      <IconMoon size={28} color="var(--accent)" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                    Begin Your Islamic Journey
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '400px', margin: '0 auto 24px' }}>
                    Ask your first question today. No setup, no complexity — just authentic Islamic knowledge at your fingertips.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 rounded-xl text-sm font-bold"
                    style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 24px var(--accent-subtle)' }}
                  >
                    Get Started — It's Free
                  </button>
                </div>
              </div>
            </RevealBlock>
          </section>

          {/* Footer */}
          <footer className="text-center pb-10 text-xs fade-in flex flex-col items-center gap-1.5" style={{ color: 'var(--text-muted)', animationDelay: '0.5s' }}>
            <span>
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
            </span>
            <span style={{ letterSpacing: '0.08em' }}>
              Created by{' '}
              <span style={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, var(--accent), #d4a017)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>HIKMA CLASS UNION</span>
            </span>
          </footer>

        </div>
      </div>
    </PageTransition>
  )
}
