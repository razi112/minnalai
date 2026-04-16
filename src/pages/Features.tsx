import { useNavigate } from 'react-router-dom'
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
  },
  {
    icon: <Zap size={24} />,
    title: 'Near-instant Responses',
    desc: 'Streaming output means you see the answer as it\'s generated — no waiting for the full response to load.',
    badge: 'Performance',
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Multi-turn Conversations',
    desc: 'Full conversation memory within a session. The AI remembers what you said earlier and builds on it naturally.',
    badge: 'Chat',
  },
  {
    icon: <Code2 size={24} />,
    title: 'Code Generation & Review',
    desc: 'Write, debug, and explain code across 50+ languages. Syntax-highlighted output with copy-to-clipboard.',
    badge: 'Developer',
  },
]

const secondaryFeatures = [
  { icon: <RefreshCw size={18} />, title: 'Regenerate Responses', desc: 'Not happy with an answer? Regenerate with one click for a fresh take.' },
  { icon: <History size={18} />, title: 'Chat History', desc: 'All your conversations saved locally. Pick up right where you left off.' },
  { icon: <Moon size={18} />, title: 'Dark & Light Mode', desc: 'Fully themed UI with system preference detection and manual override.' },
  { icon: <Languages size={18} />, title: 'Multilingual', desc: 'Chat in any language. The model understands and responds in your language.' },
  { icon: <SlidersHorizontal size={18} />, title: 'Customizable Accent', desc: 'Pick your accent color and make the interface feel like yours.' },
  { icon: <Layers size={18} />, title: 'Markdown Rendering', desc: 'Responses render rich markdown — tables, lists, bold, italic, and more.' },
  { icon: <Mic size={18} />, title: 'Voice Input Ready', desc: 'Built with extensibility in mind — voice input support coming soon.' },
  { icon: <ImageIcon size={18} />, title: 'Image Understanding', desc: 'Multimodal support lets you share images and ask questions about them.' },
  { icon: <Lock size={18} />, title: 'Auth & Accounts', desc: 'Secure sign-in via email/password or Google OAuth powered by Supabase.' },
  { icon: <Shield size={18} />, title: 'Private by Default', desc: 'No conversation data is stored on external servers without your consent.' },
  { icon: <Sparkles size={18} />, title: 'Smart Prompt Chips', desc: 'Starter prompts on new chats to help you get going instantly.' },
  { icon: <Wifi size={18} />, title: 'Offline-aware', desc: 'Graceful error handling when connectivity drops — no silent failures.' },
]

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
            className="text-5xl sm:text-6xl font-bold mb-5 fade-up fade-up-delay-1"
            style={{ letterSpacing: '-0.03em' }}
          >
            Built for real{' '}
            <span style={{ color: 'var(--accent)' }}>AI conversations.</span>
          </h1>
          <p
            className="text-lg max-w-xl mx-auto fade-up fade-up-delay-2"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}
          >
            Every feature is designed to make your AI interactions faster, smarter, and more enjoyable.
          </p>
        </section>

        {/* Main feature cards */}
        <section className="relative max-w-5xl mx-auto px-8 pb-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mainFeatures.map(({ icon, title, desc, badge }, i) => (
            <div
              key={title}
              className={`glow-card hover-scale rounded-2xl p-7 flex flex-col gap-4 fade-up fade-up-delay-${i + 1}`}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="icon-bounce w-11 h-11 rounded-xl flex items-center justify-center scale-in"
                  style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', animationDelay: `${0.2 + i * 0.08}s` }}
                >
                  {icon}
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                >
                  {badge}
                </span>
              </div>
              <div>
                <p className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-5xl mx-auto px-8 pb-8 fade-up fade-up-delay-2">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>AND MORE</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Secondary features */}
        <section className="relative max-w-5xl mx-auto px-8 pb-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {secondaryFeatures.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className={`glow-card hover-scale rounded-xl p-5 flex gap-4 fade-up fade-up-delay-${(i % 4) + 1}`}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <div
                className="icon-bounce w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
              >
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="relative text-center px-6 pb-24 fade-up fade-up-delay-3">
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>All features. No paywalls.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3 rounded-full text-sm font-semibold"
            style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px var(--accent-subtle)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Start for free
          </button>
        </section>

        <footer className="text-center pb-8 text-xs fade-in" style={{ color: 'var(--text-muted)', animationDelay: '0.6s' }}>
          © {new Date().getFullYear()} AI Chatbot. All rights reserved.
        </footer>
      </div>
    </PageTransition>
  )
}
