import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, Paperclip, X, ChevronUp, Image, PenLine, Globe, Search, Mic, MicOff, Brain } from 'lucide-react'

interface ImageAttachment {
  base64: string
  mimeType: string
  previewUrl: string
}

export type ChatMode = 'default' | 'image' | 'canvas' | 'deep-search' | 'web-search' | 'thinking'

interface Props {
  onSend: (message: string, images: { base64: string; mimeType: string }[], mode: ChatMode) => void
  disabled?: boolean
}

const TOOLS = [
  { mode: 'thinking' as const,    label: 'Think',         icon: <Brain size={14} />,   desc: 'Reason step-by-step before answering' },
  { mode: 'image' as const,       label: 'Create Image',  icon: <Image size={14} />,   desc: 'Generate stunning AI images from text' },
  { mode: 'canvas' as const,      label: 'Canvas',        icon: <PenLine size={14} />, desc: 'Build a beautiful webpage with live preview' },
  { mode: 'web-search' as const,  label: 'Web Search',    icon: <Search size={14} />,  desc: 'Search DuckDuckGo + Wikipedia in real time' },
  { mode: 'deep-search' as const, label: 'Deep Research', icon: <Globe size={14} />,   desc: 'Structured multi-section research report' },
]

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
const hasSpeech = !!SpeechRecognition

export default function InputBox({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [activeMode, setActiveMode] = useState<ChatMode>('default')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => () => recognitionRef.current?.abort(), [])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, window.innerWidth < 640 ? 120 : 200) + 'px'
  }, [value])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const toggleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    if (!hasSpeech) return
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    let final = ''
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t + ' '
        else interim = t
      }
      setValue(final + interim)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }, [isListening])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).slice(0, 4 - images.length).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        const base64 = dataUrl.split(',')[1]
        setImages((prev) => [...prev, { base64, mimeType: file.type, previewUrl: dataUrl }])
      }
      reader.readAsDataURL(file)
    })
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx))

  const handleSend = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false) }
    const trimmed = value.trim()
    if ((!trimmed && images.length === 0) || disabled) return
    onSend(trimmed, images.map(({ base64, mimeType }) => ({ base64, mimeType })), activeMode)
    setValue('')
    setImages([])
    setActiveMode('default')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const selectTool = (mode: ChatMode) => {
    setMenuOpen(false)
    setActiveMode(prev => prev === mode ? 'default' : mode)
  }

  const canSend = (value.trim().length > 0 || images.length > 0) && !disabled
  const activeTool = TOOLS.find(t => t.mode === activeMode)

  const placeholder =
    activeMode === 'thinking' ? 'Ask anything — AI will think step by step…' :
    activeMode === 'image' ? 'Describe the image you want to create…' :
    activeMode === 'canvas' ? 'Describe the website or app to build…' :
    activeMode === 'web-search' ? 'Search the web for anything…' :
    activeMode === 'deep-search' ? 'What do you want to research in depth?' :
    images.length > 0 ? 'Add a message or send image…' : 'Ask anything…'

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative flex flex-col rounded-2xl transition-colors"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Image preview strip */}
          {images.length > 0 && (
            <div className="flex gap-2 px-4 pt-3 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative group shrink-0">
                  <img src={img.previewUrl} alt=""
                    className="w-16 h-16 rounded-xl object-cover"
                    style={{ border: '1px solid var(--border)' }}
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Active mode badge */}
          {activeMode !== 'default' && activeTool && (
            <div className="flex items-center gap-1.5 px-4 pt-3">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {activeTool.icon}
                {activeTool.label}
                <button onClick={() => setActiveMode('default')} style={{ marginLeft: '2px', opacity: 0.8, lineHeight: 1 }}>
                  <X size={10} />
                </button>
              </span>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2 px-4 py-3">
            {/* Attach */}
            <button
              title="Attach image"
              onClick={() => fileRef.current?.click()}
              disabled={disabled || images.length >= 4}
              className="shrink-0 p-1 transition-colors mb-0.5 disabled:opacity-30"
              style={{ color: images.length > 0 ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              <Paperclip size={16} />
            </button>

            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={disabled}
              className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed max-h-[120px] sm:max-h-[200px] overflow-y-auto disabled:opacity-50"
              style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)', WebkitAppearance: 'none' }}
            />

            {/* Tools button */}
            <div className="relative shrink-0 mb-0.5" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                disabled={disabled}
                title="Tools"
                className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                style={{
                  color: activeMode !== 'default' ? 'var(--accent)' : 'var(--text-muted)',
                  background: menuOpen ? 'var(--bg-hover)' : 'transparent',
                }}
              >
                <ChevronUp size={16} style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute', bottom: 'calc(100% + 8px)', right: 0,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '14px', padding: '6px', minWidth: 'min(200px, calc(100vw - 32px))',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    animation: 'menuPop 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                    zIndex: 100,
                  }}
                >
                  <style>{`
                    @keyframes menuPop {
                      from { opacity:0; transform: scale(0.92) translateY(6px); }
                      to   { opacity:1; transform: scale(1) translateY(0); }
                    }
                    @keyframes micPulse {
                      0%, 100% { opacity: 1; transform: scale(1); }
                      50%      { opacity: 0.3; transform: scale(1.18); }
                    }
                  `}</style>
                  {TOOLS.map(tool => {
                    const isActive = activeMode === tool.mode
                    return (
                      <button
                        key={tool.mode}
                        onClick={() => selectTool(tool.mode)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all text-left"
                        style={{
                          background: isActive ? 'var(--accent)' : 'transparent',
                          color: isActive ? '#fff' : 'var(--text-primary)',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span style={{ color: isActive ? '#fff' : 'var(--accent)', flexShrink: 0 }}>{tool.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{tool.label}</div>
                          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '1px' }}>{tool.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Send / Voice — one smart button */}
            {canSend ? (
              <button
                onClick={handleSend}
                title="Send message"
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
              >
                <ArrowUp size={15} />
              </button>
            ) : hasSpeech ? (
              <button
                onClick={toggleVoice}
                disabled={disabled}
                title={isListening ? 'Stop' : 'Voice input'}
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5 disabled:opacity-30"
                style={{
                  background: isListening ? 'var(--accent)' : 'var(--bg-hover)',
                  color: isListening ? '#fff' : 'var(--text-muted)',
                  position: 'relative',
                }}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                {isListening && (
                  <span style={{
                    position: 'absolute', inset: '-3px', borderRadius: '14px',
                    border: '2px solid var(--accent)',
                    animation: 'micPulse 1.2s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}
              </button>
            ) : (
              <button disabled className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mb-0.5"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', cursor: 'not-allowed' }}>
                <ArrowUp size={15} />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-2 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
          Press Enter to send · Shift+Enter for new line · Paste or drag images
        </p>
      </div>
    </div>
  )
}
