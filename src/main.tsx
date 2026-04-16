import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Features from './pages/Features.tsx'
import InstallGuide from './pages/InstallGuide.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import SplashLoader from './components/SplashLoader.tsx'
import PWAInstallPrompt from './components/PWAInstallPrompt.tsx'

// Capture PWA install prompt as early as possible
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
declare global { interface Window { __pwaPrompt: BeforeInstallPromptEvent | null } }
window.__pwaPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaPrompt = e as BeforeInstallPromptEvent
})

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SplashLoader>
          <BrowserRouter>
            <PWAInstallPrompt />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <App />
                  </ProtectedRoute>
                }
              />
              <Route path="/features" element={<Features />} />
              <Route path="/install" element={<InstallGuide />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </SplashLoader>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
