import { useNavigate } from 'react-router-dom'

export default function InstallGuide() {
  const navigate = useNavigate()

  const steps = [
    {
      num: 1,
      label: 'Click the three-dot menu in Chrome',
      desc: 'Look for the ⋮ icon at the top-right corner of your Chrome browser.',
      visual: (
        <div style={{
          display: 'inline-flex', flexDirection: 'column', gap: '4px',
          padding: '10px 14px', borderRadius: '10px',
          background: 'var(--bg-hover)', border: '1px solid var(--border)',
          cursor: 'default',
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: 'var(--text-primary)',
            }} />
          ))}
        </div>
      ),
    },
    {
      num: 2,
      label: 'Tap "Cast, save and share"',
      desc: 'In the dropdown menu, find and click "Cast, save and share".',
      visual: (
        <div style={{
          padding: '10px 18px', borderRadius: '10px',
          background: 'var(--bg-hover)', border: '1px solid var(--border)',
          fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>📤</span> Cast, save and share
        </div>
      ),
    },
    {
      num: 3,
      label: 'Select "Install page as app"',
      desc: 'A sub-menu will appear. Click "Install page as app" to install AI Islam.',
      visual: (
        <div style={{
          padding: '10px 18px', borderRadius: '10px',
          background: 'var(--accent)', border: 'none',
          fontSize: '13px', fontWeight: 700, color: '#fff',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 0 20px var(--accent-subtle)',
        }}>
          <span style={{ fontSize: '16px' }}>⬇️</span> Install page as app
        </div>
      ),
    },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px',
    }}>
      {/* App icon */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: 'var(--accent)', marginBottom: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px var(--accent-subtle)',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      </div>

      <h1 style={{
        fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)',
        margin: '0 0 8px', letterSpacing: '-0.03em', textAlign: 'center',
      }}>
        Install AI Islam
      </h1>
      <p style={{
        fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 40px',
        textAlign: 'center', maxWidth: '320px', lineHeight: 1.6,
      }}>
        Follow these steps to install the app from Chrome.
      </p>

      {/* Steps */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '20px',
        width: '100%', maxWidth: '420px',
      }}>
        {steps.map(step => (
          <div key={step.num} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '18px', padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--accent)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 800, flexShrink: 0,
              }}>
                {step.num}
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {step.label}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              {step.desc}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {step.visual}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '36px', padding: '13px 32px', borderRadius: '14px',
          background: 'transparent', color: 'var(--text-muted)',
          border: '1px solid var(--border)', fontSize: '14px', fontWeight: 500,
          cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-muted)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      >
        ← Go back
      </button>
    </div>
  )
}
