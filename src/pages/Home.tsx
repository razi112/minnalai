import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import FAQ from '../components/FAQ'
import HowItWorks from '../components/HowItWorks'
import QueryExperience from '../components/QueryExperience'
import WhySection from '../components/WhySection'
import { Sparkles, Zap, Shield, MessageSquare } from 'lucide-react'

const features = [
  { icon: <Zap size={20} />, title: 'Lightning Fast', desc: 'Powered by Gemini 2.5 Flash for near-instant responses.' },
  { icon: <Shield size={20} />, title: 'Secure & Private', desc: 'Your conversations are encrypted and never shared.' },
  { icon: <MessageSquare size={20} />, title: 'Multi-turn Chat', desc: 'Context-aware conversations that remember your thread.' },
  { icon: <Sparkles size={20} />, title: 'Smart Suggestions', desc: 'AI-powered prompts to help you get the most out of every chat.' },
]

function ScrollRevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />

        <div
          className="fixed inset-0 pointer-events-none fade-in"
          style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, var(--accent-subtle) 0%, transparent 65%)', animationDelay: '0.1s' }}
        />

        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 sm:pt-52 pb-32 sm:pb-56 gap-8">

          <style>{`
            @keyframes float-y  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
            @keyframes float-y2 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-14px)} }
          `}</style>

          {/* mosque — upper left */}
          <div style={{ position:'absolute', left:'calc(50% - 180px)', top:'160px', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:12, animation:'float-y 4s ease-in-out infinite', zIndex:1 }} className="hidden sm:flex">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"/><path d="M9 21V10l3-3 3 3v11"/><path d="M12 3a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2z"/><path d="M5 21V14a2 2 0 0 1 2-2h1"/><path d="M19 21V14a2 2 0 0 0-2-2h-1"/>
            </svg>
          </div>

          {/* quran — upper right */}
          <div style={{ position:'absolute', left:'calc(50% + 136px)', top:'160px', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:12, animation:'float-y2 5s ease-in-out infinite 0.4s', zIndex:1 }} className="hidden sm:flex">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>

          {/* crescent moon — lower left */}
          <div style={{ position:'absolute', left:'calc(50% - 260px)', top:'210px', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:10, animation:'float-y 6s ease-in-out infinite 1s', zIndex:1 }} className="hidden md:flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>

          {/* compass/qibla — lower right */}
          <div style={{ position:'absolute', left:'calc(50% + 220px)', top:'210px', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:10, animation:'float-y2 4.5s ease-in-out infinite 0.8s', zIndex:1 }} className="hidden md:flex">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
          </div>

          {/* center flash/zap — directly above heading */}
          <div style={{ position:'absolute', left:'50%', top:'168px', transform:'translateX(-50%)', width:56, height:56, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--accent-subtle)', border:'1px solid var(--accent-border)', borderRadius:14, animation:'float-y 3.5s ease-in-out infinite', zIndex:1 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight max-w-3xl fade-up fade-up-delay-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            Your Intelligent & Authentic
AI{' '}
            <span style={{ color: '#7c3aed' }}>Effortlessly</span>
          </h1>

          <p
            className="text-lg max-w-xl fade-up fade-up-delay-2"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            A clean, fast AI chat experience. Ask anything, get instant answers, and keep your conversations organized.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 fade-up fade-up-delay-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl text-sm font-bold"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                boxShadow: '0 0 18px var(--accent-subtle)',
                transform: 'scale(1)',
                transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 28px var(--accent-border)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 18px var(--accent-subtle)' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
            >
              Start Your Journey
            </button>

            <button
              onClick={() => window.open('https://developer.android.com/studio', '_blank')}
              className="relative px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                transform: 'scale(1)',
                transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--accent-border)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
            >
              <span
                className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                style={{ background: 'var(--accent)', color: '#fff', fontSize: '10px', lineHeight: '1.5', pointerEvents: 'none' }}
              >
                Coming Soon
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17.523 15.341a5.5 5.5 0 1 0-11 0" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="7" y1="15.341" x2="5" y2="18" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17" y1="15.341" x2="19" y2="18" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="9" y1="10" x2="9" y2="10.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="15" y1="10" x2="15" y2="10.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download for Android
            </button>
          </div>
        </section>

        {/* Features grid */}
        <section className="relative max-w-5xl mx-auto px-4 sm:px-8 pb-20 sm:pb-32 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon, title, desc }, i) => (
            <ScrollRevealCard key={title} delay={i * 0.1}>
              <div
                className={`glow-card hover-scale rounded-2xl p-8 flex flex-col gap-4`}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div
                  className="icon-bounce w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            </ScrollRevealCard>
          ))}
        </section>

        <HowItWorks />
        <QueryExperience />
        <WhySection />
        <FAQ />

        {/* Footer */}
        <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', marginTop: '24px' }}>
          <style>{`
            @keyframes slide-in-top {
              0%   { transform: translateY(-50px); opacity: 0; }
              100% { transform: translateY(0);     opacity: 1; }
            }
            .footer-social a { transition: background-color 0.3s, transform 0.3s; }
            .footer-social a:active { transform: scale(0.9) !important; }
            .footer-social a:hover svg { animation: slide-in-top 0.3s both; }
            .footer-social .s-ig:hover  { background-color: #d62976 !important; transform: scale(1.2); }
            .footer-social .s-tw:hover  { background-color: #00acee !important; transform: scale(1.2); }
            .footer-social .s-li:hover  { background-color: #0072b1 !important; transform: scale(1.2); }
            .footer-social .s-wa:hover  { background-color: #128c7e !important; transform: scale(1.2); }
            .footer-ql a:hover { color: var(--text-primary) !important; padding-left: 6px !important; }
          `}</style>

          {/* Glow */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '700px', height: '260px', background: 'radial-gradient(ellipse at center, var(--accent-subtle) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Main grid */}
          <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', padding: '64px 24px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', alignItems: 'start' }}>

            {/* Left — brand + social */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 20px rgba(74,222,128,0.6)', flexShrink: 0 }} />
                <span style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, fontStyle: 'italic' }}>
                  Minnal AI
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '300px', margin: 0 }}>
                Authentic Islamic guidance powered by AI — fast, accurate, and multilingual.
              </p>

              {/* Social icons */}
              <div className="footer-social" style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                {/* Instagram */}
                <a href="#" aria-label="Instagram" className="s-ig" style={{ width: '52px', height: '52px', background: 'rgb(65,29,131)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 16 16" style={{ width: '17px' }}><path fill="#fff" d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>
                </a>
                {/* Twitter/X */}
                <a href="#" aria-label="Twitter" className="s-tw" style={{ width: '52px', height: '52px', background: 'rgb(65,29,131)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 16 16" style={{ width: '17px' }}><path fill="#fff" d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" aria-label="LinkedIn" className="s-li" style={{ width: '52px', height: '52px', background: 'rgb(65,29,131)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 448 512" style={{ width: '17px' }}><path fill="#fff" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
                </a>
                {/* WhatsApp */}
                <a href="#" aria-label="WhatsApp" className="s-wa" style={{ width: '52px', height: '52px', background: 'rgb(65,29,131)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <svg viewBox="0 0 16 16" style={{ width: '17px' }}><path fill="#fff" d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                </a>
              </div>
            </div>

            {/* Right — Quick Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>Quick Links</p>
              <div className="footer-ql" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Features', href: '/features' },
                  { label: 'About', href: '/about' },
                  { label: 'Get Started', href: '/login' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s, padding-left 0.2s', paddingLeft: '0' }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '0 24px' }} />

          {/* Bottom bar */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '18px 24px', display: 'flex', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              © {new Date().getFullYear()} Minnal AI. All Rights Reserved.
            </p>
          </div>
        </footer>

      </div>
    </PageTransition>
  )
}
