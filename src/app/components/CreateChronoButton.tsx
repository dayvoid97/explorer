'use client'

import React, { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { authFetch } from '../lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function CreateChronoButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form State
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState('')

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      setError('Chronology Name and Description are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const categoryArray = categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0)

      const res = await authFetch(`${API_URL}/gurkha/chronology/manage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          categories: categoryArray,
          winIds: [], // Creating an empty chronology
        }),
      })

      if (!res.ok) throw new Error('Failed to create chronology')

      // Success: Refresh the page to show the new entry and close modal
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
      >
        <Plus size={16} />
        New Chronology
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="animate-in fade-in absolute inset-0 bg-black/80 backdrop-blur-sm duration-200"
            onClick={() => !loading && setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="animate-in zoom-in-95 relative w-full max-w-md bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-2xl duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create a New Chronology</h2>

              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">
                  Chronology Title
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Funding Challenge Phase 1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this chain..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">
                  Categories (Comma separated)
                </label>
                <input
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Winners, Dubs, Exlore"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Create Chain
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
