import { useEffect, useRef, useState } from 'react'
import { Bell, KeyRound, Palette, Link2 } from 'lucide-react'

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

const PHONE: React.CSSProperties = {
  width: 'min(260px, 80vw)',
  height: 'min(520px, 70vh)',
  borderRadius: '48px',
  overflow: 'hidden',
  position: 'relative',
  border: '2px solid rgba(255,255,255,0.12)',
  boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
  flexShrink: 0,
}

const features = [
  {
    icon: <Bell size={20} />,
    title: 'Push Notifications',
    desc: 'AI Usthad processes complex cloud queries in the background and blasts an FCM push notification straight to your lock screen the exact moment your answer is ready.',
  },
  {
    icon: <KeyRound size={20} />,
    title: 'Frictionless Onboarding',
    desc: 'Seamless OTP-based login architectures alongside one-tap Google Sign-In support globally.',
  },
  {
    icon: <Palette size={20} />,
    title: 'Persistent Theming',
    desc: 'Your chosen theme, accent color, and display preferences are saved and restored across every session automatically.',
  },
  {
    icon: <Link2 size={20} />,
    title: 'Deep Linking',
    desc: 'Share any conversation or answer via a unique URL that opens directly inside the app on any device.',
  },
]

function Notch({ bg }: { bg: string }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: '80px', height: '28px', background: bg, zIndex: 10,
      borderRadius: '0 0 16px 16px',
    }} />
  )
}

function HomeBar() {
  return (
    <div style={{
      position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
      width: '100px', height: '4px', borderRadius: '9999px',
      background: 'rgba(255,255,255,0.25)',
    }} />
  )
}

function PhoneNotification({ visible }: { visible: boolean }) {
  return (
    <div style={{ ...PHONE, background: '#0a0a0a' }}>
      <Notch bg="#0a0a0a" />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '64px', paddingLeft: '20px', paddingRight: '20px', height: '100%',
      }}>
        <p style={{ fontSize: '48px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginTop: '16px' }}>
          09:41
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
          Friday, March 24
        </p>
        <div
          style={{
            width: '100%', marginTop: '40px', borderRadius: '16px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(30,30,30,0.95)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            animation: visible ? 'notifSlideIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.7s both' : 'none',
            cursor: 'default',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px', background: '#22c97a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>AI Islam </p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>now</p>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
              Your answered query on Wudu is ready.
            </p>
          </div>
        </div>
      </div>
      <HomeBar />
    </div>
  )
}

function PhoneOTP() {
  const digits = ['4', '2', '', '']
  return (
    <div style={{
      width: 'min(300px, 85vw)',
      background: '#1a1a1a',
      borderRadius: '28px',
      padding: 'clamp(20px, 5vw, 36px) clamp(16px, 5vw, 28px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      
    }}>
      <div style={{
        width: '60px', height: '60px', borderRadius: '50%',
        background: 'rgba(74,222,128,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <KeyRound size={26} color="#4ade80" />
      </div>

      <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
        Verify Number
      </p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '28px', textAlign: 'center' }}>
        Enter the OTP sent to your device
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        {digits.map((d, i) => (
          <div key={i} style={{
            width: '58px', height: '58px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.06)',
            border: i === 1 ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: i === 1 ? '0 0 14px rgba(74,222,128,0.35)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 700, color: '#fff',
          }}>
            {d}
          </div>
        ))}
      </div>

      <button style={{
        width: '100%', padding: '15px', borderRadius: '999px',
        background: '#fff', color: '#000', fontWeight: 700,
        fontSize: '15px', border: 'none', marginBottom: '16px', cursor: 'pointer',
      }}>
        Continue
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      </div>

      <button style={{
        width: '100%', padding: '15px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', fontWeight: 700, fontSize: '15px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer',
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Google
      </button>
    </div>
  )
}

function PhoneTheme() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 'min(300px, 85vw)',
        height: '380px',
        borderRadius: '32px',
        overflow: 'hidden',
        position: 'relative',
        border: 'none',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        cursor: 'pointer',
        background: '#f0f0f0',
      }}
    >
      {/* Dark right panel — slides in from right */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0,
        width: hovered ? '65%' : '50%',
        background: '#111',
        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* Light side icon */}
      <div style={{ position: 'absolute', top: '36px', left: '28px', zIndex: 2 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div style={{ marginTop: '52px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ width: '80px', height: '9px', borderRadius: '6px', background: 'rgba(0,0,0,0.1)' }} />
          <div style={{ width: '60px', height: '9px', borderRadius: '6px', background: 'rgba(0,0,0,0.07)' }} />
        </div>
      </div>

      {/* Dark side icon */}
      <div style={{ position: 'absolute', top: '36px', right: '28px', zIndex: 2 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
        <div style={{ marginTop: '52px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ width: '80px', height: '9px', borderRadius: '6px', background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ width: '60px', height: '9px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      {/* Palette icon on the divider — moves right on hover */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: hovered ? 'calc(35% - 26px)' : 'calc(50% - 26px)',
        transform: 'translateY(-50%)',
        transition: 'left 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: 10,
        width: '52px', height: '52px', borderRadius: '50%',
        background: '#4ade80',
        boxShadow: '0 0 28px rgba(74,222,128,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '3px solid #111',
      }}>
        <Palette size={22} color="#000" />
      </div>

      {/* Bottom accent bars */}
      <div style={{
        position: 'absolute', bottom: '28px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', gap: '8px',
        alignItems: 'center', zIndex: 2,
      }}>
        <div style={{ width: '80px', height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{
          height: '6px', borderRadius: '4px',
          background: '#4ade80',
          boxShadow: '0 0 10px rgba(74,222,128,0.5)',
          width: hovered ? '80px' : '48px',
          transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  )
}

function PhoneDeepLink() {
  return (
    <div style={{
      width: '100%', maxWidth: '420px', height: 'min(320px, 50vw)', minHeight: '220px', borderRadius: '28px',
      background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
      padding: '0 24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Share card */}
      <div style={{
        background: '#2563eb', borderRadius: '16px', padding: '14px 16px',
        minWidth: '150px',
        animation: 'dlCardIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px', lineHeight: 1.4 }}>
          Look at this specific Fatwa I found!
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.18)', borderRadius: '10px',
          padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>AI Islam App</p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.2 }}>/chat/3f9a2...</p>
          </div>
        </div>
      </div>

      {/* Animated dashed arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: '6px', height: '2px', borderRadius: '2px',
            background: 'rgba(255,255,255,0.4)',
            animation: `dlDash 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: 'dlArrow 1.2s ease-in-out infinite', marginLeft: '2px' }}>
          <path d="M2 6h8M7 3l3 3-3 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* App icon */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: '#fff', border: '3px solid #222',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        animation: 'dlAppPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', background: '#4ade80',
          animation: 'dlPulse 2s ease-in-out infinite',
          boxShadow: '0 0 12px rgba(74,222,128,0.6)',
        }} />
      </div>

      <style>{`
        @keyframes dlCardIn {
          from { opacity: 0; transform: translateX(-20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes dlAppPop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dlDash {
          0%, 100% { opacity: 0.2; transform: translateX(0); }
          50%       { opacity: 1;   transform: translateX(3px); }
        }
        @keyframes dlArrow {
          0%, 100% { opacity: 0.4; transform: translateX(0); }
          50%       { opacity: 1;   transform: translateX(4px); }
        }
        @keyframes dlPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(74,222,128,0.4); transform: scale(1); }
          50%       { box-shadow: 0 0 20px rgba(74,222,128,0.8); transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}

export default function QueryExperience() {
  const { ref, visible } = useScrollReveal()
  const [activeIndex, setActiveIndex] = useState(0)

  const phoneMap = [
    <PhoneNotification visible={visible} />,
    <PhoneOTP />,
    <PhoneTheme />,
    <PhoneDeepLink />,
  ]

  return (
    <section
      ref={ref}
      className="relative max-w-6xl mx-auto px-4 sm:px-8 pb-20 sm:pb-32"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div className="mb-12">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-3"
          style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          Seamless Query Experience
        </h2>
        <p className="text-base max-w-md" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Engineered for a global audience, blending continuous voice interfaces, biometric security, and background AI processing.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center">
        {/* Feature list */}
        <div className="flex flex-col gap-3 flex-1 w-full">
          {features.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              onClick={() => setActiveIndex(i)}
              className="glow-card rounded-2xl px-6 py-5 cursor-pointer"
              style={{
                background: activeIndex === i ? 'var(--bg-secondary)' : 'transparent',
                border: `1px solid ${activeIndex === i ? 'var(--accent-border)' : 'var(--border)'}`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0) scale(1)' : 'translateX(-32px) scale(1)',
                transition: `opacity 0.5s ease ${0.1 + i * 0.1}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.1}s, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease`,
                boxShadow: activeIndex === i ? '0 0 0 1px var(--accent-border), 0 4px 20px rgba(0,0,0,0.2)' : 'none',
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: activeIndex === i ? 'var(--accent-subtle)' : 'var(--bg-hover)',
                    color: activeIndex === i ? 'var(--accent)' : 'var(--text-muted)',
                    transition: 'background 0.3s ease, color 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: activeIndex === i ? 'scale(1.12)' : 'scale(1)',
                  }}
                >
                  {icon}
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: activeIndex === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {title}
                </p>
                {activeIndex === i && (
                  <div style={{
                    marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent)',
                    animation: 'dotPop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                )}
              </div>
              <div style={{
                maxHeight: activeIndex === i ? '120px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}>
                <p className="text-sm mt-3 ml-14" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Phone / card mockup */}
        <div
          className="flex-1 flex items-center justify-center w-full overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
            transition: 'opacity 0.65s ease 0.25s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.25s',
          }}
        >
          <div key={activeIndex} style={{ animation: 'notifSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) both', maxWidth: '100%', overflow: 'hidden' }}>
            {phoneMap[activeIndex]}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotPop {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  )
}
