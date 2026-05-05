import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type ThemeMode = 'Light' | 'Dark' | 'System'
type Contrast = 'Default' | 'High'

interface ThemeContextValue {
  theme: ThemeMode
  contrast: Contrast
  accent: string
  setTheme: (t: ThemeMode) => void
  setContrast: (c: Contrast) => void
  setAccent: (a: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}

function getSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: ThemeMode, contrast: Contrast, accent: string) {
  const root = document.documentElement
  const isDark = theme === 'Dark' || (theme === 'System' && getSystemDark())

  // Theme
  root.classList.toggle('dark-theme', isDark)
  root.classList.toggle('light-theme', !isDark)

  // Contrast
  root.classList.toggle('high-contrast', contrast === 'High')

  // Accent CSS variable
  root.style.setProperty('--accent', accent)

  // Derive lighter/darker accent variants
  root.style.setProperty('--accent-subtle', accent + '22')
  root.style.setProperty('--accent-border', accent + '55')

  if (isDark) {
    root.style.setProperty('--bg-primary', contrast === 'High' ? '#000000' : '#0f0f0f')
    root.style.setProperty('--bg-secondary', contrast === 'High' ? '#0a0a0a' : '#141414')
    root.style.setProperty('--bg-hover', contrast === 'High' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)')
    root.style.setProperty('--text-primary', contrast === 'High' ? '#ffffff' : '#ececec')
    root.style.setProperty('--text-secondary', contrast === 'High' ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.6)')
    root.style.setProperty('--text-muted', contrast === 'High' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)')
    root.style.setProperty('--border', contrast === 'High' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)')
    root.style.setProperty('--bubble-user', contrast === 'High' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)')
  } else {
    root.style.setProperty('--bg-primary', contrast === 'High' ? '#f0f0f0' : '#f7f7f8')
    root.style.setProperty('--bg-secondary', contrast === 'High' ? '#e4e4e4' : '#ececec')
    root.style.setProperty('--bg-hover', contrast === 'High' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)')
    root.style.setProperty('--text-primary', contrast === 'High' ? '#000000' : '#111111')
    root.style.setProperty('--text-secondary', contrast === 'High' ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.6)')
    root.style.setProperty('--text-muted', contrast === 'High' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)')
    root.style.setProperty('--border', contrast === 'High' ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.08)')
    root.style.setProperty('--bubble-user', contrast === 'High' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.06)')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('Dark')
  const [contrast, setContrastState] = useState<Contrast>('Default')
  const [accent, setAccentState] = useState('#7c3aed')

  const setTheme = (t: ThemeMode) => { setThemeState(t); applyTheme(t, contrast, accent) }
  const setContrast = (c: Contrast) => { setContrastState(c); applyTheme(theme, c, accent) }
  const setAccent = (a: string) => { setAccentState(a); applyTheme(theme, contrast, a) }

  // Apply on mount + listen for system changes
  useEffect(() => {
    applyTheme(theme, contrast, accent)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => { if (theme === 'System') applyTheme('System', contrast, accent) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, contrast, accent])

  return (
    <ThemeContext.Provider value={{ theme, contrast, accent, setTheme, setContrast, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}
