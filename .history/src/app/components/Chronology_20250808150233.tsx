'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { Plus, X } from 'lucide-react'
import { authFetch } from '../lib/api'

interface ChronologyProps {
  winId: string
  userChronologies?: { id: string; name: string }[]
  onChronologyAdded?: (chronologyId: string, name: string) => void
  winCreatedAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const Chronology: React.FC<ChronologyProps> = ({ winId, onChronologyAdded }) => {
  const [showModal, setShowModal] = useState(false)
  const [chronologies, setChronologies] = useState<{ id: string; name: string }[]>([])
  const [newChronologyName, setNewChronologyName] = useState('')
  const [description, setDescription] = useState('')
  const [categoriesInput, setCategoriesInput] = useState('')
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loadingChronologies, setLoadingChronologies] = useState(false)

  const fetchUserChronologies = async () => {
    setLoadingChronologies(true)
    try {
      const res = await authFetch(`${API_URL}/gurkha/chronology`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch chronologies')
      setChronologies(data.chronologies || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to load chronologies')
    } finally {
      setLoadingChronologies(false)
    }
  }

  const handleAddToExisting = async (chronologyId: string) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await authFetch(`${API_URL}/gurkha/chronology/${chronologyId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to add win to Chronology')
      setSuccess('Added to Chronology!')
      const name = chronologies.find((c) => c.id === chronologyId)?.name || ''
      if (onChronologyAdded) onChronologyAdded(chronologyId, name)
      setTimeout(() => {
        setShowModal(false)
        setSuccess('')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = async () => {
    if (!newChronologyName.trim() || !description.trim() || !categoriesInput.trim()) {
      setError('Name, description, and categories are required.')
      return
    }

    const categories = categoriesInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await authFetch(`${API_URL}/gurkha/chronology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newChronologyName,
          description,
          categories,
          winIds: [winId],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create chronology')

      setSuccess('Chronology created and win added!')
      if (onChronologyAdded) onChronologyAdded(data.id, newChronologyName)

      setTimeout(() => {
        setShowModal(false)
        setShowCreateNew(false)
        setNewChronologyName('')
        setDescription('')
        setCategoriesInput('')
        setSuccess('')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    setShowModal(true)
    fetchUserChronologies()
  }

  const handleClose = () => {
    setShowModal(false)
    setShowCreateNew(false)
    setNewChronologyName('')
    setDescription('')
    setCategoriesInput('')
    setError('')
    setSuccess('')
  }

  return (
    <>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full border  transition"
        title="Add to Chronology"
        onClick={handleOpenModal}
        aria-label="Add to Chronology"
      >
        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className=" p-6 max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add to Chronology</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded text-green-700 dark:text-green-300 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {!showCreateNew ? (
              <div className="space-y-2">
                {loadingChronologies ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                ) : chronologies.length > 0 ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Chronologies
                    </h4>
                    <div className="space-y-1">
                      {chronologies.map((chronology) => (
                        <button
                          key={chronology.id}
                          onClick={() => handleAddToExisting(chronology.id)}
                          disabled={loading}
                          className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-blue-700 dark:text-blue-300"
                        >
                          {chronology.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    You don’t have any chronologies yet.
                  </p>
                )}

                <button
                  onClick={() => setShowCreateNew(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Create New Chronology
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chronology Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newChronologyName}
                    onChange={(e) => setNewChronologyName(e.target.value)}
                    placeholder="Enter chronology name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the purpose or theme of this chain..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Categories <span className="text-red-500">*</span>{' '}
                    <span className="text-gray-400">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={categoriesInput}
                    onChange={(e) => setCategoriesInput(e.target.value)}
                    placeholder="e.g. Recovery, Business, Mindset"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleCreateNew}
                    disabled={loading || !newChronologyName || !description || !categoriesInput}
                    className="flex-1"
                  >
                    {loading ? 'Creating...' : 'Create & Add'}
                  </Button>
                  <Button
                    onClick={() => setShowCreateNew(false)}
                    variant="outline"
                    disabled={loading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Chronology
