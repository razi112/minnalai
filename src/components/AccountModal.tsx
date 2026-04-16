import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, LogOut, Mail, Pencil, Check, Camera, Loader } from 'lucide-react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

interface Props { onClose: () => void }

export default function AccountModal({ onClose }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const storedName: string = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'User'
  const storedAvatar: string | null = user?.user_metadata?.avatar_url ?? null

  const [displayName, setDisplayName] = useState(storedName)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(storedAvatar)

  // Sync avatar when user metadata updates (e.g. after Google OAuth)
  useEffect(() => {
    const url = user?.user_metadata?.avatar_url ?? null
    if (url) setAvatarUrl(url)
  }, [user?.user_metadata?.avatar_url])
  const [editingName, setEditingName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [okMsg, setOkMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const email = user?.email ?? ''
  const provider: string = user?.app_metadata?.provider ?? 'email'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  function showOk(msg: string) { setOkMsg(msg); setTimeout(() => setOkMsg(''), 3000) }
  function showErr(msg: string) { setErrMsg(msg); setTimeout(() => setErrMsg(''), 5000) }

  async function saveName() {
    if (!displayName.trim() || displayName.trim() === storedName) { setEditingName(false); return }
    setSavingName(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: displayName.trim() } })
    setSavingName(false)
    if (error) { showErr(error.message); return }
    setEditingName(false)
    showOk('Name updated.')
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { showErr('Please select an image file.'); return }
    if (fileRef.current) fileRef.current.value = ''
    setUploadingAvatar(true)
    setErrMsg('')
    const localPreview = URL.createObjectURL(file)
    setAvatarUrl(localPreview)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const filePath = user.id + '/avatar.' + ext
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, contentType: file.type })
    if (upErr) {
      console.warn('Storage upload failed:', upErr.message, '- falling back to base64')
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const { error: upd } = await supabase.auth.updateUser({ data: { avatar_url: base64 } })
        setUploadingAvatar(false)
        if (upd) { showErr(upd.message); return }
        setAvatarUrl(base64)
        showOk('Photo updated.')
      }
      reader.onerror = () => { setUploadingAvatar(false); showErr('Failed to read image.') }
      reader.readAsDataURL(file)
      return
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const newUrl = urlData.publicUrl + '?t=' + Date.now()
    const { error: upd } = await supabase.auth.updateUser({ data: { avatar_url: newUrl } })
    setUploadingAvatar(false)
    if (upd) { showErr(upd.message); return }
    setAvatarUrl(newUrl)
    showOk('Photo updated.')
  }

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/login')
  }

  const inputSt: React.CSSProperties = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '7px 12px',
    fontSize: '14px',
    outline: 'none',
    flex: 1,
    minWidth: 0,
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Profile</span>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <X size={15} />
          </button>
        </div>

        <div className="px-5 py-6 flex flex-col gap-5">

          <div className="flex flex-col items-center gap-2">
            <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-20 h-20 rounded-full object-cover" style={{ border: '2px solid var(--border)' }} />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white select-none" style={{ background: 'var(--accent)' }}>
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.5)' }}>
                {uploadingAvatar ? <Loader size={18} className="text-white animate-spin" /> : <Camera size={18} className="text-white" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)', border: '2px solid var(--bg-secondary)' }}>
                {uploadingAvatar ? <Loader size={10} className="text-white animate-spin" /> : <Camera size={10} className="text-white" />}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to change photo</p>
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Display name</label>
            {editingName ? (
              <div className="flex items-center gap-2">
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setDisplayName(storedName); setEditingName(false) } }}
                  style={inputSt} autoFocus
                  onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <button onClick={saveName} disabled={savingName} className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {savingName ? <Loader size={13} className="animate-spin" /> : <Check size={13} />}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{displayName}</span>
                <button onClick={() => setEditingName(true)} className="p-1 rounded-md transition-all" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  <Pencil size={13} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Email</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
              <Mail size={13} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{email}</span>
              <span className="text-xs px-2 py-0.5 rounded-full capitalize shrink-0" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                {provider}
              </span>
            </div>
          </div>

          {okMsg && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>{okMsg}</p>
          )}
          {errMsg && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>{errMsg}</p>
          )}

          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}>
            {loggingOut ? <Loader size={14} className="animate-spin" /> : <LogOut size={14} />}
            <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>
          </button>

        </div>
      </div>
    </div>
  )
}
