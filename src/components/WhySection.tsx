import { useEffect, useRef, useState } from 'react'

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
  }, [])
  return { ref, visible }
}

function useCountUp(target: number, visible: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target, duration])
  return count
}

const languages = [
  { flag: 'https://flagcdn.com/w40/gb.png', name: 'English' },
  { flag: 'https://flagcdn.com/w40/sa.png', name: 'العربية' },
  { flag: 'https://flagcdn.com/w40/my.png', name: 'Melayu' },
  { flag: 'https://flagcdn.com/w40/id.png', name: 'Indonesia' },
  { flag: 'https://flagcdn.com/w40/pk.png', name: 'اردو' },
  { flag: 'https://flagcdn.com/w40/de.png', name: 'Deutsch' },
  { flag: 'https://flagcdn.com/w40/ru.png', name: 'русский' },
  { flag: 'https://flagcdn.com/w40/es.png', name: 'Español' },
  { flag: 'https://flagcdn.com/w40/tr.png', name: 'Türkçe' },
  { flag: 'https://flagcdn.com/w40/fr.png', name: 'Français' },
  { flag: 'https://flagcdn.com/w40/it.png', name: 'Italiano' },
  { flag: 'https://flagcdn.com/w40/bd.png', name: 'বাংলা' },
]

function RevealDiv({ children, delay = 0, from = 'bottom' }: {
  children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right'
}) {
  const { ref, visible } = useScrollReveal()
  const transforms: Record<string, string> = {
    bottom: 'translateY(36px)',
    left: 'translateX(-36px)',
    right: 'translateX(36px)',
  }
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0)' : transforms[from],
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

function LangPill({ flag, name, i, sectionVisible }: { flag: string; name: string; i: number; sectionVisible: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: '999px',
        color: 'var(--text-primary)',
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible
          ? hovered ? 'scale(1) translateX(-6px)' : 'scale(1) translateX(0)'
          : 'scale(0.8) translateX(0)',
        transition: `opacity 0.4s ease ${0.3 + i * 0.04}s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) ${sectionVisible ? '0s' : `${0.3 + i * 0.04}s`}`,
        cursor: 'default',
      }}
    >
      <img
        src={flag}
        alt={name}
        style={{ width: '22px', height: '15px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
      />
      <span style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
    </div>
  )
}

export default function WhySection() {
  const { ref: sectionRef, visible: sectionVisible } = useScrollReveal()
  const { ref: statsRef, visible: statsVisible } = useScrollReveal()
  const langCount = useCountUp(130, statsVisible)
  const accuracy = useCountUp(90, statsVisible)
  const [selectedLang, setSelectedLang] = useState('Malayalam')
  const [dropOpen, setDropOpen] = useState(false)
  const [query, setQuery] = useState('')

  const langOptions = ['Malayalam', 'English', 'العربية', 'Melayu', 'Indonesia', 'Türkçe', 'Français']

  return (
    <section ref={sectionRef} className="relative max-w-6xl mx-auto px-4 sm:px-8 pb-20 sm:pb-32">

      {/* Heading row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-14"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold shrink-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Why AI Islam?
        </h2>
        <p className="text-sm max-w-xs sm:ml-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.75, paddingTop: '6px' }}>
          AI Islam is a specialized, state-of-the-art application built to provide authentic Islamic guidance, carefully sourcing from trusted Islamic texts.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left col */}
        <div className="flex flex-col gap-6">

          {/* Ask your question card */}
          <RevealDiv delay={0.1} from="left">
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Ask your question</p>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. What are the rulings of Wudu..."
                rows={3}
                style={{
                  width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '12px 14px', fontSize: '13px',
                  color: 'var(--text-primary)', resize: 'none', outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
              />

              {/* Language selector */}
              <div className="mt-4 mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Select Language</p>
                <div
                  onClick={() => setDropOpen(!dropOpen)}
                  className="relative cursor-pointer flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-primary)' }}
                >
                  <span>🌐 {selectedLang}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                  {dropOpen && (
                    <div style={{
                      position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 20,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      borderRadius: '12px', overflow: 'hidden',
                      animation: 'dropIn 0.2s cubic-bezier(0.22,1,0.36,1)',
                    }}>
                      {langOptions.map(l => (
                        <div key={l}
                          onClick={e => { e.stopPropagation(); setSelectedLang(l); setDropOpen(false) }}
                          style={{
                            padding: '10px 16px', fontSize: '13px', cursor: 'pointer',
                            color: l === selectedLang ? 'var(--accent)' : 'var(--text-primary)',
                            background: l === selectedLang ? 'var(--accent-subtle)' : 'transparent',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={e => { if (l !== selectedLang) e.currentTarget.style.background = 'var(--bg-hover)' }}
                          onMouseLeave={e => { if (l !== selectedLang) e.currentTarget.style.background = 'transparent' }}
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Get Answer button */}
              <button
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: '#4ade80', color: '#000', }}
                onMouseEnter={_e => {  }}
                onMouseLeave={_e => {  }}
              >
                Get Answer ✦
              </button>
            </div>
          </RevealDiv>

          {/* Authentic Islamic Companion */}
          <RevealDiv delay={0.2} from="left">
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Authentic Islamic<br />Companion
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Engineered as a highly responsive AI assistant, it specializes in delivering accurate, fastest answers specifically according to the flash.
              </p>
            </div>
          </RevealDiv>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-6">

          {/* Multilingual card */}
          <RevealDiv delay={0.15} from="right">
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Multilingual</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Engage with the AI, read localized UI elements natively, and speak in over 130+ different global languages. Support includes dynamic RTL typing for English.
              </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {languages.map(({ flag, name }, i) => (
                  <LangPill key={name} flag={flag} name={name} i={i} sectionVisible={sectionVisible} />
                ))}
              </div>
            </div>
          </RevealDiv>

          {/* Stats row */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
          {/* 130+ Languages */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between"
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                minHeight: '140px',
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(1)',
                transition: 'opacity 0.55s ease 0.1s, transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)'
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.4)'
                e.currentTarget.style.borderColor = 'var(--border)'
                const inner = e.currentTarget.querySelector('.card-inner') as HTMLElement
                if (inner) inner.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--border)'
                const inner = e.currentTarget.querySelector('.card-inner') as HTMLElement
                if (inner) inner.style.transform = 'translateX(0)'
              }}
            >
              <div className="card-inner" style={{ transition: 'transform 0.3s ease' }}>
                <span style={{ fontSize: '36px' }}>🌍</span>
                <div>
                  <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    {langCount}+
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Languages</p>
                </div>
              </div>
            </div>

            {/* 90% accuracy */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between"
              style={{
                background: '#4ade80', minHeight: '140px',
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(1)',
                transition: 'opacity 0.55s ease 0.2s, transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)'
               
                e.currentTarget.style.filter = 'brightness(1.08)'
                const inner = e.currentTarget.querySelector('.card-inner') as HTMLElement
                if (inner) inner.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.filter = 'brightness(1)'
                const inner = e.currentTarget.querySelector('.card-inner') as HTMLElement
                if (inner) inner.style.transform = 'translateX(0)'
              }}
            >
              <div className="card-inner" style={{ transition: 'transform 0.3s ease' }}>
                <p className="text-4xl font-bold" style={{ color: '#000', letterSpacing: '-0.03em' }}>
                  {accuracy}%
                </p>
                <div>
                  <span style={{ fontSize: '28px' }}>💥</span>
                  <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(0,0,0,0.65)' }}>
                    Exceptional accuracy against authentic texts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  )
}
