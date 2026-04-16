import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, ThumbsUp, ThumbsDown, Share, RefreshCw, MoreHorizontal, Code2 } from 'lucide-react'
import type { Message } from '../hooks/useChat'
import CanvasPanel from './CanvasPanel'

interface Props {
  message: Message
  isStreaming?: boolean
  isLast?: boolean
  onRegenerate?: () => void
  disabled?: boolean
}

// Renders streaming text with smooth word-by-word fade-in
function StreamingText({ content }: { content: string }) {
  const words = content.split(/(\s+)/)
  const prevLenRef = useRef(0)
  const currentLen = words.length

  useEffect(() => {
    prevLenRef.current = currentLen
  })

  const prevLen = prevLenRef.current

  return (
    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.75 }}>
      {words.map((word, i) => (
        <span
          key={i}
          className={i >= prevLen ? 'streaming-word' : ''}
          style={i >= prevLen ? { animationDelay: `${(i - prevLen) * 18}ms` } : {}}
        >
          {word}
        </span>
      ))}
      <span className="streaming-cursor" />
    </span>
  )
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const isDark = document.documentElement.classList.contains('light-theme') === false

  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block rounded-lg overflow-hidden my-3" style={{ border: '1px solid var(--border)' }}>
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{ margin: 0, fontSize: '13px', lineHeight: '1.6', padding: '16px' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

function ActionBtn({ onClick, title, active, disabled, children }: {
  onClick: () => void
  title: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-1.5 rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        background: active ? 'var(--bg-hover)' : 'transparent',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

export default function MessageBubble({ message, isStreaming, isLast, onRegenerate, disabled }: Props) {
  const isUser = message.role === 'user'
  const [liked, setLiked] = useState<'up' | 'down' | null>(null)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [canvasOpen, setCanvasOpen] = useState(false)

  const copyMessage = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareMessage = () => {
    navigator.clipboard.writeText(message.content)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2 message-fade-in max-w-3xl mx-auto w-full">
        <div
          className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed flex flex-col gap-2"
          style={{ background: 'var(--bubble-user)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          {message.images && message.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.images.map((img, i) => (
                <img
                  key={i}
                  src={`data:${img.mimeType};base64,${img.base64}`}
                  alt=""
                  className="max-w-[200px] max-h-[200px] rounded-xl object-cover"
                  style={{ border: '1px solid var(--border)' }}
                />
              ))}
            </div>
          )}
          {message.content && <span>{message.content}</span>}
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="flex items-start px-4 py-2 message-fade-in max-w-3xl mx-auto w-full">
      <div className="flex-1 min-w-0">
        <div className={`text-sm leading-relaxed${isStreaming ? ' streaming-bubble rounded-xl px-3 py-2 -mx-3 -my-2' : ''}`}
          style={isStreaming ? { border: '1px solid var(--border)', background: 'transparent' } : {}}
        >
        {message.generatedImages && message.generatedImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-2">
            {message.generatedImages.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={`data:${img.mimeType};base64,${img.base64}`}
                  alt="Generated image"
                  className="rounded-2xl max-w-[320px] max-h-[320px] object-cover"
                  style={{ border: '1px solid var(--border)' }}
                />
                <a
                  href={`data:${img.mimeType};base64,${img.base64}`}
                  download={`generated-${i + 1}.png`}
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
        {message.content && (
          isStreaming
            ? <StreamingText content={message.content} />
            : <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || '')
              if (className?.includes('language-') && match) {
                return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
              }
              return (
                <code
                  className="rounded px-1.5 py-0.5 text-[13px] font-mono"
                  style={{ background: 'var(--bg-hover)', color: 'var(--accent)', border: '1px solid var(--border)' }}
                >
                  {children}
                </code>
              )
            },
            p({ children }) {
              return <p className="mb-3 last:mb-0" style={{ color: 'var(--text-primary)' }}>{children}</p>
            },
            ul({ children }) {
              return <ul className="list-disc list-inside mb-3 space-y-1" style={{ color: 'var(--text-secondary)' }}>{children}</ul>
            },
            ol({ children }) {
              return <ol className="list-decimal list-inside mb-3 space-y-1" style={{ color: 'var(--text-secondary)' }}>{children}</ol>
            },
            li({ children }) {
              return <li style={{ color: 'var(--text-secondary)' }}>{children}</li>
            },
            strong({ children }) {
              return <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>{children}</strong>
            },
            h1({ children }) {
              return <h1 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h1>
            },
            h2({ children }) {
              return <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h2>
            },
            h3({ children }) {
              return <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{children}</h3>
            },
            blockquote({ children }) {
              return (
                <blockquote
                  className="pl-3 italic my-2"
                  style={{ borderLeft: '2px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  {children}
                </blockquote>
              )
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
        )}
        </div>

        {/* Canvas output card */}
        {message.canvasHtml && (
          <div style={{
            marginTop: '8px', borderRadius: '14px', overflow: 'hidden',
            border: '1px solid var(--border)', background: 'var(--bg-hover)',
          }}>
            {/* Mini preview */}
            <div style={{ height: '180px', background: '#fff', pointerEvents: 'none', overflow: 'hidden' }}>
              <iframe
                srcDoc={message.canvasHtml}
                sandbox="allow-scripts allow-same-origin"
                style={{ width: '133%', height: '133%', border: 'none', transform: 'scale(0.75)', transformOrigin: 'top left' }}
                title="Canvas preview"
              />
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={13} /> Canvas
              </span>
              <button
                onClick={() => setCanvasOpen(true)}
                style={{
                  fontSize: '12px', fontWeight: 600, padding: '5px 14px',
                  borderRadius: '8px', background: 'var(--accent)', color: '#fff',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Open
              </button>
            </div>
          </div>
        )}

        {/* Action bar — shown on last AI message when not streaming */}
        {!isStreaming && isLast && (
          <div className="flex items-center gap-0.5 mt-2 msg-actions">
            {/* Copy */}
            <ActionBtn onClick={copyMessage} title="Copy" active={copied}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </ActionBtn>
            {/* Like */}
            <ActionBtn onClick={() => setLiked(liked === 'up' ? null : 'up')} title="Good response" active={liked === 'up'}>
              <ThumbsUp size={13} />
            </ActionBtn>
            {/* Dislike */}
            <ActionBtn onClick={() => setLiked(liked === 'down' ? null : 'down')} title="Bad response" active={liked === 'down'}>
              <ThumbsDown size={13} />
            </ActionBtn>
            {/* Share */}
            <ActionBtn onClick={shareMessage} title={shared ? 'Copied to clipboard' : 'Share'} active={shared}>
              <Share size={13} />
            </ActionBtn>
            {/* Regenerate */}
            {onRegenerate && (
              <ActionBtn onClick={onRegenerate} title="Regenerate" disabled={disabled}>
                <RefreshCw size={13} />
              </ActionBtn>
            )}
            {/* More */}
            <ActionBtn onClick={() => {}} title="More">
              <MoreHorizontal size={13} />
            </ActionBtn>
          </div>
        )}
      </div>
    </div>

    {canvasOpen && message.canvasHtml && (
      <CanvasPanel
        html={message.canvasHtml}
        onClose={() => setCanvasOpen(false)}
        onRegenerate={onRegenerate}
      />
    )}
    </>
  )
}
