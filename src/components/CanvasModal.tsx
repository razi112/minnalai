import { useRef, useState, useEffect } from 'react'
import { X, Trash2, Download } from 'lucide-react'

interface Props { onClose: () => void }

const COLORS = ['#ececec', '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
const SIZES = [2, 5, 10, 18]

export default function CanvasModal({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#ececec')
  const [size, setSize] = useState(5)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0f0f0f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true)
    lastPos.current = getPos(e)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return
    e.preventDefault()
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e)
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const stopDraw = () => { setDrawing(false); lastPos.current = null }

  const clear = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0f0f0f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const download = () => {
    const canvas = canvasRef.current!
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'canvas.png'
    a.click()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '20px', width: 'min(640px, 96vw)',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Canvas</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={clear} title="Clear" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <Trash2 size={16} />
            </button>
            <button onClick={download} title="Download" style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <Download size={16} />
            </button>
            <button onClick={onClose} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Colors */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: c, border: color === c ? '2px solid #fff' : '2px solid transparent',
                  cursor: 'pointer', padding: 0,
                }}
              />
            ))}
          </div>
          {/* Sizes */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  width: `${s + 10}px`, height: `${s + 10}px`, borderRadius: '50%',
                  background: size === s ? 'var(--accent)' : 'var(--bg-hover)',
                  border: '1px solid var(--border)', cursor: 'pointer', padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          style={{
            width: '100%', borderRadius: '12px', cursor: 'crosshair',
            border: '1px solid var(--border)', touchAction: 'none',
          }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  )
}
