import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, X, Image, PenLine, Globe, Search, Mic, MicOff, Brain, Paperclip, Plus, MoreHorizontal, ChevronRight } from 'lucide-react'

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

const PLUS_MENU = [
  {
    id: 'upload',
    label: 'Upload photos & files',
    icon: <Paperclip size={18} />,
    dividerAfter: true,
  },
  {
    id: 'image',
    label: 'Create image',
    icon: <Image size={18} />,
    mode: 'image' as ChatMode,
  },
  {
    id: 'thinking',
    label: 'Thinking',
    icon: <Brain size={18} />,
    mode: 'thinking' as ChatMode,
  },
  {
    id: 'deep-search',
    label: 'Deep research',
    icon: <Globe size={18} />,
    mode: 'deep-search' as ChatMode,
  },
  {
    id: 'more',
    label: 'More',
    icon: <MoreHorizontal size={18} />,
    hasArrow: true,
    subItems: [
      { id: 'canvas',     label: 'Canvas',     icon: <PenLine size={16} />, mode: 'canvas' as ChatMode },
      { id: 'web-search', label: 'Web Search', icon: <Search size={16} />, mode: 'web-search' as ChatMode },
    ],
  },
]

const TOOL_LABELS: Record<ChatMode, string> = {
  default: '',
  image: 'Create Image',
  canvas: 'Canvas',
  'deep-search': 'Deep Research',
  'web-search': 'Web Search',
  thinking: 'Thinking',
}

const TOOL_ICONS: Record<ChatMode, React.ReactNode> = {
  default: null,
  image: <Image size={14} />,
  canvas: <PenLine size={14} />,
  'deep-search': <Globe size={14} />,
  'web-search': <Search size={14} />,
  thinking: <Brain size={14} />,
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
const hasSpeech = !!SpeechRecognition

export default function InputBox({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [activeMode, setActiveMode] = useState<ChatMode>('default')
  const [plusOpen, setPlusOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const plusMenuRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => () => recognitionRef.current?.abort(), [])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, window.innerWidth < 640 ? 120 : 200) + 'px'
  }, [value])

  useEffect(() => {
    if (!plusOpen) { setMoreOpen(false); return }
    const handler = (e: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target as Node)) {
        setPlusOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [plusOpen])

  const toggleVoice = useCallback(() => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
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

  const handlePlusItem = (item: typeof PLUS_MENU[number]) => {
    if (item.id === 'upload') {
      fileRef.current?.click()
      setPlusOpen(false)
      return
    }
    if (item.id === 'more') return // handled by hover
    if (item.mode) {
      setActiveMode(prev => prev === item.mode ? 'default' : item.mode!)
      setPlusOpen(false)
    }
  }

  const handleSubItem = (mode: ChatMode) => {
    setActiveMode(prev => prev === mode ? 'default' : mode)
    setPlusOpen(false)
  }

  const canSend = (value.trim().length > 0 || images.length > 0) && !disabled

  const placeholder =
    activeMode === 'thinking'     ? 'Ask anything — AI will think step by step…' :
    activeMode === 'image'        ? 'Describe the image you want to create…' :
    activeMode === 'canvas'       ? 'Describe the website or app to build…' :
    activeMode === 'web-search'   ? 'Search the web for anything…' :
    activeMode === 'deep-search'  ? 'What do you want to research in depth?' :
    images.length > 0             ? 'Add a message or send image…' : 'Ask anything…'

  return (
    <div className="px-4 pb-4 pt-2">
      <style>{`
        @keyframes plusMenuPop {
          from { opacity:0; transform: scale(0.92) translateY(8px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes micPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(1.18); }
        }
      `}</style>
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
          {activeMode !== 'default' && (
            <div className="flex items-center gap-1.5 px-4 pt-3">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {TOOL_ICONS[activeMode]}
                {TOOL_LABELS[activeMode]}
                <button onClick={() => setActiveMode('default')} style={{ marginLeft: '2px', opacity: 0.8, lineHeight: 1 }}>
                  <X size={10} />
                </button>
              </span>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2 px-4 py-3">

            {/* Plus button */}
            <div className="relative shrink-0 mb-0.5" ref={plusMenuRef}>
              <button
                title="More options"
                onClick={() => setPlusOpen(o => !o)}
                disabled={disabled}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: plusOpen ? 'var(--accent)' : 'transparent',
                  border: '1.5px solid var(--border)',
                  color: plusOpen ? '#fff' : 'var(--text-muted)',
                }}
                onMouseEnter={e => { if (!plusOpen) e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { if (!plusOpen) e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <Plus size={16} style={{ transform: plusOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {plusOpen && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    left: 0,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '8px',
                    minWidth: '220px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
                    animation: 'plusMenuPop 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                    zIndex: 100,
                    overflow: 'visible',
                  }}
                >
                  {PLUS_MENU.map((item) => (
                    <div
                      key={item.id}
                      style={{ position: 'relative' }}
                      onMouseEnter={() => {
                        if (item.hasArrow) {
                          if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current)
                          setMoreOpen(true)
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.hasArrow) {
                          moreTimeoutRef.current = setTimeout(() => setMoreOpen(false), 120)
                        }
                      }}
                    >
                      <button
                        onClick={() => handlePlusItem(item)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                        style={{
                          color: (item.mode && activeMode === item.mode) ? 'var(--accent)' : 'var(--text-primary)',
                          background: (item.hasArrow && moreOpen) ? 'var(--bg-hover)' : 'transparent',
                          fontWeight: 500,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                        onMouseLeave={e => { if (!(item.hasArrow && moreOpen)) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span style={{ color: (item.mode && activeMode === item.mode) ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.hasArrow && (
                          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </button>

                      {/* Flyout submenu on hover */}
                      {item.hasArrow && moreOpen && (
                        <div
                          onMouseEnter={() => { if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current) }}
                          onMouseLeave={() => { moreTimeoutRef.current = setTimeout(() => setMoreOpen(false), 120) }}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: 'calc(100% + 6px)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '14px',
                            padding: '6px',
                            minWidth: '180px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            animation: 'plusMenuPop 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                            zIndex: 101,
                          }}
                        >
                          {item.subItems?.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => handleSubItem(sub.mode)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                              style={{
                                color: activeMode === sub.mode ? 'var(--accent)' : 'var(--text-primary)',
                                background: 'transparent',
                                fontWeight: 500,
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                            >
                              <span style={{ color: activeMode === sub.mode ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>{sub.icon}</span>
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {item.dividerAfter && (
                        <div style={{ height: '1px', background: 'var(--border)', margin: '6px 4px' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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

            {/* Send / Voice */}
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
