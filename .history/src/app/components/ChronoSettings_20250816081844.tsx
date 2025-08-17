'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Edit, Trash2, Save, Plus, X } from 'lucide-react'

type Chronology = {
  id: string
  name: string
  description: string
  categories: string[]
  winIds: { winId: string; title?: string; createdAt?: string }[]
}

export default function ChronologyManager() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Chronology>>({})

  // Fetch chronologies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await res.json()
        setChronologies(data.chronologies || [])
      } catch (err) {
        console.error('Error fetching chronologies:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle edit click
  const handleEdit = (chrono: Chronology) => {
    setEditingId(chrono.id)
    setFormData({ ...chrono })
  }

  // Handle save
  const handleSave = async () => {
    if (!editingId) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${editingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (res.ok) {
        setChronologies((prev) =>
          prev.map((c) => (c.id === editingId ? ({ ...c, ...formData } as Chronology) : c))
        )
        setEditingId(null)
      }
    } catch (err) {
      console.error('Error saving chronology:', err)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chronology?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) setChronologies((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Error deleting chronology:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Manage My Chronologies</h2>
      {chronologies.length === 0 && <p className="text-gray-500">No chronologies yet.</p>}

      {chronologies.map((chrono) => (
        <Card key={chrono.id} className="border rounded-2xl shadow-sm">
          <CardHeader className="flex justify-between items-center">
            {editingId === chrono.id ? (
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Chronology Name"
              />
            ) : (
              <CardTitle>{chrono.name}</CardTitle>
            )}
            <div className="flex gap-2">
              {editingId === chrono.id ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(chrono)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(chrono.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {editingId === chrono.id ? (
              <>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                />
                <Input
                  value={formData.categories?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categories: e.target.value.split(',').map((c) => c.trim()),
                    })
                  }
                  placeholder="Categories (comma separated)"
                />
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">{chrono.description}</p>
                <p className="text-xs text-gray-400">Categories: {chrono.categories?.join(', ')}</p>
              </>
            )}

            <div className="mt-2">
              <p className="font-medium text-sm">Wins:</p>
              <ul className="list-disc pl-6 text-sm text-gray-700">
                {chrono.winIds.map((w) => (
                  <li key={w.winId}>{w.title || w.winId}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
