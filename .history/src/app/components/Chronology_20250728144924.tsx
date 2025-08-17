import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Plus, Check, X } from 'lucide-react'
import { authFetch } from '../lib/api'

interface ChronologyProps {
  winId: string
  userChronologies: { id: string; name: string }[]
  onChronologyAdded?: (chronologyId: string) => void
  winCreatedAt: string
}

const Chronology: React.FC<ChronologyProps> = ({
  winId,
  userChronologies,
  onChronologyAdded,
  winCreatedAt,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [newChronologyName, setNewChronologyName] = useState('')
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleAddToExisting = async (chronologyId: string) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const selectedChronology = userChronologies.find((c) => c.id === chronologyId)
      const res = await authFetch(`${API_BASE}/gurkha/chronology/${chronologyId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winId,
          createdAt: winCreatedAt,
          name: selectedChronology ? selectedChronology.name : '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to add win to ChronoWlogy')
      setSuccess('Added to ChronoWlogy!')
      if (onChronologyAdded) onChronologyAdded(chronologyId)
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
    if (!newChronologyName.trim()) return
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      // Create new chronology
      const res = await authFetch(`${API_BASE}/gurkha/chronology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChronologyName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create chronology')
      // Add win to the new chronology
      const res2 = await authFetch(`${API_BASE}/gurkha/chronology/${data.id}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winId }),
      })
      const data2 = await res2.json()
      if (!res2.ok) throw new Error(data2.message || 'Failed to add win to chronology')
      setSuccess('Chronology created and win added!')
      if (onChronologyAdded) onChronologyAdded(data.id)
      setTimeout(() => {
        setShowModal(false)
        setShowCreateNew(false)
        setNewChronologyName('')
        setSuccess('')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setShowCreateNew(false)
    setNewChronologyName('')
    setError('')
    setSuccess('')
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        title="ChronoloWgy"
        onClick={() => setShowModal(true)}
        aria-label="Add to ChronoWlogy"
      >
        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add to ChronoWlogy
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success/Error Messages */}
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

            {/* Existing Chronologies */}
            {!showCreateNew && (
              <div className="space-y-2">
                {userChronologies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your ChronoWs
                    </h4>
                    <div className="space-y-1">
                      {userChronologies.map((chronology) => (
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
                )}

                {/* Create New Button */}
                <button
                  onClick={() => setShowCreateNew(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Create New ChronoWlogy
                  </span>
                </button>
              </div>
            )}

            {/* Create New Form */}
            {showCreateNew && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ChronoWlogy Name
                  </label>
                  <input
                    type="text"
                    value={newChronologyName}
                    onChange={(e) => setNewChronologyName(e.target.value)}
                    placeholder="Enter chronology name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateNew}
                    disabled={loading || !newChronologyName.trim()}
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
