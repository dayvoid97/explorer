'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { storeTokens } from '../lib/auth'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
import { trackEvent } from '../lib/analytics'

// Particle interface for TypeScript
interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  twinkle: number
  color: string
}

// Star interface
interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

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

    // Create particles array
    const particles: Particle[] = []
    const stars: Star[] = []
    const particleCount = 150
    const starCount = 80

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: 0,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 80%)`, // Blue to purple range
      })
    }

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }

    let time = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)' // Dark space background with trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.02

      // Draw and update stars
      stars.forEach((star) => {
        star.twinkleOffset += star.twinkleSpeed
        const twinkleOpacity = (Math.sin(star.twinkleOffset) + 1) * 0.5 * star.opacity

        ctx.save()
        ctx.globalAlpha = twinkleOpacity
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()

        // Create star shape
        const spikes = 4
        const outerRadius = star.size
        const innerRadius = star.size * 0.4

        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (i * Math.PI) / spikes
          const x = star.x + Math.cos(angle) * radius
          const y = star.y + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()

        // Add glow effect
        ctx.shadowColor = '#ffffff'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.restore()
      })

      // Draw and update particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Update twinkle effect
        particle.twinkle += 0.05
        const twinkleMultiplier = (Math.sin(particle.twinkle) + 1) * 0.5 + 0.5

        // Wrap around screen edges
        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = particle.opacity * twinkleMultiplier

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        )
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(0.4, particle.color.replace('80%)', '40%)'))
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw bright center
        ctx.globalAlpha = particle.opacity * twinkleMultiplier * 1.5
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Add connecting lines between nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = (1 - distance / 100) * 0.1
            ctx.strokeStyle = '#4a90e2'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      // Add floating cosmic dust
      ctx.save()
      ctx.globalAlpha = 0.3
      for (let i = 0; i < 20; i++) {
        const x = Math.sin(time + i) * 200 + canvas.width / 2
        const y = Math.cos(time * 0.8 + i) * 150 + canvas.height / 2
        const size = Math.sin(time * 2 + i) * 2 + 2

        ctx.fillStyle = `hsl(${280 + Math.sin(time + i) * 30}, 60%, 70%)`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/gurkha/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Login failed')
      }

      trackEvent('user_logged_in', { username: form.username })

      if (data.accessToken && data.refreshToken) {
        storeTokens(data.accessToken, data.refreshToken, data.notificationToken)
        router.push('/profile')
      } else {
        throw new Error('Login successful, but tokens were not received from the server.')
      }
    } catch (err: any) {
      console.error('Frontend login error:', err)
      setError(err.message)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ background: 'linear-gradient(135deg, #0a0a1e 0%, #1a0f2e 50%, #2d1b3d 100%)' }}
      />

      {/* Overlay for better text readability */}
      <div className="-z-5 fixed inset-0 bg-black bg-opacity-20"></div>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Magical Container */}
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Magical glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-xl"></div>

            <div className="relative">
              <h1 className="text-4xl font-bold mb-2 text-center text-white drop-shadow-lg">
                Welcome Back
              </h1>
              <h2 className="text-xl mb-8 text-center text-purple-200 font-light">
                Let the magic begin ✨
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <input
                    name="username"
                    placeholder="Enter your username"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  />
                  <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  Enter the Portal
                </button>
              </form>

              <div className="mt-8 text-center space-y-4">
                <a
                  href="/signup"
                  className="block text-blue-200 hover:text-blue-100 underline decoration-blue-300 underline-offset-4 text-lg transition-colors duration-300"
                >
                  New to the Universe? Join Us ✨
                </a>

                <a
                  href="/recover"
                  className="block text-purple-200 hover:text-purple-100 underline decoration-purple-300 underline-offset-4 transition-colors duration-300"
                >
                  Lost in Space? Recover Your Account 🌟
                </a>
              </div>
            </div>
          </div>

          {/* Floating magical elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute -bottom-10 -right-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>
      </main>

      {/* Additional magical floating elements */}
      <div className="fixed top-1/4 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
      <div
        className="fixed top-1/3 right-20 w-1 h-1 bg-blue-300 rounded-full opacity-80 animate-ping"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="fixed bottom-1/4 left-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 animate-ping"
        style={{ animationDelay: '3s' }}
      ></div>
    </div>
  )
}
