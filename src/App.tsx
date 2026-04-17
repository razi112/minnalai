import { useState, useEffect } from 'react'
import { PanelLeft } from 'lucide-react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import SettingsModal from './components/SettingsModal'
import { useChat } from './hooks/useChat'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // 🔥 PWA states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)

  const {
    chats, activeChat, activeChatId, isTyping, streamingContent,
    setActiveChatId, createChat, deleteChat, renameChat,
    sendMessage, regenerate, clearAllChats,
  } = useChat()

  // 🔥 Capture install event
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)

      console.log('INSTALL READY ✅')
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  // 🔥 Install function
  const installApp = async () => {
    if (!deferredPrompt) {
      console.log('Install not available ❌')
      return
    }

    deferredPrompt.prompt()

    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('Installed 🎉')
    } else {
      console.log('User cancelled 😅')
    }

    setDeferredPrompt(null)
    setCanInstall(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden text-app" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="relative hidden md:flex h-full">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewChat={createChat}
          onSelectChat={(id) => setActiveChatId(id)}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Sidebar — mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-30 md:hidden sidebar-transition ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          collapsed={false}
          onToggle={() => setMobileSidebarOpen(false)}
          onNewChat={() => { createChat(); setMobileSidebarOpen(false) }}
          onSelectChat={(id) => { setActiveChatId(id); setMobileSidebarOpen(false) }}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          onOpenSettings={() => { setSettingsOpen(true); setMobileSidebarOpen(false) }}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <PanelLeft size={18} />
          </button>

          {/* Collapsed sidebar toggle */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="hidden md:flex p-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <PanelLeft size={18} />
            </button>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
              {activeChat?.title ?? 'AI Chat'}
            </h1>
          </div>

          {/* 🔥 Install Button */}
          {canInstall && (
            <button
              onClick={installApp}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              Install ⚡
            </button>
          )}

          {/* Model badge */}
         
        </header>

        {/* Chat */}
        <ChatArea
          chat={activeChat}
          isTyping={isTyping}
          streamingContent={streamingContent}
          onSend={sendMessage}
          onRegenerate={regenerate}
        />
      </div>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          onClose={() => setSettingsOpen(false)}
          onClearChats={clearAllChats}
        />
      )}
    </div>
  )
}
