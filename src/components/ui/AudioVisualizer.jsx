import { useEffect, useRef } from 'react'
import { callAudio } from '../../utils/callAudioEngine'

export function AudioVisualizer({ speakingSource = 'none', isMuted = false, isOnHold = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      if (isMuted) {
        // Draw flat line if muted
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(10, height / 2)
        ctx.lineTo(width - 10, height / 2)
        ctx.stroke()
        animationFrameId = requestAnimationFrame(render)
        return
      }

      if (isOnHold) {
        // Draw pulsing amber hold waves
        const now = Date.now() / 400
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 3
        ctx.beginPath()
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.05 + now) * 12
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        animationFrameId = requestAnimationFrame(render)
        return
      }

      const levels = callAudio.getVisualizerLevels(speakingSource)
      const barCount = levels.length
      const spacing = 4
      const totalSpacing = (barCount - 1) * spacing
      const barWidth = Math.max(3, (width - totalSpacing - 20) / barCount)

      levels.forEach((level, index) => {
        const x = 10 + index * (barWidth + spacing)
        const barHeight = Math.max(4, level * (height - 16))
        const y = (height - barHeight) / 2

        // Vibrant dynamic gradient based on speaker
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        if (speakingSource === 'customer') {
          gradient.addColorStop(0, '#60a5fa') // Blue/Indigo for customer
          gradient.addColorStop(1, '#818cf8')
        } else if (speakingSource === 'agent') {
          gradient.addColorStop(0, '#34d399') // Emerald green for agent
          gradient.addColorStop(1, '#10b981')
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)')
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, 4)
        } else {
          ctx.rect(x, y, barWidth, barHeight)
        }
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [speakingSource, isMuted, isOnHold])

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={64}
      style={{
        width: '100%',
        maxWidth: '280px',
        height: '64px',
        display: 'block',
        margin: '0 auto',
      }}
      aria-label="Real-time voice waveform"
    />
  )
}
