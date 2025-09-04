'use client'

import React, { useEffect, useRef } from 'react'

interface StardustBackgroundProps {
  children: React.ReactNode
}

export default function StardustBackground({ children }: StardustBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Simple stars array
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.01,
    }))

    let time = 0

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a1e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01

      // Draw simple twinkling stars
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.speed * 100 + star.x) * 0.5 + 0.5
        ctx.globalAlpha = star.opacity * twinkle
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Simple animated background */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
      {/* Subtle gradient overlay */}
      <div
        className="-z-5 fixed inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(1, 1, 50, 0.9) 0%, rgba(98, 36, 234, 0.6) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
