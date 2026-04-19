import { useEffect, useRef, type ReactNode } from 'react'

export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}
