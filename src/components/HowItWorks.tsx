import { useEffect, useRef, useState } from 'react'
import { Mic, BookOpen, CheckCircle } from 'lucide-react'

function useScrollReveal(threshold = 0.15) {
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
  }, [])
  return { ref, visible }
}

const steps = [
  {
    icon: <Mic size={30} />,
    color: '#7c5af6',
    title: 'Ask Your Question',
    desc: 'Formulate your query natively via typing or continuous voice dictation in over 130 languages.',
  },
  {
    icon: <BookOpen size={30} />,
    color: '#e0407b',
    title: 'AI Processing',
    desc: 'Our system cross-references authentic Shafi\'i texts like Fathul Mueen securely in the background.',
  },
  {
    icon: <CheckCircle size={30} />,
    color: '#22c97a',
    title: 'Get Accurate Ruling',
    desc: 'Minnal AI delivers lightning-fast, precise answers you can trust, right to your screen.',
  },
]

export default function HowItWorks() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      ref={ref}
      className="relative max-w-5xl mx-auto px-4 sm:px-8 pb-20 sm:pb-32"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity .6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <h2
          className="text-3xl sm:text-4xl font-bold inline-flex flex-wrap items-center justify-center gap-3"
          style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          Simplify Your Quest for
          <span
            className="px-4 py-1 rounded-xl text-3xl sm:text-4xl font-bold"
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              display: 'inline-block',
              transform: 'scale(1)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            Minnal AI 
          </span>
        </h2>
      </div>

      {/* Steps */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 sm:gap-0">

        {/* Connector line — desktop only */}
        <div
          className="hidden sm:block absolute top-9 left-[16%] right-[16%] h-px"
          style={{
            background: 'linear-gradient(to right, var(--border), var(--border))',
            zIndex: 0,
          }}
        />

        {steps.map(({ icon, color, title, desc }, i) => (
          <div
            key={title}
            className="relative z-10 flex flex-col items-center text-center flex-1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.55s ease ${0.15 + i * 0.15}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.15}s`,
            }}
          >
            {/* Icon circle */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{
                background: color,
                boxShadow: `0 8px 28px ${color}55`,
                color: '#fff',
                transform: 'scale(1)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.15)'
                e.currentTarget.style.boxShadow = `0 12px 36px ${color}88`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `0 8px 28px ${color}55`
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.95)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.15)' }}
            >
              {icon}
            </div>

            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</p>
            <p className="text-xs max-w-[180px]" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
