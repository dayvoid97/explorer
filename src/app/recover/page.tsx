// app/recover/page.tsx
'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ShieldAlert } from 'lucide-react'
import { RecoverRequestForm } from '../components/RecoverRequest'
import { RecoverConfirmForm } from '../components/RecoverConfirm'

export default function RecoverPage() {
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/reset/initiateRecovery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier }),
        }
      )
      if (!res.ok) throw new Error('Could not find account')
      setStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirmPass) return setError('Passwords do not match')
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/reset/confirmRecovery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: identifier, code: code.join(''), newPassword: newPass }),
        }
      )
      if (!res.ok) throw new Error('Invalid code or session expired')
      router.push('/login?message=Success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-green-500/10 rounded-2xl mb-4">
          {step === 1 ? (
            <Mail className="text-green-500" size={32} />
          ) : (
            <Lock className="text-green-500" size={32} />
          )}
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          {step === 1 ? 'Recover' : 'Confirm'} Reset
        </h1>
        <p className="text-zinc-500 text-sm mt-2">
          {step === 1 ? 'Identify your account' : `Updating protocol for ${identifier}`}
        </p>
      </div>

      {step === 1 ? (
        <RecoverRequestForm
          identifier={identifier}
          setIdentifier={setIdentifier}
          onSubmit={handleRequest}
          loading={loading}
        />
      ) : (
        <RecoverConfirmForm
          code={code}
          inputsRef={inputsRef}
          newPass={newPass}
          setNewPass={setNewPass}
          confirmPass={confirmPass}
          setConfirmPass={setConfirmPass}
          handleInput={(val, i) => {
            const newCode = [...code]
            newCode[i] = val.slice(-1)
            setCode(newCode)
            if (val && i < 5) inputsRef.current[i + 1]?.focus()
          }}
          onSubmit={handleConfirm}
          loading={loading}
        />
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
          <ShieldAlert size={18} />
          <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
        </div>
      )}
    </main>
  )
}
