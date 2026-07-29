'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, ShieldCheck, Mail, Send } from 'lucide-react'

function VerifyContent() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'success'>('idle')
  const [codeSent, setCodeSent] = useState(false) // New state to lock the button
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const router = useRouter()
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const email = searchParams.get('email') || ''

  useEffect(() => {
    if (!email) {
      router.push('/profile')
    }
  }, [email, router])

  const handleSendCode = async () => {
    if (codeSent) return // Safety check

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/reset/initiateVerify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send code')

      setCodeSent(true) // Lock the button on success
      setStatus('idle')
    } catch (err: any) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const handleVerify = async () => {
    setStatus('verifying')
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/reset/confirmVerify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: code.join('') }),
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Invalid Code')

      setStatus('success')
      setTimeout(() => router.push('/profile'), 2000)
    } catch (err: any) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const val = e.target.value.slice(-1)
    if (!/^\d*$/.test(val)) return

    const newCode = [...code]
    newCode[i] = val
    setCode(newCode)

    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  if (status === 'success') {
    return (
      <div className="animate-in zoom-in flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Profile Verified</h2>
        <p className="text-zinc-500 text-sm">Transmission successful. Redirecting...</p>
      </div>
    )
  }

  return (
    <main className="max-w-md mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-4">
          <ShieldCheck className="text-blue-500" size={32} />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          Security Verification
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          Verify access for: <br />
          <span className="text-white font-bold">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Updated Button Logic */}
        <button
          onClick={handleSendCode}
          disabled={status === 'sending' || codeSent}
          className={`w-full py-4 border rounded-2xl text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 
            ${
              codeSent
                ? 'bg-green-500/10 border-green-500/50 text-green-500 cursor-not-allowed'
                : 'bg-black border-white/10 text-white hover:bg-zinc-900 active:scale-95'
            } 
            disabled:opacity-70`}
        >
          {status === 'sending' ? (
            'Sending...'
          ) : codeSent ? (
            <>
              <CheckCircle2 size={16} /> Code Sent Successfully
            </>
          ) : (
            <>
              <Mail size={16} /> Request Verification Code
            </>
          )}
        </button>

        <div className="flex justify-between gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-full h-14 bg-zinc-950 text-white border border-white/10 rounded-xl text-center text-xl font-bold focus:border-blue-500 outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={code.includes('') || status === 'verifying'}
          className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest active:scale-95 transition-all disabled:opacity-50"
        >
          {status === 'verifying' ? 'Verifying...' : 'Finalize Verification'}
        </button>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-500 text-center text-[10px] font-bold uppercase tracking-widest">
              {error}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
export default function ProfileVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
          Initializing Security...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
