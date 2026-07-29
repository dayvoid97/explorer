'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '../lib/auth'
import Image from 'next/image'
import { Trophy, ArrowRight, Zap, UserPlus, Sparkles } from 'lucide-react'

import careerStaked from '../../../public/career-staked.png'

export default function PromoBanner() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  // Check auth state on mount
  useEffect(() => {
    setAuthenticated(isLoggedIn())
  }, [])

  const handleJoinClick = () => router.push('/login')
  const handlePostClick = () => router.push('/blog')

  // VIEW A: For Logged-In Users (The Strum App Promotion)
  if (authenticated) {
    return (
      <div className="group relative mt-8 mb-12">
        <div className="absolute -inset-0.5   rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-700"></div>
        <div className="relative rounded-2xl border border-white/5  p-6 shadow-2xl transition hover:border-white/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2"></div>
              <h3 className="text-2xl  font-bold text-white tracking-tighter italic">
                STRUM VIBES - iOS APP Coming Soon
              </h3>
              <p className="text-white text-xs font-medium max-w-xs leading-relaxed">
                A new way to discover social. Coming soon.
              </p>
              <p className="text-zinc-200 text-xs font-medium max-w-xs leading-relaxed">
                Meanwhile, visit{' '}
                <a href="https://strum.tips" target="_blank" className=" font-bold">
                  strum.tips
                </a>{' '}
                to learn more
              </p>
              <button
                onClick={handlePostClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all"
              >
                Explore Articles By Financial Gurkha
              </button>
            </div>
            <div className="relative w-full md:w-48 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <a
                href="https://apps.apple.com/us/app/strum-vibe-together/id6654898214"
                target="_blank"
              >
                <Image
                  src={careerStaked}
                  alt="Strum App"
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // VIEW B: For Non-Logged In Users (User Acquisition)
  return (
    <div className="group relative mt-8 mb-12">
      {/* Intense Emerald Glow for Acquisition */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-700"></div>

      <div className="relative rounded-2xl border border-emerald-500/20 bg-[#050505] p-8 shadow-2xl transition hover:border-emerald-500/40">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Sparkles className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              Build Your <span className="text-emerald-500">Legacy.</span>
            </h3>
            <p className="text-zinc-400 text-sm font-medium max-w-md leading-relaxed">
              Don't just win in silence. Post Your Dubs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={handleJoinClick}
              className="flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <UserPlus size={16} />
              Claim Your Profile
            </button>
          </div>

          <p className="text-[12px] text-zinc-200 font-bold uppercase tracking-[0.2em]">
            Financial Gurkha is for the winners
          </p>
        </div>
      </div>
    </div>
  )
}
