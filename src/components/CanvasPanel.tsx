import { useState, useRef } from 'react'
import { X, Copy, Check, RefreshCw, Code2 } from 'lucide-react'

interface Props {
  html: string
  onClose: () => void
  onRegenerate?: () => void
}

export default function CanvasPanel({ html, onClose, onRegenerate }: Props) {
  const isMobile = window.innerWidth < 640
  const [view, setView] = useState<'split' | 'preview' | 'code'>(isMobile ? 'preview' : 'split')
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const copy = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = ''
      setTimeout(() => { if (iframeRef.current) iframeRef.current.srcdoc = html }, 50)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: '20px', width: 'min(1100px, 96vw)', height: 'min(700px, 94vh)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          {/* View toggles */}
          <div style={{
            display: 'flex', gap: '4px', background: 'var(--bg-hover)',
            borderRadius: '10px', padding: '3px',
          }}>
            {([['split', 'Split'], ['preview', 'Preview'], ['code', 'Code']] as const).map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '4px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                background: view === v ? 'var(--bg-secondary)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none', cursor: 'pointer',
                boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Actions */}
          <button onClick={refresh} title="Refresh preview" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
            <RefreshCw size={15} />
          </button>
          <button onClick={copy} title="Copy HTML" style={{ color: copied ? 'var(--accent)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
          {onRegenerate && (
            <button onClick={onRegenerate} title="Regenerate" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
              <Code2 size={15} />
            </button>
          )}
          <button onClick={onClose} title="Close" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* Code pane */}
          {(view === 'split' || view === 'code') && (
            <div style={{
              width: view === 'split' ? '50%' : '100%',
              borderRight: view === 'split' ? '1px solid var(--border)' : 'none',
              overflow: 'auto', background: '#1a1a1a',
            }}>
              <pre style={{
                margin: 0, padding: '16px',
                fontSize: '12px', lineHeight: 1.7,
                color: '#ececec', fontFamily: 'monospace',
                whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {html}
              </pre>
            </div>
          )}

          {/* Preview pane */}
          {(view === 'split' || view === 'preview') && (
            <div style={{ flex: 1, background: '#fff', overflow: 'hidden' }}>
              <iframe
                ref={iframeRef}
                srcDoc={html}
                sandbox="allow-scripts allow-same-origin allow-forms"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Canvas Preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
