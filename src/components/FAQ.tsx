import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is Minnal AI ?',
    a: 'Minnal AI  is an intelligent chat platform powered by Google\'s Gemini 2.5 Flash model. It lets you have natural, multi-turn conversations with an AI that understands context, answers questions, writes code, and much more.',
  },
  {
    q: 'How accurate and authentic is the knowledge?',
    a: 'The AI is trained on a vast corpus of high-quality data. While it strives for accuracy, it can occasionally make mistakes. Always verify critical information — especially for medical, legal, or financial decisions — with authoritative sources.',
  },
  {
    q: 'Is my conversation data private?',
    a: 'Yes. Your chats are stored locally in your browser and are never shared with third parties. Authentication is handled securely via Supabase with row-level security, so only you can access your data.',
  },
  {
    q: 'Who developed Minnal AI ?',
    a: "Minnal AI was conceived and developed by the Students of Islamic Da'wa Academy, Akode, mainly led by Hafiz Muhammed Razi a 10th student at Islamic Da'wa Academy pursuing 10th while maintaining Hifz Doura and Islamic Studies. The institution is a prime example for the higher studies of Huffaz (those who have completed Hifz).",
  },
  {
    q: 'Can I use it in my own language?',
    a: 'Absolutely. Gemini 2.5 Flash is multilingual. Just type in your preferred language and the AI will understand and respond in kind.',
  },
  {
    q: 'How should I use it safely?',
    a: 'Treat AI responses as a helpful starting point, not a final authority. Avoid sharing sensitive personal information in chats. For important decisions, cross-check with verified human experts.',
  },
  {
    q: 'Is there a message limit?',
    a: 'Currently there is no hard message limit per session. Usage is subject to the underlying Gemini API quota. If you hit a rate limit, simply wait a moment and try again.',
  },
  {
    q: 'Can the AI remember previous sessions?',
    a: 'Within a single chat session the AI has full memory of the conversation. Across separate chat sessions, each conversation starts fresh — but your chat history is saved so you can always scroll back.',
  },
]

function useScrollReveal() {
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

  return { ref, visible }
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const { ref, visible } = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.07}s`,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="faq-btn w-full flex items-center justify-between gap-4 py-5 text-left"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', transform: 'scale(1)', transition: 'transform 0.2s ease' }}
      >
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{q}</span>
        <span
          style={{
            color: 'var(--accent)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            flexShrink: 0,
          }}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <p
          className="text-sm pb-5"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="relative max-w-3xl mx-auto px-8 pb-32">
      {/* Section header — scroll reveal */}
      <div
        ref={ref}
        className="text-center mb-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <h2
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          Frequently Asked Questions
        </h2>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Everything you need to know about the AI Usthad platform, the authenticity of the knowledge, and how to use it safely.
        </p>
      </div>

      {/* FAQ items */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '0 24px',
        }}
      >
        <style>{`.faq-btn:hover { transform: scale(1.01) !important; }`}</style>
        {faqs.map((item, i) => (
          <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
        ))}
      </div>
    </section>
  )
}
