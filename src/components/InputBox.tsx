import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { ArrowUp, X, Image, PenLine, Globe, Search, Mic, MicOff, Brain, Square, Lock } from 'lucide-react'

interface ImageAttachment {
  base64: string
  mimeType: string
  previewUrl: string
}

export type ChatMode = 'default' | 'image' | 'canvas' | 'deep-search' | 'web-search' | 'thinking'

interface Props {
  onSend: (message: string, images: { base64: string; mimeType: string }[], mode: ChatMode) => void
  onStop?: () => void
  disabled?: boolean
  guestLimitReached?: boolean
}

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

export default function InputBox({ onSend, onStop, disabled, guestLimitReached }: Props) {
  const [value, setValue] = useState('')
  const [images, setImages] = useState<ImageAttachment[]>([])
  const [activeMode, setActiveMode] = useState<ChatMode>('default')
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => () => recognitionRef.current?.abort(), [])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, window.innerWidth < 640 ? 120 : 200) + 'px'
  }, [value])

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

  const canSend = (value.trim().length > 0 || images.length > 0) && !disabled

  const placeholder =
    activeMode === 'thinking'     ? 'Ask anything — AI will think step by step…' :
    activeMode === 'image'        ? 'Describe the image you want to create…' :
    activeMode === 'canvas'       ? 'Describe the website or app to build…' :
    activeMode === 'web-search'   ? 'Search the web for anything…' :
    activeMode === 'deep-search'  ? 'What do you want to research in depth?' :
    images.length > 0             ? 'Add a message or send image…' : 'Ask anything…'

  // ── Guest limit reached — show disabled input (redirect handled by App) ──
  if (guestLimitReached) {
    return (
      <div className="px-4 pb-4 pt-2">
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4"
            style={{
              background: 'var(--bg-hover)',
              border: '1px dashed var(--border)',
              opacity: 0.6,
              cursor: 'not-allowed',
            }}
          >
            <Lock size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Redirecting to sign in…
            </span>
          </div>
        </div>
      </div>
    )
  }

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

            {/* Stop / Send / Voice */}
            {disabled ? (
              <button
                onClick={onStop}
                title="Stop generating"
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5"
                style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : canSend ? (
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
                title={isListening ? 'Stop' : 'Voice input'}
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 mb-0.5"
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
         AI Islam can make mistakes, ask scholars for confirmation.
        </p>
      </div>
    </div>
  )
}
