import { useState, useRef, useEffect } from 'react'
import { Plus, MessageSquare, Pencil, Trash2, Settings, Menu, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Chat } from '../hooks/useChat'
import { useAuth, GUEST_MESSAGE_LIMIT } from '../context/AuthContext'
import AccountModal from './AccountModal'

interface Props {
  chats: Chat[]
  activeChatId: string | null
  collapsed: boolean
  onToggle: () => void
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onRenameChat: (id: string, title: string) => void
  onOpenSettings: () => void
}

export default function Sidebar({
  chats, activeChatId, collapsed, onToggle, onNewChat,
  onSelectChat, onDeleteChat, onRenameChat, onOpenSettings,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const editRef = useRef<HTMLInputElement>(null)
  const { user, isGuest, guestMessageCount } = useAuth()
  const navigate = useNavigate()

  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'Account'
  const avatar = user?.user_metadata?.avatar_url ?? null
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus()
  }, [editingId])

  const startEdit = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(chat.id)
    setEditValue(chat.title)
  }

  const commitEdit = (id: string) => {
    if (editValue.trim()) onRenameChat(id, editValue.trim())
    setEditingId(null)
  }

  return (
    <aside
      className={`sidebar-transition flex flex-col h-full shrink-0 relative ${collapsed ? 'w-0 overflow-hidden' : 'w-[260px]'}`}
      style={{ background: 'var(--bg-primary)', borderRight: '1px solid var(--border)' }}
    >
      <div className="flex flex-col h-full p-3 pb-0">

        {/* Top bar: logo centered + hamburger right */}
        <div className="relative flex items-center justify-center mb-4 pt-1">
          {/* Logo */}
          <img
            src="/favicon.ico"
            alt="AI Islam logo"
            className="w-10 h-10 rounded-full"
            style={{ objectFit: 'cover' }}
          />
          {/* Hamburger toggle */}
          <button
            onClick={onToggle}
            className="absolute right-0 p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* New Chat — full width accent pill */}
        <button
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all duration-150 active:scale-95"
          style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 0 16px var(--accent-subtle)' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5">
          {chats.length === 0 && (
            <p className="text-xs px-3 py-4 text-center" style={{ color: 'var(--text-muted)' }}>No chats yet</p>
          )}
          {chats.map((chat) => {
            const isActive = activeChatId === chat.id
            return (
              <div
                key={chat.id}
                className="relative group flex items-center rounded-lg cursor-pointer transition-all duration-150"
                style={{
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onMouseEnter={e => {
                  setHoveredId(chat.id)
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'
                }}
                onMouseLeave={e => {
                  setHoveredId(null)
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 px-3 py-2.5">
                  <MessageSquare size={14} className="shrink-0 opacity-50" />
                  {editingId === chat.id ? (
                    <input
                      ref={editRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => commitEdit(chat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit(chat.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 min-w-0 text-sm rounded px-1.5 py-0.5 outline-none"
                      style={{
                        background: 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                      }}
                    />
                  ) : (
                    <span className="text-sm truncate">{chat.title}</span>
                  )}
                </div>
                {hoveredId === chat.id && editingId !== chat.id && (
                  <div className="flex items-center gap-0.5 pr-2 shrink-0">
                    <button
                      onClick={(e) => startEdit(chat, e)}
                      title="Rename"
                      className="p-1.5 rounded-md transition-all"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id) }}
                      title="Delete"
                      className="p-1.5 rounded-md transition-all hover:text-red-400 hover:bg-red-500/10"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom actions */}
        <div className="mt-2 pt-2 space-y-0.5" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-hover)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <Settings size={15} className="shrink-0" />
            <span>Settings</span>
          </button>

          {isGuest ? (
            /* Guest — show sign-in prompt with message counter */
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-hover)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg-hover)', border: '1px dashed var(--border)' }}
              >
                <LogIn size={10} style={{ color: 'var(--text-muted)' }} />
              </div>
              <span className="truncate flex-1 text-left">Guest</span>
              <span
                className="shrink-0 text-xs px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: 'var(--accent-subtle)', color: 'var(--accent)', fontSize: '10px' }}
              >
                {guestMessageCount}/{GUEST_MESSAGE_LIMIT}
              </span>
            </button>
          ) : (
            /* Logged-in user */
            <button
              onClick={() => setAccountOpen(true)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-hover)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              {avatar ? (
                <img src={avatar} alt={name} className="w-5 h-5 rounded-full object-cover shrink-0" />
              ) : (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: 'var(--accent)' }}
                >
                  {initials}
                </div>
              )}
              <span className="truncate">{name}</span>
            </button>
          )}
        </div>

        {!isGuest && accountOpen && <AccountModal onClose={() => setAccountOpen(false)} />}
      </div>
    </aside>
  )
}
