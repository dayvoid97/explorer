'use client'

import { useState } from 'react'
import useUploader from '../hooks/useUploader'
import { getToken } from '../lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Image, Video, FileText, BarChart2, Upload } from 'lucide-react'

export default function MediaUploader({ cardId }: { cardId: string }) {
  const { uploadFile } = useUploader()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'image' | 'video' | 'document' | 'chart' | ''>('')
  const [status, setStatus] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleUpload = async () => {
    if (!file || !type) return setStatus('⚠️ Select media type and file.')
    try {
      const fileUrl = await uploadFile(file, type)

      const token = getToken()
      const res = await fetch(`/api/gurkha/companycard/add-item`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          item: {
            title,
            description,
            url: fileUrl,
            type,
            mimeType: file.type,
            isDraft: false,
          },
        }),
      })

      if (!res.ok) throw new Error('Failed to add item to card')
      setStatus('✅ Uploaded successfully!')
      setTitle('')
      setDescription('')
      setFile(null)
      setType('')
    } catch (err) {
      console.error(err)
      setStatus('❌ Upload failed.')
    }
  }

  const mediaOptions = [
    { label: 'Image', icon: <Image size={16} />, value: 'image' },
    { label: 'Video', icon: <Video size={16} />, value: 'video' },
    { label: 'Document', icon: <FileText size={16} />, value: 'document' },
    { label: 'Chart', icon: <BarChart2 size={16} />, value: 'chart' },
  ]

  return (
    <div className="mt-8">
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="bg-muted hover:bg-muted/70 border-border flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
        >
          <Plus size={18} />
          Add Media
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-background border-border absolute mt-2 z-10 w-40 border rounded-xl shadow-lg p-2 space-y-1"
            >
              {mediaOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setType(opt.value as any)
                    setOpen(false)
                  }}
                  className="hover:bg-muted w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg"
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {type && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-border bg-card mt-6 border rounded-xl p-5 space-y-4 shadow"
        >
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Upload size={18} />
            Upload {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-background text-foreground w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background text-foreground w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            accept={
              type === 'image'
                ? 'image/*'
                : type === 'video'
                ? 'video/*'
                : type === 'document'
                ? 'application/pdf'
                : undefined
            }
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            className="w-full file:cursor-pointer"
          />

          {file && <p className="text-muted-foreground text-sm">Selected: {file.name}</p>}

          <button
            onClick={handleUpload}
            className="bg-primary hover:bg-primary/90 w-full text-white px-4 py-2 rounded"
          >
            Upload to Card
          </button>

          {status && <p className="text-sm">{status}</p>}
        </motion.div>
      )}
    </div>
  )
}
